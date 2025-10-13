import { CalendarToday, Info, Place } from "@mui/icons-material";
import { Box, Button, Collapse, Divider, Paper, Stack, Typography } from "@mui/material";
import { formatDate } from "../../../lib/util/util";
import { useState, type ReactNode } from "react";
import MapComponents from "src/app/shared/components/MapComponents";

type Props ={
  activity :Activity
}
export default function ActivityDetailsInfo({activity}: Props) {
    const [mapOpen, setMapOpen] = useState(false);

    const renderIcon = (icon: ReactNode) => (
        <Box
            sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                bgcolor: "primary.light",
                color: "common.white",
                boxShadow: "0 6px 18px rgba(31, 111, 235, 0.25)",
                flexShrink: 0,
            }}
        >
            {icon}
        </Box>
    );

    return (
        <Paper sx={{ mb: 2, p: { xs: 3, md: 4 } }}>
            <Stack spacing={3} divider={<Divider flexItem />}>
                <Stack direction="row" spacing={3} alignItems="flex-start">
                    {renderIcon(<Info fontSize="medium" />)}
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Overview
                        </Typography>
                        <Typography variant="body1">{activity.description}</Typography>
                    </Box>
                </Stack>

                <Stack direction="row" spacing={3} alignItems="center">
                    {renderIcon(<CalendarToday fontSize="medium" />)}
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Date & Time
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                            {formatDate(activity.date)}
                        </Typography>
                    </Box>
                </Stack>

                <Stack spacing={2}>
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems={{ xs: "flex-start", sm: "center" }}>
                        {renderIcon(<Place fontSize="medium" />)}
                        <Box flex={1}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                Location
                            </Typography>
                            <Typography variant="body1">
                                {activity.venue}, {activity.city}
                            </Typography>
                        </Box>
                        <Button
                            sx={{whiteSpace: 'nowrap'}}
                            variant={mapOpen ? "contained" : "outlined"}
                            color="secondary"
                            onClick={() => setMapOpen((open) => !open)}
                        >
                            {mapOpen ? "Hide map" : "Show map"}
                        </Button>
                    </Stack>
                    <Collapse in={mapOpen} timeout={400} unmountOnExit>
                        <Box
                            sx={{
                                height: { xs: 280, md: 360 },
                                borderRadius: 3,
                                overflow: "hidden",
                                boxShadow: "0 16px 32px rgba(32, 167, 172, 0.15)",
                            }}
                        >
                            <MapComponents
                                position={[activity.latitude, activity.longitude]}
                                venue={activity.venue}
                            />
                        </Box>
                    </Collapse>
                </Stack>
            </Stack>
        </Paper>
    )
}
