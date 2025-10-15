import { Box, Button, Divider, ImageList, ImageListItem, Typography } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router"
import DeleteButton from "src/app/shared/components/DeleteButton";
import PhotoUploadWidget from "src/app/shared/components/PhotoUploadWidget";
import StarButton from "src/app/shared/components/StarButton";
import { useProfile } from "src/lib/hooks/useProfile";

export default function ProfilePhoto() {
    const { id } = useParams();
    const { photos, loadingPhotos, isCurrentUser, uploadPhoto, profile, setMainPhoto, deletePhoto } = useProfile(id);
    const [editMode, setEditMode] = useState(false);

    const handlePhotouUpload = (file: Blob) => {
        uploadPhoto.mutate(file, {
            onSuccess: () => {
                setEditMode(false);
            }
        })
    }
    if (loadingPhotos) return <Typography>Loading photos...</Typography>;
    if (!photos)
        return <Typography>No photos found for this user</Typography>;

    return (
        <Box>

            <Box display='flex' justifyContent='space-between'>
                <Typography variant="h5">Photos</Typography>
                {isCurrentUser && (
                    <Button onClick={() => setEditMode(!editMode)} >
                        {editMode ? 'Cancel' : 'Add photo'}
                    </Button>)}
            </Box>

            <Divider sx={{ my: 2 }} />

            {editMode ? (
                <PhotoUploadWidget
                    uploadPhoto={handlePhotouUpload}
                    loading={uploadPhoto.isPending}
                />
            ) : (
                <>
                    {photos.length === 0 ? (
                        <Typography>No photos added yet</Typography>
                    ) : (
                        <ImageList cols={6} rowHeight={164}>
                            {photos.map((item) => (
                                <ImageListItem key={item.id}>
                                    <img
                                        // 고해상도(레티나)용: dpr_2 추가
                                        srcSet={`${item.url.replace(
                                            "/upload",
                                            "/upload/w_164,h_164,c_fill,f_auto,g_face,dpr_2"
                                        )}`}
                                        // 일반 해상도
                                        src={`${item.url.replace(
                                            "/upload",
                                            "/upload/w_164,h_164,c_fill,f_auto,g_face"
                                        )}`}
                                        alt="user profile image"
                                        loading="lazy"
                                    />
                                    {isCurrentUser && (
                                        <div>
                                            <Box sx={{ position: 'absolute', top: 0, left: 0 }}
                                                onClick={() => setMainPhoto.mutate(item)}
                                            >
                                                <StarButton selected={item.url === profile?.imageUrl} />
                                            </Box>
                                            {profile?.imageUrl !== item.url && (
                                                <Box sx={{ position: 'absolute', top: 0, right: 0 }}
                                                    onClick={() => deletePhoto.mutate(item.id)}
                                                >
                                                    <DeleteButton />
                                                </Box>
                                            )}
                                        </div>


                                    )}
                                </ImageListItem>
                            ))}
                        </ImageList>
                    )}
                </>

            )}
        </Box >

    );
}