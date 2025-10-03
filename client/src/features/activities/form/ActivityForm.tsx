import { Box, Button, Divider, Paper, Stack, Typography } from "@mui/material";
import { useActivities } from "../../../lib/hooks/useActivities";
import { useNavigate, useParams } from "react-router";
import { useForm } from 'react-hook-form';
import { useEffect } from "react";
import { activitySchema, type ActivitySchema } from "../../../lib/schemas/activitySchema";
import { zodResolver } from '@hookform/resolvers/zod';
import TextInput from "src/app/shared/components/TextInput";
import SelectInput from "src/app/shared/components/SelectInput";
import { categoryOptions } from "./categoryOptions";
import DateTimeInput from "src/app/shared/components/DateTimeInput";
import LocationInput from "src/app/shared/components/LocationInput";

export default function ActivityForm() {
  const { control, reset, handleSubmit } = useForm<ActivitySchema>({
    mode: 'onTouched',
    resolver: zodResolver(activitySchema),
  });
  const navigate = useNavigate();
  const { id } = useParams();
  const { updateActivity, createActivity, activity, isLoadingActivity } = useActivities(id);

  useEffect(() => {
    if (activity) reset({
      ...activity,
      location:{
        city:activity.city,
        venue : activity.venue,
        latitude: activity.latitude,
        longitude: activity.longitude
      }
    });
  }, [activity, reset])

  const onSubmit = async (data: ActivitySchema) => {
    const {location, ...rest} = data;
    const flattenedData = {...rest, ...location}
    try {
      if(activity){
        updateActivity.mutate({...activity, ...flattenedData}, {
          onSuccess:() => navigate(`/activities/${activity.id}`)
        })
      }else
      {
        createActivity.mutate(flattenedData, {
          onSuccess: (id) => navigate(`/activities/${id}`)
        }) 
      }
    } catch (error) {
      console.log(error)
    }
  }

  if (isLoadingActivity) return <Typography>Loading... </Typography>

  const isMutating = updateActivity.isPending || createActivity.isPending;

  return (
    <Paper sx={{ p: { xs: 3, md: 4 } }}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <Box>
            <Typography variant="overline" color="text.secondary">
              {activity ? "Update an activity" : "Create a new experience"}
            </Typography>
            <Typography variant="h5" color="primary" fontWeight={700}>
              {activity ? "Edit Activity" : "Create Activity"}
            </Typography>
          </Box>

          <Stack spacing={2}>
            <Typography variant="subtitle1" fontWeight={600}>
              Basics
            </Typography>
            <TextInput label="Title" control={control} name="title" placeholder="Give your activity a memorable name" />
            <TextInput
              label="Description"
              control={control}
              name="description"
              multiline
              rows={4}
              placeholder="What makes this activity worth attending?"
            />
          </Stack>

          <Divider flexItem />

          <Stack spacing={2}>
            <Typography variant="subtitle1" fontWeight={600}>
              Schedule
            </Typography>
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              }}
            >
              <SelectInput items={categoryOptions} label="Category" control={control} name="category" />
              <DateTimeInput label="Date & Time" control={control} name="date" minutesStep={15} />
            </Box>
          </Stack>

          <Divider flexItem />

          <Stack spacing={2}>
            <Typography variant="subtitle1" fontWeight={600}>
              Location
            </Typography>
            <LocationInput control={control} label="Search for a venue or address" name="location" />
          </Stack>

          <Divider flexItem />

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              All fields are required to publish an activity.
            </Typography>
            <Box display="flex" gap={2}>
              <Button color="inherit" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" color="success" variant="contained" disabled={isMutating}>
                {isMutating ? "Saving..." : "Submit"}
              </Button>
            </Box>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
}
