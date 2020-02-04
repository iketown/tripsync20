import React, { useEffect, useState } from "react";
import {
  Grid,
  DialogContent,
  DialogActions,
  Button,
  Card,
  CardContent,
  CardActions
} from "@material-ui/core";
import { Form, Field } from "react-final-form";
import { TextInput } from "../inputs";
import { useFirebaseCtx } from "../../contexts/FirebaseCtx";

const LegFormGround = ({
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

  const onSubmit = (values: any) => {
    console.log("values", values);
    if (groupId) {
      return firestore?.doc(docLoc).update(values);
    } else {
      return firestore?.collection(collectionLoc).add(values);
    }
  };

  const validate = (values: any) => {
    const errors: any = {};
    if (!values.groupName) errors.groupName = "Please enter a group name";
    return errors;
  };

  return (
    <Form {...{ onSubmit, validate, initialValues }}>
      {({ handleSubmit, values, submitSucceeded }) => {
        if (submitSucceeded) onSuccess && onSuccess();
        return (
          <Card>
            <form onSubmit={handleSubmit}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextInput name="groupName" label="Group Name" fullWidth />
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions>
                <Button onClick={onCancel}>cancel</Button>
                <Button variant="contained" color="primary" type="submit">
                  save
                </Button>
              </CardActions>
            </form>
          </Card>
        );
      }}
    </Form>
  );
};

export default LegFormGround;
