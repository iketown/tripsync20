import React, { useEffect } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { useFirebaseCtx } from "../contexts/FirebaseCtx";
import { Dialog } from "@material-ui/core";
import { navigate } from "@reach/router";

interface FBAuthProps {
  intendedPath?: string;
}
const FBAuth = ({ intendedPath }: FBAuthProps) => {
  const signInSuccessUrl = intendedPath || "/dashboard";
  const { firebase, user } = useFirebaseCtx();

  useEffect(() => {
    if (user) {
      navigate(signInSuccessUrl);
    }
  }, [signInSuccessUrl, user]);

  const uiConfig = {
    signInFlow: "popup",
    // signInSuccessUrl,
    tosUrl: "https://ike.town/tos",
    privacyPolicyUrl: "https://ike.town/privacy",
    signInOptions: [
      {
        provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        authMethod: "https://accounts.google.com",
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID
      },
      // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      // firebase.auth.GithubAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccessWithAuthResult: (props: any) => {
        console.log("success props", props);
        return false;
      }
    }
  };
  return (
    <Dialog open={true}>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </Dialog>
  );
};

export default FBAuth;
