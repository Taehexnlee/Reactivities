import { Box, Container, CssBaseline } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react"
import Navbar from "./Navbar";
import ActivityDashBoard from "../../features/activities/dashboard/ActivityDashBoard";



function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    axios.get<Activity[]>('https://localhost:5002/api/activities')
      .then(response => setActivities(response.data))

    return () => { }
  }, [])

  const handleSelectedActivity = (id: string) => {
    setSelectedActivity(activities.find(x => x.id == id));
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
  const handleSubmitForm = (activity: Activity) => {
    if (activity.id) {
      setActivities(activities.map(x => x.id === activity.id ? activity : x));
    } else {
      const newActivity: Activity = {
        ...activity,
        id: activities.length.toString(), 
      };
      setActivities([...activities, newActivity]);
    }
    setEditMode(false);
  }
  const handleDelete  = (id: string) => {
    setActivities(activities.filter(x => x.id !== id))
  }

  return (
    <Box sx={{ bgcolor: '#eeeeee' }}>
      <CssBaseline />
      <Navbar openForm={handleOpenForm} />
      <Container maxWidth='xl' sx={{ mt: 3 }}>
        <ActivityDashBoard
          selectActivity={handleSelectedActivity}
          cancelSelectActivity={handleCancelSelectActivity}
          selectedActivity={selectedActivity}
          activities={activities}
          editMode={editMode}
          openForm={handleOpenForm}
          closeForm={handleFormClose}
          submitForm ={handleSubmitForm}
          deleteActivity = {handleDelete}
        />
      </Container>

    </Box>

  )
}

export default App
