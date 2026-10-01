import { Box, Card, CardContent, CardHeader, Divider, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { Iconify } from 'src/components/iconify'
import { DashboardNoData } from './dashboard-no-data'

// ----------------------------------------------------------------------

const ACTIVITY_STYLES = [
    { match: 'signup', icon: 'solar:user-plus-bold', color: 'info' },
    { match: 'trade', icon: 'solar:check-circle-bold', color: 'success' },
    { match: 'drop', icon: 'solar:box-bold', color: 'warning' },
]

function getActivityStyle(title = '') {
    const lower = title.toLowerCase()
    return (
        ACTIVITY_STYLES.find((style) => lower.includes(style.match)) || {
            icon: 'keyline-icons:square-activity-duotone',
            color: 'primary',
        }
    )
}

const AppLastActivities = ({ title, subheader, list, ...other }) => {
    return (
        <Card {...other}>
            <CardHeader
                title={title}
                subheader={subheader}
                sx={{ mb: 2 }}
            />

            <CardContent sx={{ pt: 0 }}>
                {!list?.length ? (
                    <DashboardNoData sx={{ minHeight: 220, py: 6 }} />
                ) : (
                    <Stack divider={<Divider sx={{ my: 2 }} />}>
                        {list.map((item, index) => (
                            <Item key={index} item={item} />
                        ))}
                    </Stack>
                )}
            </CardContent>
        </Card>
    )
}

export default AppLastActivities

function Item({ item }) {
    const theme = useTheme()
    const { title, description } = item
    const style = getActivityStyle(title)

    return (
        <Stack direction="row" alignItems="flex-start" spacing={2}>
            <Box
                sx={{
                    width: 36,
                    height: 36,
                    flexShrink: 0,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: `${style.color}.main`,
                    bgcolor: alpha(theme.palette[style.color].main, 0.12),
                }}
            >
                <Iconify icon={style.icon} width={18} />
            </Box>
            <Box>
                <Typography variant="subtitle2">{title}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>{description}</Typography>
            </Box>
        </Stack>
    )
}
