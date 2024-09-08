import React from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "react-query";
import { userApi } from "../api";
import { routes } from "../routes";
import { Box, Button, TextareaAutosize, Typography } from "@mui/material";
import { useAuthState } from "./AuthProvider";

const UserBio = () => {
  const { user } = useAuthState();
  const { eventId } = useParams();
  const navigate = useNavigate();
  const updateBioMutation = useMutation(
    (values: Record<string, string>) =>
      userApi.updateUserProfile({ bio: values }),
    {
      onSuccess(result) {
        navigate(routes.eventHome(eventId, user!.id));
      },
    }
  );
  const formik = useFormik<Record<string, string>>({
    initialValues: user!.bio || {},
    onSubmit: async (values) => {
      await updateBioMutation.mutateAsync(values);
    },
    enableReinitialize: true,
  });

  const valueEntries = React.useMemo(() => {
    return Object.entries(formik.values);
  }, [formik.values]);

  return (
    <Box sx={{ width: "100%" }}>
      {valueEntries.map(([key, value]) => {
        return (
          <div key={key}>
            <Typography>{key}</Typography>
            <TextareaAutosize
              name={key}
              minRows={4}
              onChange={formik.handleChange}
              value={value}
              style={{ width: "100%" }}
            />
          </div>
        );
      })}
      <Button variant="contained" onClick={() => formik.handleSubmit()}>
        完成
      </Button>
    </Box>
  );
};

export default UserBio;
