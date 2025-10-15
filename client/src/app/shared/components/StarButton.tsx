import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";

type Props = {
  selected: boolean;
};

export default function StarButton({ selected }: Props) {
  return (
    <Box sx={{ position: "relative" }}>
      <Button
        sx={{
          opacity: 0.8,
          transition: "opacity .3s",
          position: "relative",
          cursor: "pointer",
          minWidth: 0,
          p: 0,
        }}
      >
        <StarBorderIcon
          sx={{
            fontSize: 32,
            color: "#fff",
            position: "absolute",
          }}
        />
        <StarIcon
          sx={{
            fontSize: 28,
            color: selected ? "yellow" : "rgba(0,0,0,0.5)",
          }}
        />
      </Button>
    </Box>
  );
}