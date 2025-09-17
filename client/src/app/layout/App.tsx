import { Box, Container, CssBaseline, Typography } from "@mui/material";
import { useState } from "react"
import Navbar from "./Navbar";
import ActivityDashBoard from "../../features/activities/dashboard/ActivityDashBoard";
import { useActivities } from "../../lib/hooks/useActivities";



function App() {
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  const {activities, isPending } = useActivities();

  const handleSelectedActivity = (id: string) => {
    setSelectedActivity(activities!.find(x => x.id == id));
  }
  const handleCancelSelectActivity = () => {
    setSelectedActivity(undefined);
  }
  const handleOpenForm = (id?: string) => {
    if (id) handleSelectedActivity(id);
    else handleCancelSelectActivity();
    setEditMode(true);
  }
  const handleFormClose = () => {
    setEditMode(false);
  }


  return (
    <Box sx={{ bgcolor: '#eeeeee' , minHeight: '100vh'}}>
      <CssBaseline />
      <Navbar openForm={handleOpenForm} />
      <Container maxWidth='xl' sx={{ mt: 3 }}>
        {!activities || isPending ? (
          <Typography>Loading...</Typography>)
          : (
            <ActivityDashBoard
              selectActivity={handleSelectedActivity}
              cancelSelectActivity={handleCancelSelectActivity}
              selectedActivity={selectedActivity}
              activities={activities}
              editMode={editMode}
              openForm={handleOpenForm}
              closeForm={handleFormClose}
            />
          )}

      </Container>

    </Box>

  )
}

export default App
