import React from "react";
import { Button } from "@material-ui/core";
import { navigate } from "@reach/router";

//
//
const SecretPage = () => {
  return (
    <div>
      SECRET!
      <Button onClick={() => navigate("/dashboard")}>dashboard</Button>
    </div>
  );
};

export default SecretPage;
