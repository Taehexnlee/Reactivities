import { Box, Button, Divider, Typography } from "@mui/material";
import { useParams } from "react-router";
import { useProfile } from "src/lib/hooks/useProfile";

export default function ProfileAbout() {
  const { id } = useParams();
  const { profile } = useProfile(id);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h5">About {profile?.displayName}</Typography>
        <Button variant="outlined">Edit Profile</Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ maxHeight: 350, overflow: "auto" }}>
        <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
          {profile?.bio ?? "No description added yet."}
        </Typography>
      </Box>
    </Box>
  );
}