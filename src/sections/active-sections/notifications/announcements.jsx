import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    MenuItem,
    Stack,
    Switch,
    Tooltip,
    Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { ConfirmDialog } from 'src/components/custom-dialog';
import { Field, Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';
import { useBoolean } from 'src/hooks/use-boolean';
import {
    useCreateAnnouncementMutation,
    useDeleteAnnouncementMutation,
    useGetAnnouncementsQuery,
    useGetNotificationSegmentsQuery,
    useUpdateAnnouncementMutation,
} from 'src/store/Reducer/announcements-api';
import { handleApiError } from 'src/utils/errorHandler';

import { AUDIENCE_SEGMENTS } from './push-compaign-composer';

const STATUS_CONFIG = {
    scheduled: { label: 'Scheduled', color: 'info' },
    active: { label: 'Active', color: 'success' },
    inactive: { label: 'Inactive', color: 'default' },
};

const SEGMENT_TO_TYPE = {
    everyone: 'everyone',
    byArea: 'area',
    byCategory: 'category',
    byActivity: 'activity',
};

const TYPE_TO_SEGMENT = {
    everyone: 'everyone',
    area: 'byArea',
    city: 'byArea',
    category: 'byCategory',
    activity: 'byActivity',
};

const defaultValues = {
    title: '',
    description: '',
    audienceSegment: 'everyone',
    area: '',
    category: '',
    activity: '',
    publishAt: dayjs().add(1, 'hour').format(),
};

const schema = zod
    .object({
        title: zod.string().min(1, 'Title is required'),
        description: zod.string().min(1, 'Description is required'),
        audienceSegment: zod.string().min(1, 'Audience segment is required'),
        area: zod.string().optional(),
        category: zod.string().optional(),
        activity: zod.string().optional(),
        publishAt: zod.union([zod.string(), zod.number()]).optional(),
    })
    .superRefine((data, ctx) => {
        if (data.audienceSegment === 'byArea' && !data.area) {
            ctx.addIssue({ code: zod.ZodIssueCode.custom, message: 'Area is required', path: ['area'] });
        }
        if (data.audienceSegment === 'byCategory' && !data.category) {
            ctx.addIssue({
                code: zod.ZodIssueCode.custom,
                message: 'Category is required',
                path: ['category'],
            });
        }
        if (data.audienceSegment === 'byActivity' && !data.activity) {
            ctx.addIssue({
                code: zod.ZodIssueCode.custom,
                message: 'Activity is required',
                path: ['activity'],
            });
        }
    });

const buildAudience = (data) => {
    const type = SEGMENT_TO_TYPE[data.audienceSegment] || 'everyone';
    if (type === 'area') return { type, value: data.area || '' };
    if (type === 'category') return { type, value: data.category || '' };
    if (type === 'activity') return { type, value: data.activity || '' };
    return { type: 'everyone', value: '' };
};

const formatPublishAt = (value) => {
    if (!value) return null;
    const parsed = dayjs(value);
    return parsed.isValid() ? parsed.format('YYYY-MM-DDTHH:mm') : null;
};

const getAnnouncementStatus = (announcement) => {
    if (!announcement.active) return 'inactive';
    if (announcement.publishAt && dayjs(announcement.publishAt).isAfter(dayjs())) return 'scheduled';
    return 'active';
};

const getAudienceLabel = (announcement, segments) => {
    const type = announcement.audience?.type;
    const value = announcement.audience?.value;
    if (!type || type === 'everyone') return 'Everyone';

    if (type === 'area' || type === 'city') {
        const label = segments.areas.find((item) => item.value === value)?.label || value;
        return `Area: ${label || '—'}`;
    }
    if (type === 'category') {
        const match = segments.categories.find((item) => (item._id || item.value) === value);
        const label = match?.name || match?.label || value;
        return `Category: ${label || '—'}`;
    }
    if (type === 'activity') {
        const label = segments.activities.find((item) => item.value === value)?.label || value;
        return `Activity: ${label || '—'}`;
    }
    return 'Everyone';
};

const Announcements = ({ title, icon, subheader }) => {
    const openDialog = useBoolean();
    const confirm = useBoolean();
    const [selectedDeleteId, setSelectedDeleteId] = useState(null);
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);
    const [togglingId, setTogglingId] = useState(null);

    const { data, isLoading, error } = useGetAnnouncementsQuery();
    const [createAnnouncement] = useCreateAnnouncementMutation();
    const [updateAnnouncement] = useUpdateAnnouncementMutation();
    const [deleteAnnouncement, { isLoading: isDeleting }] = useDeleteAnnouncementMutation();

    const announcements = data?.data || [];

    const methods = useForm({
        resolver: zodResolver(schema),
        defaultValues,
    });

    const { handleSubmit, reset, watch, setValue, formState } = methods;
    const audienceSegment = watch('audienceSegment');

    const { data: segmentsData } = useGetNotificationSegmentsQuery();

    const segments = useMemo(
        () => ({
            categories: segmentsData?.categories || [],
            areas: segmentsData?.areas || [],
            activities: segmentsData?.activities || [],
        }),
        [segmentsData]
    );

    useEffect(() => {
        if (error) handleApiError(error);
    }, [error]);

    const handleAudienceSegmentChange = (event) => {
        setValue('audienceSegment', event.target.value, { shouldValidate: true });
        setValue('area', '');
        setValue('category', '');
        setValue('activity', '');
    };

    const handleOpenDialog = () => {
        setEditingAnnouncement(null);
        reset(defaultValues);
        openDialog.onTrue();
    };

    const handleOpenEditDialog = (announcement) => {
        const segment = TYPE_TO_SEGMENT[announcement.audience?.type] || 'everyone';
        const value = announcement.audience?.value || '';
        setEditingAnnouncement(announcement);
        reset({
            title: announcement.title || '',
            description: announcement.description || '',
            audienceSegment: segment,
            area: segment === 'byArea' ? value : '',
            category: segment === 'byCategory' ? value : '',
            activity: segment === 'byActivity' ? value : '',
            publishAt: announcement.publishAt || defaultValues.publishAt,
        });
        openDialog.onTrue();
    };

    const handleCloseDialog = () => {
        openDialog.onFalse();
        setEditingAnnouncement(null);
        reset(defaultValues);
    };

    const onSubmit = handleSubmit(async (formData) => {
        try {
            const payload = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                audience: buildAudience(formData),
                publishAt: formatPublishAt(formData.publishAt),
            };

            const response = editingAnnouncement
                ? await updateAnnouncement({
                    id: editingAnnouncement._id,
                    ...payload,
                    active: editingAnnouncement.active !== false,
                }).unwrap()
                : await createAnnouncement(payload).unwrap();

            if (response.message) toast.success(response.message);
            handleCloseDialog();
        } catch (err) {
            handleApiError(err);
        }
    });

    const handleToggleStatus = async (announcement) => {
        if (togglingId) return;

        try {
            setTogglingId(announcement._id);
            const response = await updateAnnouncement({
                id: announcement._id,
                title: announcement.title,
                description: announcement.description,
                audience: announcement.audience,
                publishAt: announcement.publishAt || null,
                active: !announcement.active,
            }).unwrap();

            if (response.message) toast.success(response.message);
        } catch (err) {
            handleApiError(err);
        } finally {
            setTogglingId(null);
        }
    };

    const openDeleteConfirm = (id) => {
        setSelectedDeleteId(id);
        confirm.onTrue();
    };

    const handleDelete = async () => {
        if (!selectedDeleteId) return;

        try {
            const response = await deleteAnnouncement(selectedDeleteId).unwrap();
            if (response.message) toast.success(response.message);
            confirm.onFalse();
            setSelectedDeleteId(null);
        } catch (err) {
            handleApiError(err);
        }
    };

    return (
        <>
            <Card>
                <CardHeader
                    title={title}
                    subheader={subheader}
                    avatar={<Iconify icon={icon} />}
                    action={
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Iconify icon="mingcute:add-line" />}
                            onClick={handleOpenDialog}
                        >
                            New Announcement
                        </Button>
                    }
                />

                <CardContent sx={{ pt: 0 }}>
                    {isLoading ? (
                        <Stack alignItems="center" sx={{ py: 4 }}>
                            <CircularProgress size={28} />
                        </Stack>
                    ) : announcements.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                            No announcements yet.
                        </Typography>
                    ) : (
                        announcements.map((announcement, index) => {
                            const status = getAnnouncementStatus(announcement);
                            const statusConfig = STATUS_CONFIG[status];

                            return (
                                <Stack key={announcement._id}>
                                    <Stack
                                        direction={{ xs: 'column', sm: 'row' }}
                                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                                        justifyContent="space-between"
                                        spacing={1.5}
                                        sx={{ px: { xs: 2, sm: 3 }, py: 2, minWidth: 0 }}
                                    >
                                        <Stack spacing={0.5} sx={{ minWidth: 0, width: { xs: 1, sm: 'auto' } }}>
                                            <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap sx={{ minWidth: 0 }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600, minWidth: 0, overflowWrap: 'anywhere' }}>
                                                    {announcement.title}
                                                </Typography>
                                                <Chip
                                                    size="small"
                                                    variant="soft"
                                                    color={statusConfig.color}
                                                    label={statusConfig.label}
                                                />
                                            </Stack>

                                            <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>
                                                {announcement.description}
                                            </Typography>

                                            <Stack
                                                direction="row"
                                                alignItems="center"
                                                spacing={0.5}
                                                flexWrap="wrap"
                                                useFlexGap
                                                sx={{ color: 'text.disabled', mt: 0.5, minWidth: 0 }}
                                            >
                                                <Iconify icon="solar:users-group-rounded-bold" width={14} />
                                                <Typography variant="caption">
                                                    {getAudienceLabel(announcement, segments)}
                                                </Typography>

                                                {announcement.publishAt ? (
                                                    <>
                                                        <Iconify icon="solar:calendar-bold" width={14} sx={{ ml: 1.5 }} />
                                                        <Typography variant="caption">
                                                            {dayjs(announcement.publishAt).format('MMM D, YYYY • HH:mm')}
                                                        </Typography>
                                                    </>
                                                ) : null}
                                            </Stack>
                                        </Stack>

                                        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flexShrink: 0 }}>
                                            <Box
                                                sx={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: 58,
                                                    height: 38,
                                                }}
                                            >
                                                {togglingId === announcement._id ? (
                                                    <CircularProgress size={20} />
                                                ) : (
                                                    <Switch
                                                        checked={!!announcement.active}
                                                        onChange={() => handleToggleStatus(announcement)}
                                                    />
                                                )}
                                            </Box>
                                            <Tooltip title="Edit">
                                                <IconButton color="default" onClick={() => handleOpenEditDialog(announcement)}>
                                                    <Iconify icon="solar:pen-bold" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton color="error" onClick={() => openDeleteConfirm(announcement._id)}>
                                                    <Iconify icon="solar:trash-bin-trash-bold" />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </Stack>

                                    {index < announcements.length - 1 ? <Divider /> : null}
                                </Stack>
                            );
                        })
                    )}
                </CardContent>
            </Card>

            <Dialog open={openDialog.value} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <Form methods={methods} onSubmit={onSubmit}>
                    <DialogTitle>
                        {editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}
                    </DialogTitle>

                    <DialogContent>
                        <Stack spacing={3} sx={{ pt: 1 }}>
                            <Field.Text name="title" label="Announcement title" placeholder="Enter announcement title" />
                            <Field.Text
                                name="description"
                                label="Description"
                                placeholder="Enter announcement description"
                                multiline
                                rows={4}
                            />

                            <Field.Select
                                name="audienceSegment"
                                label="Audience Segment"
                                onChange={handleAudienceSegmentChange}
                            >
                                {AUDIENCE_SEGMENTS.map((segment) => (
                                    <MenuItem key={segment.value} value={segment.value}>
                                        {segment.label}
                                    </MenuItem>
                                ))}
                            </Field.Select>

                            {audienceSegment === 'byArea' ? (
                                <Field.Select name="area" label="Area">
                                    <MenuItem value="">Select area</MenuItem>
                                    <Divider sx={{ borderStyle: 'dashed' }} />
                                    {segments.areas.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Field.Select>
                            ) : null}

                            {audienceSegment === 'byCategory' ? (
                                <Field.Select name="category" label="Category">
                                    <MenuItem value="">Select category</MenuItem>
                                    <Divider sx={{ borderStyle: 'dashed' }} />
                                    {segments.categories.map((option) => (
                                        <MenuItem key={option._id || option.value} value={option._id || option.value}>
                                            {option.name || option.label}
                                        </MenuItem>
                                    ))}
                                </Field.Select>
                            ) : null}

                            {audienceSegment === 'byActivity' ? (
                                <Field.Select name="activity" label="Activity">
                                    <MenuItem value="">Select activity</MenuItem>
                                    <Divider sx={{ borderStyle: 'dashed' }} />
                                    {segments.activities.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Field.Select>
                            ) : null}

                            <Field.MobileDateTimePicker name="publishAt" label="Publish date & time" />
                        </Stack>
                    </DialogContent>

                    <DialogActions sx={{ px: 3, pb: 3 }}>
                        <Button onClick={handleCloseDialog} color="inherit">
                            Cancel
                        </Button>
                        <LoadingButton
                            type="submit"
                            variant="contained"
                            color="primary"
                            loading={formState.isSubmitting}
                        >
                            {editingAnnouncement ? 'Save Changes' : 'Create Announcement'}
                        </LoadingButton>
                    </DialogActions>
                </Form>
            </Dialog>

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Delete announcement"
                content="Are you sure you want to delete this announcement?"
                action={
                    <LoadingButton variant="contained" color="error" onClick={handleDelete} loading={isDeleting}>
                        Delete
                    </LoadingButton>
                }
            />
        </>
    );
};

export default Announcements;
