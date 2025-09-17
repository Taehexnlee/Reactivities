import { Grid } from "@mui/material";
import ActivityList from "./ActivityList";

export default function ActivityDashBoard() {
  
  return (
    <Grid container>
      <Grid size={7}>
        <ActivityList/>
      </Grid>

      <Grid size={5}>
        Activity filters go here
      </Grid>
    </Grid>
  );
}