import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button
} from "@material-ui/core";
import ShowTree from "../../utils/ShowTree";
import { usePeopleCtx } from "../../contexts/peopleCtx/PeopleCtx";
import { useDialogCtx } from "../../contexts/dialogCtx/DialogCtx";

//
//
const PeopleCard = () => {
  const { people } = usePeopleCtx();
  const { dispatch } = useDialogCtx();
  const handleAddPerson = () => {
    dispatch({
      type: "OPEN_DIALOG",
      formType: "person",
      props: {}
    });
  };
  return (
    <Card>
      <CardHeader />
      <CardContent></CardContent>
      <ShowTree obj={people} name="people" />
      <CardActions>
        <Button onClick={handleAddPerson}>Add Person</Button>
      </CardActions>
    </Card>
  );
};

export default PeopleCard;
