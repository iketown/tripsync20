import React, { useEffect, useState } from "react";
import { Grid, DialogContent, DialogActions, Button } from "@material-ui/core";
import { Form, Field } from "react-final-form";
import { TextInput } from "./inputs";
import { useFirebaseCtx } from "../contexts/FirebaseCtx";

const TourGroupForm = ({
  groupId,
  onSuccess,
  onCancel
}: {
  groupId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}) => {
  const { firestore, user } = useFirebaseCtx();
  const [initialValues, setInitialValues] = useState();
  const docLoc = `groups/${groupId}`;
  const collectionLoc = `groups`;

  useEffect(() => {
    if (groupId) {
      firestore
        ?.doc(docLoc)
        .get()
        .then(doc => {
          if (doc.exists) {
            setInitialValues(doc.data());
          }
        });
    }
  }, [docLoc, firestore, groupId]);

  const onSubmit = (values: any) => {
    console.log("values", values);
    if (!user) return { error: "Must be signed in to do this" };
    if (groupId) {
      return firestore?.doc(docLoc).update(values);
    } else {
      return firestore
        ?.collection(collectionLoc)
        .add({ ...values, createdBy: user.uid, admins: [user.uid] });
    }
  };

  const validate = (values: any) => {
    const errors: any = {};
    if (!values.groupName) errors.groupName = "Please enter a group name";
    return errors;
  };

  return (
    <Form {...{ onSubmit, validate, initialValues }}>
      {({ handleSubmit, values, submitSucceeded, submitErrors }) => {
        if (submitSucceeded) onSuccess && onSuccess();

        return (
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextInput name="groupName" label="Group Name" fullWidth />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={onCancel}>cancel</Button>
              <Button variant="contained" color="primary" type="submit">
                save
              </Button>
            </DialogActions>
          </form>
        );
      }}
    </Form>
  );
};

export default TourGroupForm;
