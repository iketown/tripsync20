import React from "react";
import { Router } from "@reach/router";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Route, { ProtectedRoute } from "./utils/Route";
import Dashboard from "./components/Dashboard";
import SecretPage from "./pages/SecretPage";
import SignIn from "./pages/SignIn";
//
//

const App: React.FC = () => {
  return (
    <div className="App">
      <NavBar />
      <Router>
        <ProtectedRoute path="/dashboard" component={Dashboard} />
        <ProtectedRoute path="/secret" component={SecretPage} />
        <Route path="/signin" component={SignIn} />
        <Route path="/" component={Home} />
      </Router>
    </div>
  );
};

export default App;
