import { Grid } from "@mui/material";
import ActivityList from "./ActivityList";
import ActivityFilters from "./ActivityFilters";

export default function ActivityDashBoard() {
  
  return (
    <Grid container>
      <Grid size={8}>
        <ActivityList/>
      </Grid>

      <Grid size={4}>
        <ActivityFilters/>
      </Grid>
    </Grid>
  );
}