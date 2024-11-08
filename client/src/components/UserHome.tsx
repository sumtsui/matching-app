import { useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { userApi } from "../api";
import { routes } from "../routes";
import { Avatar, Box, Button, Divider, Typography } from "@mui/material";
import { useAuthState } from "./AuthProvider";
import { MatchingEventResponse } from "../api/matching-event";

const UserHome = () => {
  const { user, logout } = useAuthState();
  const navigate = useNavigate();
  const matchingEventsQuery = useQuery(["getMatchingEventsByUser"], () =>
    userApi.getMatchingEventsByUser({ userId: user!.id })
  );

  const events = useMemo(() => {
    const result: {
      ended: MatchingEventResponse[];
      ongoing: MatchingEventResponse[];
    } = {
      ended: [],
      ongoing: [],
    };

    for (const event of matchingEventsQuery.data || []) {
      if (event.phase !== "FINISHED") {
        result.ongoing.push(event);
      } else {
        result.ended.push(event);
      }
    }

    return result;
  }, [matchingEventsQuery.data]);

  const onLogout = useCallback(() => {
    logout();
    navigate("/");
  }, [logout, navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        "& > *": { marginBottom: "1em" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          "& > *": { marginBottom: ".4em" },
        }}
      >
        <Avatar src="../../assets/user-circle.png" />
        <Typography>{user!.name}</Typography>
      </Box>
      <Typography variant="h1" mb={2}>
        正在参与的活动：
      </Typography>
      {events.ongoing.length > 0 ? (
        events.ongoing.map((event) => (
          <div key={event.id}>
            <Link to={routes.eventHome(event.id)}>{event.title}</Link>
          </div>
        ))
      ) : (
        <>
          <Typography variant="body1" color="textDisabled">
            暂无
          </Typography>
          <Button onClick={() => navigate("/")}>点此去往最新一期活动</Button>
        </>
      )}
      <Divider sx={{ width: "100%", my: 5 }} />
      <Typography variant="h1" mb={2}>
        参加过的活动：
      </Typography>
      {events.ended.length > 0 ? (
        events.ended.map((event) => (
          <div key={event.id}>
            <Link to={routes.eventHome(event.id)}>{event.title}</Link>
          </div>
        ))
      ) : (
        <Typography variant="body1" color="textDisabled">
          暂无
        </Typography>
      )}
      <Button sx={{ mt: 6 }} variant="outlined" onClick={onLogout}>
        退出登陆
      </Button>
    </Box>
  );
};

export default UserHome;
