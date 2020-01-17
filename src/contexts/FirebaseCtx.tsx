import React, { createContext, useContext, useState, useEffect } from "react";
import * as firebase from "firebase";

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};
firebase.initializeApp(config);

const FBCtx = createContext<{
  firebase: typeof firebase;
  firestore?: firebase.firestore.Firestore;
  user?: firebase.User | null;
}>({ firebase });

export const FirebaseCtxProvider: React.FC = props => {
  const [user, setUser] = useState<firebase.User | null>();
  const firestore = firebase.app().firestore();
  useEffect(() => {
    if (firebase) {
      const unregister = firebase
        .auth()
        .onAuthStateChanged(fbUser => setUser(fbUser));
      return unregister;
    }
  }, []);

  return <FBCtx.Provider value={{ firebase, user, firestore }} {...props} />;
};

export const useFirebaseCtx = () => {
  const ctx = useContext(FBCtx);
  // if (!ctx)
  //   throw new Error(
  //     "useFirebaseCtx must be a descendant of FirebaseCtxProvider :/"
  //   );
  return ctx;
};
