import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Grid } from "@mui/material";
import { useParams } from "react-router";
import { useProfile } from "src/lib/hooks/useProfile";


export default function ProfileHeader() {
  const { id } = useParams();
  const { isCurrentUser, profile, updateFollowing } = useProfile(id);

  if (!profile) return null;
  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
      <Grid container spacing={2}>
        <Grid size={8}>
          <Stack direction="row" spacing={3} alignItems="center">
            <Avatar
              src={profile.imageUrl}
              alt={profile.displayName + " image"}
              sx={{ width: 150, height: 150 }}
            />
            <Box display="flex" flexDirection="column" gap={2}>
              <Typography variant="h4" component="h1">
                {profile.displayName}
              </Typography>
              {profile.following && (
                <Chip
                  variant="outlined"
                  color="secondary"
                  label="Following"
                  sx={{ borderRadius: 1 }}
                />
              )}
            </Box>
          </Stack>
        </Grid>

        {/* 우측: 통계 + Follow/Unfollow 버튼 */}
        <Grid size={4}>
          <Stack spacing={2} alignItems="center">
            <Box
              display="flex"
              justifyContent="space-around"
              width="100%"
              textAlign="center"
            >
              <Box>
                <Typography variant="h6">Followers</Typography>
                <Typography variant="h3">{profile.followersCount}</Typography>
              </Box>
              <Box>
                <Typography variant="h6">Following</Typography>
                <Typography variant="h3">{profile.followingCount}</Typography>
              </Box>
            </Box>
            {!isCurrentUser &&
              <>
                <Divider sx={{ width: "100%" }} />

                <Button
                  onClick={() => updateFollowing.mutate()}
                  disabled= {updateFollowing.isPending}
                  fullWidth
                  variant="outlined"
                  color={profile.following ? "error" : "success"}
                >
                  {profile.following ? "Unfollow" : "Follow"}
                </Button>
              </>
            }

          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
}