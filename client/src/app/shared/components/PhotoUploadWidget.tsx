import { CloudUpload } from "@mui/icons-material";
import { Box, Grid, Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import Cropper, { type ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

type Props = {
  uploadPhoto: (file: Blob) => void;
  loading: boolean;
};

export default function PhotoUploadWidget({ uploadPhoto, loading }: Props) {
  const [files, setFiles] = useState<(File & { preview: string })[]>([]);
  const cropperRef = useRef<ReactCropperElement>(null);

  useEffect(() => {
    return () => {
      files.forEach(file => URL.revokeObjectURL(file.preview))
    }
  }, [files])
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      ) as (File & { preview: string })[]
    );
  }, []);

  const onCrop = useCallback(() => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;
    cropper.getCroppedCanvas().toBlob((blob) => {
      if (blob) uploadPhoto(blob);
    });
  }, [uploadPhoto]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Grid container spacing={3}>
      {/* Step 1 */}
      <Grid size={4}>
        <Typography variant="overline" color="secondary">
          Step 1 — Add Photo
        </Typography>
        <Box
          {...getRootProps()}
          sx={{
            border: "dashed 3px #eee",
            borderColor: isDragActive ? "green" : "#eee",
            borderRadius: "5px",
            pt: "30px",
            textAlign: "center",
            height: "280px",
          }}
        >
          <input {...getInputProps()} />
          <CloudUpload sx={{ fontSize: 80 }} />
          <Typography variant="h5">Drop image here</Typography>
        </Box>
      </Grid>

      {/* Step 2 */}
      <Grid size={4}>
        <Typography variant="overline" color="secondary">
          Step 2 — Resize Image
        </Typography>
        {files[0]?.preview && (
          <Cropper
            src={files[0].preview}
            style={{ height: 300, width: "90%" }}
            aspectRatio={1}
            initialAspectRatio={1}
            preview=".img-preview"
            guides={false}
            viewMode={1}
            background={false}
            ref={cropperRef} // 중요: ref 연결
          />
        )}
      </Grid>

      {/* Step 3 */}
      <Grid size={4}>
        {files[0]?.preview && (
          <>
            <Typography variant="overline" color="secondary">
              Step 3 — Preview & Upload
            </Typography>
            <div
              className="img-preview"
              style={{ width: 300, height: 300, overflow: "hidden" }}
            />
            <Button
              sx={{ my: 1, width: 300}}
              onClick={onCrop}
              variant="contained"
              color="secondary"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload"}
            </Button>
          </>
        )}
      </Grid>
    </Grid>
  );
}