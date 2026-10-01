import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import { Box, Card, CardContent, CardHeader, Divider, MenuItem } from '@mui/material';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { Field, Form } from 'src/components/hook-form';
import { Iconify } from 'src/components/iconify';
import { toast } from 'src/components/snackbar';
import {
    useGetNotificationSegmentsQuery,
    useSendNotificationBySegmentsMutation,
} from 'src/store/Reducer/announcements-api';
import { handleApiError } from 'src/utils/errorHandler';

export const AUDIENCE_SEGMENTS = [
    { value: 'everyone', label: 'Everyone' },
    { value: 'byArea', label: 'By Area' },
    { value: 'byCategory', label: 'By Category' },
    { value: 'byActivity', label: 'By Activity' },
];

const SEGMENT_TO_TYPE = {
    everyone: 'everyone',
    byArea: 'area',
    byCategory: 'category',
    byActivity: 'activity',
};

const defaultValues = {
    title: '',
    message: '',
    audienceSegment: 'everyone',
    area: '',
    category: '',
    activity: '',
};

const schema = zod
    .object({
        title: zod.string().min(1, 'Title is required'),
        message: zod.string().min(1, 'Message is required'),
        audienceSegment: zod.string().min(1, 'Audience segment is required'),
        area: zod.string().optional(),
        category: zod.string().optional(),
        activity: zod.string().optional(),
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

const buildPayload = (data) => {
    const type = SEGMENT_TO_TYPE[data.audienceSegment] || 'everyone';
    if (type === 'area') return { type, value: data.area || '' };
    if (type === 'category') return { type, value: data.category || '' };
    if (type === 'activity') return { type, value: data.activity || '' };
    return { type: 'everyone', value: '' };
};

const PushCompaignComposer = ({ title, icon }) => {
    const { data: segmentsData } = useGetNotificationSegmentsQuery();
    const [sendNotificationBySegments] = useSendNotificationBySegmentsMutation();

    const segments = useMemo(
        () => ({
            categories: segmentsData?.categories || [],
            areas: segmentsData?.areas || [],
            activities: segmentsData?.activities || [],
        }),
        [segmentsData]
    );

    const methods = useForm({
        resolver: zodResolver(schema),
        defaultValues,
    });

    const { handleSubmit, reset, watch, setValue, formState } = methods;
    const audienceSegment = watch('audienceSegment');

    const handleAudienceSegmentChange = (event) => {
        setValue('audienceSegment', event.target.value, { shouldValidate: true });
        setValue('area', '');
        setValue('category', '');
        setValue('activity', '');
    };

    const onSubmit = handleSubmit(async (formData) => {
        try {
            const { type, value } = buildPayload(formData);
            const response = await sendNotificationBySegments({
                title: formData.title.trim(),
                body: formData.message.trim(),
                type,
                value,
            }).unwrap();

            if (response.message) toast.success(response.message);
            reset(defaultValues);
        } catch (error) {
            handleApiError(error);
        }
    });

    return (
        <Card>
            <CardHeader title={title} avatar={<Iconify icon={icon} />} />
            <CardContent>
                <Form methods={methods} onSubmit={onSubmit}>
                    <Field.Text name="title" label="Title" placeholder="New taps-in waiting for you" />
                    <Field.Text
                        name="message"
                        label="Message"
                        multiline
                        rows={4}
                        placeholder="Your barter's waiting - 3 new taps-in this week ✦"
                        sx={{ mt: 3 }}
                    />
                    <Field.Select
                        name="audienceSegment"
                        label="Audience Segment"
                        sx={{ mt: 3 }}
                        onChange={handleAudienceSegmentChange}
                    >
                        {AUDIENCE_SEGMENTS.map((segment) => (
                            <MenuItem key={segment.value} value={segment.value}>
                                {segment.label}
                            </MenuItem>
                        ))}
                    </Field.Select>

                    {audienceSegment === 'byArea' ? (
                        <Field.Select name="area" label="Area" sx={{ mt: 3 }}>
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
                        <Field.Select name="category" label="Category" sx={{ mt: 3 }}>
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
                        <Field.Select name="activity" label="Activity" sx={{ mt: 3 }}>
                            <MenuItem value="">Select activity</MenuItem>
                            <Divider sx={{ borderStyle: 'dashed' }} />
                            {segments.activities.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Field.Select>
                    ) : null}

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <LoadingButton
                            type="submit"
                            variant="contained"
                            color="primary"
                            loading={formState.isSubmitting}
                        >
                            Save Settings
                        </LoadingButton>
                    </Box>
                </Form>
            </CardContent>
        </Card>
    );
};

export default PushCompaignComposer;
