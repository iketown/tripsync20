import React, { ComponentType, useEffect } from "react";
import { RouteComponentProps, redirectTo } from "@reach/router";
import { useFirebaseCtx } from "../contexts/FirebaseCtx";
import SignInPage from "../pages/SignIn";
import FBAuth from "../components/FBAuth";

// https://github.com/reach/router/issues/141

type Props = { component: ComponentType } & RouteComponentProps;

const Route: ComponentType<Props> = ({ component: Component, ...rest }) => {
  return <Component {...rest} />;
};

export default Route;

export const ProtectedRoute: ComponentType<Props> = ({
  component: Component,
  path,
  ...rest
}) => {
  const { user } = useFirebaseCtx();

  if (!user) return <FBAuth intendedPath={path} />;
  return <Component {...rest} />;
};
