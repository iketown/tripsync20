import React, { useEffect } from "react";
import FBAuth from "../components/FBAuth";

const Home = () => {
  useEffect(() => {
    console.log("hey", process.env.REACT_APP_SECRET);
    console.log("node env", process.env.NODE_ENV);
  }, []);
  return (
    <div>
      home page
      <div>you are not logged in, etc</div>
    </div>
  );
};

export default Home;
