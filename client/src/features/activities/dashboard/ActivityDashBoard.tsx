import { Grid } from "@mui/material";
import ActivityList from "./ActivityList";
import ActivityDetail from "../details/ActivityDetail";
import ActivityForm from "../form/ActivityForm";

type Props ={
  activities: Activity[];
  selectActivity : (id:string) => void;
  cancelSelectActivity: () => void;
  selectedActivity?: Activity;
  openForm: (id:string) => void;
  closeForm: () => void;
  editMode: boolean
  submitForm: (activity: Activity) => void
  deleteActivity: (id: string) => void;
}

export default function ActivityDashBoard({
  activities,
  cancelSelectActivity,
  selectActivity,
  selectedActivity,
  openForm,
  closeForm,
  editMode, 
  submitForm,
  deleteActivity
}: Props) {
  return (
    <Grid container>
      <Grid size={7}>
        <ActivityList
          activities={activities}
          selectActivity={selectActivity}
          deleteActivity = {deleteActivity}
        />
      </Grid>

      <Grid size={5}>
        {selectedActivity && !editMode && (
          <ActivityDetail
            activity={selectedActivity}
            cancelSelectActivity={cancelSelectActivity}
            openForm={openForm}
          />
        )}

        {editMode && (
          <ActivityForm
            activity={selectedActivity}            // ✅ 폼에 activity 전달
            closeForm={closeForm}
            submitForm = {submitForm}    // ✅ activity 변경 시 리마운트
          />
        )}
      </Grid>
    </Grid>
  );
}