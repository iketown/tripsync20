import React, { useEffect, useState } from "react";
import { Grid, DialogContent, DialogActions, Button } from "@material-ui/core";
import { Form, Field } from "react-final-form";
import { TextInput } from "../inputs";
import { useFirebaseCtx } from "../../contexts/FirebaseCtx";
import MaterialAirportAC from "../formComponents/MaterialAirportAC/MaterialAirportAC";
import { useDialogCtx } from "../../contexts/dialogCtx/DialogCtx";
import ShowTree from "../../utils/ShowTree";
import { useGroupCtx } from "../../components/group/GroupCtx";
const PersonForm = ({
  onSuccess,
  onCancel
}: {
  onSuccess?: () => void;
  onCancel?: () => void;
}) => {
  const { firestore, user } = useFirebaseCtx();
  const {
    state: {
      props: { altId }
    }
  } = useDialogCtx();

  const [initialValues, setInitialValues] = useState();
  const { group } = useGroupCtx();
  const groupId = group && group.id;
  const docLoc = groupId && altId ? `groups/${groupId}/people/${altId}` : null;
  const collectionLoc = groupId ? `groups/${groupId}/people` : null;

  const onSubmit = (values: any) => {
    values.altId = `${values.lastName.toLowerCase()}-${values.firstName.toLowerCase()}`;
    console.log("values", values);
    if (!groupId) return;
    if (docLoc) {
      return firestore?.doc(docLoc).update(values);
    } else if (collectionLoc) {
      return firestore
        ?.collection(collectionLoc)
        .doc(values.altId)
        .set(values);
    }
  };

  const validate = (values: any) => {
    const errors: any = {};
    if (!values.firstName) errors.firstName = "Please enter a first name";
    if (!values.lastName) errors.lastName = "Please enter a last name";
    if (!values.email) errors.email = "Please enter an Email";
    if (!values.homeAirportId)
      errors.homeAirportId = "Please enter a Home Airport";
    return errors;
  };

  return (
    <Form {...{ onSubmit, validate, initialValues }}>
      {({ handleSubmit, values, submitSucceeded, valid, submitting }) => {
        if (submitSucceeded) onSuccess && onSuccess();
        return (
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextInput name="firstName" label="First Name" fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextInput name="lastName" label="Last Name" fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextInput name="email" label="Email" fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MaterialAirportAC
                    label="Home Airport"
                    locBasicName="homeAirportLocBasic"
                    idName="homeAirportId"
                  />
                </Grid>
                <Grid item xs={12} sm={6}></Grid>
                <Grid item xs={12}>
                  <ShowTree obj={values} name="values" />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={onCancel}>cancel</Button>
              <Button
                disabled={!valid || submitting}
                variant="contained"
                color="primary"
                type="submit"
              >
                save
              </Button>
            </DialogActions>
          </form>
        );
      }}
    </Form>
  );
};

export default PersonForm;
