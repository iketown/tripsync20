import React from "react";
import { Router } from "@reach/router";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Route, { ProtectedRoute } from "./utils/Route";
import DashboardPage from "./pages/DashboardPage";
import SecretPage from "./pages/SecretPage";
import SignIn from "./pages/SignIn";
import { Container } from "@material-ui/core";
import GroupPage from "./pages/GroupPage";
import styled from "styled-components";
import GlobalProviders from "./GlobalProviders";
//
//

const GlobalStyles = styled.div`
  .centered {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .tightList {
    margin: 0 auto;
    padding: 0;
  }
`;

const App: React.FC = () => {
  return (
    <GlobalStyles className="App">
      <GlobalProviders>
        <NavBar />
        <Container style={{ position: "relative" }}>
          <Router>
            <ProtectedRoute path="/dashboard" component={DashboardPage} />
            <ProtectedRoute path="/secret" component={SecretPage} />
            <ProtectedRoute
              path="/group/:groupId"
              //@ts-ignore
              component={GroupPage}
            />
            <Route path="/signin" component={SignIn} />
            <Route path="/" component={Home} />
          </Router>
        </Container>
      </GlobalProviders>
    </GlobalStyles>
  );
};

export default App;
