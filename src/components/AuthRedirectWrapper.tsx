import React, { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useGetIsLoggedIn } from "hooks";
import { routeNames } from "routes";

export const AuthRedirectWrapper = ({ children }: PropsWithChildren) => {
  const isLoggedIn = useGetIsLoggedIn();

  // if (isLoggedIn) {
  //   return <Navigate to={routeNames.dashboard} />;
  // }

  return <>{children}</>;
};
