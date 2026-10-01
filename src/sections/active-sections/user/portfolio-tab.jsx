import { useState } from 'react';
import { alpha, Box, Card, Chip, Grid, Stack, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { Image } from 'src/components/image';
import { Lightbox } from 'src/components/lightbox';
import { useBoolean } from 'src/hooks/use-boolean';

export function PortfolioTab({ items = [] }) {
    const previewModal = useBoolean();

    const [activeItem, setActiveItem] = useState(null);
    const [previewIndex, setPreviewIndex] = useState(0);

    const slides = (activeItem?.images || []).map((img) => ({ src: img }));

    const handleOpenGallery = (item) => {
        setActiveItem(item);
        setPreviewIndex(0);
        previewModal.onTrue();
    };

    return (
        <Stack spacing={2}>
            <Box>
                <Typography variant="h6">Portfolio</Typography>
                <Typography variant="body2" color="text.secondary">
                    Showcased work, grouped by project.
                </Typography>
            </Box>

            {items.length > 0 ? (
                <Grid container spacing={3}>
                    {items.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item.id}>
                            <Card
                                sx={{
                                    borderRadius: 2,
                                    boxShadow: (theme) => theme.customShadows?.z8,
                                    transition: (theme) =>
                                        theme.transitions.create(['box-shadow', 'transform'], {
                                            duration: theme.transitions.duration.short,
                                        }),
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: (theme) => theme.customShadows?.z20,
                                        '& .portfolio-cover-img': { transform: 'scale(1.08)' },
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'relative',
                                        cursor: 'pointer',
                                        overflow: 'hidden',
                                    }}
                                    onClick={() => handleOpenGallery(item)}
                                >
                                    <Image
                                        className="portfolio-cover-img"
                                        src={item.images?.[0]}
                                        ratio="4/3"
                                        alt={item.title}
                                        sx={{
                                            transition: (theme) =>
                                                theme.transitions.create('transform', {
                                                    duration: theme.transitions.duration.complex,
                                                }),
                                        }}
                                    />

                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: (theme) =>
                                                `linear-gradient(180deg, ${alpha(theme.palette.common.black, 0)} 40%, ${alpha(theme.palette.common.black, 0.78)} 100%)`,
                                        }}
                                    />

                                    {item.images?.length > 1 && (
                                        <Chip
                                            size="small"
                                            icon={<Iconify icon="solar:gallery-wide-bold" width={14} sx={{ color: 'common.black !important' }} />}
                                            label={`${item.images.length}`}
                                            sx={{
                                                position: 'absolute',
                                                top: 12,
                                                right: 12,
                                                color: 'common.black',
                                                fontWeight: 700,
                                                bgcolor: 'common.white',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                                            }}
                                        />
                                    )}

                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            p: 2,
                                        }}
                                    >
                                        <Chip
                                            size="small"
                                            label={item.category}
                                            sx={{
                                                mb: 1,
                                                color: 'common.white',
                                                fontWeight: 700,
                                                bgcolor: 'primary.main',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                                            }}
                                        />

                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                color: 'common.white',
                                                fontWeight: 600,
                                                textShadow: '0 1px 4px rgba(0,0,0,0.4)',
                                            }}
                                        >
                                            {item.title}
                                        </Typography>

                                        {item.link && (
                                            <Stack
                                                component="a"
                                                href={item.link}
                                                target="_blank"
                                                rel="noopener"
                                                onClick={(event) => event.stopPropagation()}
                                                direction="row"
                                                alignItems="center"
                                                spacing={0.5}
                                                sx={{
                                                    mt: 0.5,
                                                    width: 'fit-content',
                                                    color: 'primary.lighter',
                                                    textDecoration: 'none',
                                                    '&:hover': { color: 'common.white' },
                                                }}
                                            >
                                                <Iconify icon="solar:link-bold" width={14} />
                                                <Typography
                                                    variant="caption"
                                                    sx={{ fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}
                                                >
                                                    View portfolio link
                                                </Typography>
                                            </Stack>
                                        )}
                                    </Box>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="body2" color="text.secondary">
                    No portfolio items yet.
                </Typography>
            )}

            <Lightbox
                open={previewModal.value}
                close={previewModal.onFalse}
                slides={slides}
                index={previewIndex}
            />
        </Stack>
    );
}

export default PortfolioTab;
