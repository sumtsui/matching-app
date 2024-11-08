import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { QueryObserverResult, useQuery } from "react-query";
import * as userApi from "../api/user";
import { routes } from "../routes";
import {
  matchPath,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

interface AuthState {
  user: userApi.User | undefined;
  isParticipant: boolean;
}

interface AuthContextValue {
  user: userApi.User | undefined;
  isParticipant: boolean;
  wechatLogin: () => void;
  logout: () => void;
  refetchMe: () => Promise<QueryObserverResult<userApi.User, unknown>>;
}

const AuthContext = createContext<AuthContextValue>({
  user: undefined,
  isParticipant: false,
  wechatLogin: () => null,
  logout: () => null,
  refetchMe: () => Promise.resolve({} as QueryObserverResult<userApi.User>),
});

const PublicRoutes = ["/", routes.eventCover(), routes.allEvents()];

const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { eventId } = useParams();
  const location = useLocation();
  const [authState, setAuthState] = useState<AuthState>({
    user: undefined,
    isParticipant: false,
  });
  const isPublicRoute = PublicRoutes.some((route) =>
    matchPath(route, location.pathname)
  );

  const wechatLogin = useCallback(async () => {
    const APPID = process.env.REACT_APP_WECHAT_APP_ID;
    const REDIRECT_URI = `${process.env.REACT_APP_URL}/api/user/wechat-login?eventId=${eventId}`;
    const SCOPE = "snsapi_userinfo";
    const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APPID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPE}&state=STATE#wechat_redirect`;
    window.location.href = url;
  }, [eventId]);

  const updateAuthState = useCallback(
    (newState: Partial<AuthState>) => {
      setAuthState({ ...authState, ...newState });
    },
    [authState]
  );

  const meQuery = useQuery(["me", eventId], userApi.getUserByAccessToken, {
    onSuccess: (data) => {
      updateAuthState({
        user: data,
        isParticipant: data.eventIds.includes(eventId!),
      });
    },
    onError: () => {
      updateAuthState({
        user: undefined,
      });
      if (isPublicRoute) return;
      eventId ? navigate(routes.eventCover(eventId)) : navigate("/");
    },
    refetchOnWindowFocus: true, // disable if server load is too high
    retry: false,
  });

  // handle wechat redirect
  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    if (!accessToken) return;

    localStorage.setItem("access_token", accessToken);
    navigate(``, { replace: true }); // remove access_token from url
  }, [navigate, searchParams]);

  const logout = useCallback(() => {
    updateAuthState({ user: undefined });
    localStorage.removeItem("access_token");
  }, [updateAuthState]);

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        isParticipant: authState.isParticipant,
        wechatLogin,
        logout,
        refetchMe: meQuery.refetch,
      }}
    >
      {authState.user || isPublicRoute ? children : null}
    </AuthContext.Provider>
  );
};

const useAuthState = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthState must be used within AuthProvider");
  }

  return context;
};

export { AuthProvider, useAuthState };
