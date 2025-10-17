// src/features/profiles/ProfileActivities.tsx
import { useEffect, useMemo } from "react";
import {
  Box, Tabs, Tab, Card, CardActionArea, CardContent, Typography
} from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { useProfile } from "src/lib/hooks/useProfile";

const TABS = [
  { key: "future", label: "Future" },
  { key: "past",   label: "Past" },
  { key: "hosting",label: "Hosting" },
];

export default function ProfileActivities() {
  const { id: userId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!userId) return null;

  const {
    userActivities,
    loadingUserActivities,
    filter,
    setFilter,
  } = useProfile(userId);

  useEffect(() => {
    if (filter === null) setFilter("future");
  }, [filter, setFilter]);

  const currentIndex = useMemo(
    () => Math.max(0, TABS.findIndex(t => t.key === filter)),
    [filter]
  );

  const handleTabChange = (_: any, value: number) => setFilter(TABS[value].key);

  return (
    <Box>
      <Tabs value={currentIndex} onChange={handleTabChange} sx={{ mb: 2 }}>
        {TABS.map(t => <Tab key={t.key} label={t.label} />)}
      </Tabs>

      {loadingUserActivities && <Box py={3}>Loading...</Box>}

      {!loadingUserActivities && userActivities.length === 0 && (
        <Box py={3}>No activities found.</Box>
      )}

      <Box display="grid" gap={2} gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}>
        {userActivities.map(a => (
          <Card key={a.id} variant="outlined">
            <CardActionArea onClick={() => navigate(`/activities/${a.id}`)}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  {a.category}
                </Typography>
                <Typography variant="h6">{a.title}</Typography>
                <Typography variant="body2">
                  {new Date(a.date).toLocaleString()}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
