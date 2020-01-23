import React from "react";
import { CircularProgress } from "@material-ui/core";
import styled from "styled-components";

const FullPageLoader = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;
const Loading = ({ scale = 1 }: { scale?: number }) => {
  return (
    <FullPageLoader>
      <CircularProgress size={40 * scale} />
    </FullPageLoader>
  );
};

export default Loading;
