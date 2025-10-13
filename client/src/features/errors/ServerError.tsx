import { Divider, Paper, Typography } from "@mui/material";
import { useLocation } from "react-router"

export default function ServerError() {
    const {state} = useLocation();
  return (
    <Paper>
        {state.error? (
            <>
                <Typography gutterBottom variant="h3" sx={{px: 4, pt:2}} >
                    {state.error.message || "Threre was a server error"}
                </Typography>
                <Divider />
                <Typography variant="body1" sx={{px: 4, pt:2}} >
                    {state.error.details || "No further details provided"}
                </Typography>
            </>
        ): (
            <Typography variant="h5" sx={{px: 4, pt:2}} >
                Server error
            </Typography>
        )}
    </Paper>
  )
}
