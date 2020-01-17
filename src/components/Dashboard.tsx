import React from "react";
import { useFirebaseCtx } from "../contexts/FirebaseCtx";
const Dashboard = () => {
  const { firestore, user } = useFirebaseCtx();

  return <div>hey {user?.displayName}</div>;
};

export default Dashboard;
