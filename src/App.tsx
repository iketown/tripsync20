import React from "react";
import { Router } from "@reach/router";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Route from "./utils/Route";

//
//

const App: React.FC = () => {
  return (
    <div className="App">
      <NavBar />
      <Router>
        <Route path="/" component={Home} />
      </Router>
    </div>
  );
};

export default App;
