import { Box, Typography, Card, CardContent, TextField, Avatar, CircularProgress } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useForm, type FieldValues } from "react-hook-form";
import { Link, useParams } from "react-router";
import { useComments } from "src/lib/hooks/useComments";
import { timeAgo } from "src/lib/util/util";

const ActivityDetailsChat = observer(function ActivityDetailsChat() {
  const { id } = useParams();
  const { commentStore } = useComments(id);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const addComment = async (data: FieldValues) => {
    try {
      await commentStore.hubConnection?.invoke("SendComment", {
        activityId: id,
        body: data.body,
      });
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Enter = 전송, Shift+Enter = 줄바꿈
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSubmit(addComment)();
    }
  };

  return (
    <>
      <Box sx={{ textAlign: "center", bgcolor: "primary.main", color: "white", p: 2 }}>
        <Typography variant="h6">Chat about this event</Typography>
      </Box>

      <Card>
        <CardContent>
          <form>
            <TextField
              {...register("body", { required: true })}
              variant="outlined"
              fullWidth
              multiline
              rows={2}
              placeholder="Enter your comment (Enter to submit, SHIFT + Enter for new line)"
              onKeyDown={handleKeyDown}
              slotProps={{
                input: {
                  endAdornment: isSubmitting ? <CircularProgress size={24} /> : null,
                },
              }}
            />
          </form>

          <Box sx={{ height: 400, overflow: "auto" }}>
            {commentStore.comments.map((comment) => (
              <Box key={comment.id} sx={{ display: "flex", my: 2 }}>
                <Avatar src={comment.imageUrl ?? "/images/user.png"} alt="user image" sx={{ mr: 2 }} />
                <Box display="flex" flexDirection="column">
                  <Box display="flex" alignItems="center" gap={3}>
                    <Typography
                      component={Link}
                      to={`/profiles/${comment.userId}`}
                      variant="subtitle1"
                      sx={{ fontWeight: "bold", textDecoration: "none" }}
                    >
                      {comment.displayName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {timeAgo(comment.createdAt)}
                    </Typography>
                  </Box>

                  <Typography sx={{ whiteSpace: "pre-wrap" }}>{comment.body}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </>
  );
});

export default ActivityDetailsChat;