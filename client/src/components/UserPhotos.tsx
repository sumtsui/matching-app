import React from "react";
import UploadPhoto from "./UploadPhoto";
import { useMutation, useQuery } from "react-query";
import { userApi } from "../api";
import { Box, Button, Typography } from "@mui/material";
import CosImage from "./CosImage";
import { useAuthState } from "./AuthProvider";
import DeleteIcon from "@mui/icons-material/Delete";
import { cosHelper } from "..";
import { ImageUploadItem } from "antd-mobile/es/components/image-uploader";

const UserPhotos = () => {
  const { user, refetchMe } = useAuthState();
  const deletePhotoMutation = useMutation({
    mutationFn: async ({
      cosLocation,
      photoId,
    }: {
      cosLocation: string;
      photoId: string;
    }) => {
      const { key } = cosHelper.getConfigFromCosLocation(cosLocation);
      await cosHelper.deleteObject({
        Key: key,
      });
      await userApi.deletePhoto({ photoId, userId: user!.id });
    },
    onSuccess: () => {
      refetchMe();
    },
  });

  return (
    <Box>
      <Typography variant="h1" mb={4}>
        我的照片
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {Number(user!.photos?.length) < 3 && (
          <>
            <Typography variant="body1">
              请上传1-3张照片, 已上传{user!.photos.length}张
            </Typography>
            <Box sx={{ alignSelf: "center", margin: "20px" }}>
              <UploadPhoto
                onUpload={() => {
                  refetchMe();
                }}
                onDelete={(item: ImageUploadItem) =>
                  deletePhotoMutation.mutateAsync({
                    cosLocation: item.extra.cosLocation,
                    photoId: item.extra.photoId,
                  })
                }
              />
            </Box>
          </>
        )}
        {user!.photos?.map((p) => {
          return (
            <Box key={p.id} sx={{ position: "relative", width: "100%", mb: 2 }}>
              <CosImage cosLocation={p.cosLocation} />
              <Button
                onClick={() =>
                  window.confirm("是否确认删除") &&
                  deletePhotoMutation.mutateAsync({
                    cosLocation: p.cosLocation,
                    photoId: p.id,
                  })
                }
                sx={{
                  display: "block",
                  width: "100%",
                  position: "absolute",
                  bottom: "0",
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                  },
                }}
              >
                <DeleteIcon color={"action"} />
              </Button>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default UserPhotos;
