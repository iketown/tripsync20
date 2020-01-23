import React, { useEffect, useState } from "react";
import { useFirebaseCtx } from "../contexts/FirebaseCtx";
import { Form, Field } from "react-final-form";
import {
  DialogContent,
  DialogActions,
  Grid,
  Button,
  LinearProgress
} from "@material-ui/core";
import { TextInput } from "./inputs";

const ProfileForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { firestore, user } = useFirebaseCtx();

  const [initialValues, setInitialValues] = useState();
  useEffect(() => {
    firestore &&
      user &&
      firestore
        .doc(`/users/${user.uid}`)
        .get()
        .then(doc => {
          console.log("user in then", doc);
          if (doc.exists) {
            const _initialVals = { id: doc.id, ...doc.data() };
            setInitialValues(_initialVals);
          }
        })
        .catch(err => console.log("fs error", err));
  }, [firestore, user]);

  const onSubmit = async (values: any) => {
    if (user)
      return firestore?.doc(`/users/${user.uid}`).set(values, { merge: true });
  };

  const validate = (values: any) => {
    const errors: any = {};
    if (!values.displayName) errors.displayName = "please add a Display Name";
    return errors;
  };
  return (
    <Form {...{ onSubmit, validate, initialValues }}>
      {({ handleSubmit, values, submitting, submitSucceeded }) => {
        if (submitSucceeded) {
          onSuccess && onSuccess();
        }
        return (
          <>
            {submitting && <LinearProgress />}

            <form onSubmit={handleSubmit}>
              <DialogContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextInput
                      name="displayName"
                      label="Display Name"
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={onSuccess}>cancel</Button>
                <Button type="submit">save</Button>
              </DialogActions>
            </form>
          </>
        );
      }}
    </Form>
  );
};

export default ProfileForm;
