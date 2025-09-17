import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import type { FormEvent } from "react";

type Props ={
  activity?: Activity;         // optional
  closeForm: () => void;
  submitForm: (activity: Activity) => void
}

export default function ActivityForm({ activity, closeForm, submitForm }: Props) {

  const handleSubmit =(event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data : {[key: string] : FormDataEntryValue} = {}
    formData.forEach((value, key) => {
      data[key] = value;
    });
    if(activity) data.id = activity.id
    submitForm(data as unknown as Activity)
  }

  return (
    <Paper sx={{ borderRadius: 3, padding: 3 }}>
      <Typography variant="h5" gutterBottom color="primary">
        {activity ? 'Edit Activity' : 'Create Activity'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={3}>
        <TextField
          label="Title"
          name="title"                          // <-- name 추가(추천)
          defaultValue={activity?.title}
        />
        <TextField
          label="Description"
          name="description"
          multiline
          rows={3}
          defaultValue={activity?.description}
        />
        <TextField
          label="Category"
          name="category"
          defaultValue={activity?.category}
        />
        <TextField
          label="Date"
          name="date"
          type="date"
          defaultValue={activity?.date}
        />
        <TextField
          label="City"
          name="city"
          defaultValue={activity?.city}
        />
        <TextField
          label="Venue"
          name="venue"
          defaultValue={activity?.venue}
        />

        <Box display="flex" justifyContent="end" gap={3}>
          <Button onClick={closeForm} color="inherit">Cancel</Button>
          <Button onSubmit={handleSubmit} color="success" variant="contained" type="submit">
            Submit
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}