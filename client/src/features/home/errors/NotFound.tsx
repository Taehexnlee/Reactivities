import { SearchOff } from "@mui/icons-material";
import { Paper, Typography } from "@mui/material";
import { Link } from "react-router";

export default function NotFound() {
  return (
    <Paper
        sx={{
            height: 400,
            display: 'flex',
            justifyContent: 'center',
            flesdirection: 'column',
            alignItems: 'center',
            p: 6
        }}
    >
        <SearchOff sx={{fontSize: 100 }} color="primary"/>
        <Typography variant="h3" color="primary">
            Oops - we've looked everywhere but we couldn't find this page
        </Typography>
        <Typography component={Link} to='/activities'>
            Sorry, the page you are looking for does not exist
        </Typography> 
    </Paper>
  )
}