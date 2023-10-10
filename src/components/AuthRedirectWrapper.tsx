import React, { PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";
import { useGetIsLoggedIn } from "hooks";
import { routeNames } from "routes";

export const AuthRedirectWrapper = ({ children }: PropsWithChildren) => {
  const isLoggedIn = useGetIsLoggedIn();
  const navigate = useNavigate();

  if (isLoggedIn) {
    navigate(routeNames.home);
  }

  return <>{children}</>;
};
