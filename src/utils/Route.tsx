import React, { ComponentType } from "react";
import { RouteComponentProps } from "@reach/router";

// https://github.com/reach/router/issues/141

type Props = { component: ComponentType } & RouteComponentProps;

const Route: ComponentType<Props> = ({ component: Component, ...rest }) => (
  <Component {...rest} />
);

export default Route;
