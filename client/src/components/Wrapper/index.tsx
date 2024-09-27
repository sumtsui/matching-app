import { Alert, Box, IconButton, Snackbar } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import React, { ReactNode } from "react";
import { matchPath, useLocation, useNavigate } from "react-router-dom";
import { useSnackbarState } from "../GlobalContext";
import { AuthProvider, useAuthState } from "../AuthProvider";
import BottomNavBar from "../BottomNavBar";
import { DialogsProvider } from "../DialogsProvider";
import { routes } from "../../routes";

type Props = {
  children: ReactNode;
  showBack?: boolean;
};

const Wrapper = ({ children, showBack }: Props) => {
  const navigate = useNavigate();
  const { snackBarContent, setSnackBarContent } = useSnackbarState();
  const { user } = useAuthState();
  // Assume the BottomNavBar height is 56px (you may need to adjust this)
  const NAVBAR_HEIGHT = 56;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <Box
        sx={{
          flex: 1,
          padding: "2em",
          mb: "18px",
        }}
      >
        {showBack && (
          <IconButton
            color="primary"
            sx={{ mb: 2 }}
            component="label"
            onClick={() => navigate(-1)}
          >
            <ArrowBack />
          </IconButton>
        )}
        {children}
      </Box>
      {user && (
        <Box
          sx={{
            height: `${NAVBAR_HEIGHT}px`,
            flexShrink: 0,
            zIndex: 1,
          }}
        >
          <BottomNavBar />
        </Box>
      )}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={Boolean(snackBarContent)}
        onClose={() => setSnackBarContent(undefined)}
      >
        <Alert severity="info">{snackBarContent}</Alert>
      </Snackbar>
      <Box
        sx={{
          textAlign: "center",
          position: "absolute",
          bottom: 1,
          width: "100%",
        }}
      >
        <a
          style={{ color: "#79a5e3" }}
          href="https://beian.miit.gov.cn/"
          target="_blank"
          rel="noreferrer"
        >
          粤ICP备2024314870号
        </a>
      </Box>
    </Box>
  );
};

const withAuth = (WrappedComponent: React.ComponentType<Props>) => {
  return (props: Props) => (
    <AuthProvider>
      <DialogsProvider>
        <WrappedComponent {...props} />
      </DialogsProvider>
    </AuthProvider>
  );
};

const WrapperWithAuth = withAuth(Wrapper);

export default WrapperWithAuth;
