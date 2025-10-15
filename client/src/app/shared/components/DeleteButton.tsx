import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DeleteIcon from "@mui/icons-material/Delete";

export default function DeleteButton() {
  return (
    <Box sx={{ position: "relative" }}>
      <Button
        sx={{
          opacity: 0.8,
          transition: "opacity .3s",
          position: "relative",
          cursor: "pointer"
        }}
      >
        <DeleteOutlineIcon
          sx={{
            fontSize: 32,
            color: "#fff",
            position: "absolute",
          }}
        />
        <DeleteIcon
          sx={{
            fontSize: 28,
            color: "red",
          }}
        />
      </Button>
    </Box>
  );
}