import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import ProfileCard from "./ProfileCard";
import { useProfile } from "src/lib/hooks/useProfile";
import { useParams } from "react-router";

type Props = {
  activeTab: number;
};

export default function ProfileFollowings({ activeTab }: Props) {
  const { id } = useParams();
  const predicate = activeTab === 3 ? "followers" : "followings";
  const { profile, following, loadingFollowings } = useProfile(id, predicate);

  return (
    <Box>
      <Box display="flex">
        <Typography variant="h5">
          {activeTab === 3
            ? `People following ${profile?.displayName ?? ""}`
            : `People ${profile?.displayName ?? ""} is following`}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {loadingFollowings ? (
        <Typography>Loading...</Typography>
      ) : (
        <Box display="flex" marginTop={3} gap={3} flexWrap="wrap">
          {(following ?? []).map((p) => (
            <ProfileCard key={p.id} profile={p} />
          ))}
        </Box>
      )}
    </Box>
  );
}