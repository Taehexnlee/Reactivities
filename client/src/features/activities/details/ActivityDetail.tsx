import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material"

type Props = {
    activity : Activity
    cancelSelectActivity: () => void;
    openForm:(id:string) => void;
}
export default function ActivityDetail({activity, cancelSelectActivity, openForm}: Props) {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardMedia
        component="img"
        image={`/images/categoryImages/${activity.category}.jpg`}
        alt={activity.category ?? "activity"}
      />
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {activity.title}
        </Typography>

        <Typography variant="subtitle1" fontWeight="light" gutterBottom>
          {activity.date ? new Date(activity.date).toLocaleString() : ""}
        </Typography>

        <Typography variant="body1" paragraph>
          {activity.description}
        </Typography>

        <Typography variant="body1">
          {activity.city} / {activity.venue}
        </Typography>
      </CardContent>

      <CardActions>
        <Button onClick={()=> openForm(activity.id)} color="primary">Edit</Button>
        <Button onClick={cancelSelectActivity} color="inherit">Cancel</Button>
      </CardActions>
    </Card>
  )
}