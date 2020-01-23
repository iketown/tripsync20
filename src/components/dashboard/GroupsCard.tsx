import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar
} from "@material-ui/core";
import DialogForm from "../DialogForm";
import TourGroupForm from "../../forms/TourGroupForm";
import { useFirebaseCtx } from "../../contexts/FirebaseCtx";
import { Group } from "../../types/Group";
import ShowMe from "../../utils/ShowMe";
import { FaUsers } from "react-icons/fa";
import { navigate } from "@reach/router";
//
//
const GroupsCard = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const { firestore, user } = useFirebaseCtx();
  useEffect(() => {
    if (!user) return;
    const unsubscribe = firestore
      ?.collection("groups")
      .where("createdBy", "==", user.uid)
      .onSnapshot(querySnapshot => {
        const _myGroups: Group[] = [];
        querySnapshot.forEach(doc => {
          const { groupName, createdBy, admins } = doc.data();
          _myGroups.push({ id: doc.id, groupName, createdBy, admins });
        });
        setMyGroups(_myGroups);
      });
    return unsubscribe;
  }, [firestore, user]);
  return (
    <>
      <Card>
        <CardHeader title="My Groups" />
        <CardContent>
          <List>
            {myGroups.map(group => {
              return (
                <ListItem
                  button
                  dense
                  divider
                  onClick={() => navigate(`/group/${group.id}`)}
                >
                  <ListItemAvatar>
                    <FaUsers />
                  </ListItemAvatar>
                  <ListItemText primary={group.groupName} />
                </ListItem>
              );
            })}
          </List>
        </CardContent>
        <CardActions>
          <Button>create new group</Button>
        </CardActions>
      </Card>
      <ShowMe obj={myGroups} name="myGroups" noModal />
      <DialogForm
        {...{ dialogOpen, setDialogOpen }}
        content={
          <TourGroupForm
            onCancel={() => setDialogOpen(false)}
            onSuccess={() => setDialogOpen(false)}
          />
        }
      />
    </>
  );
};

export default GroupsCard;
