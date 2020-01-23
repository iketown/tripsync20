import React, { useEffect, useState } from "react";
import { useFirebaseCtx } from "../contexts/FirebaseCtx";
import { RouteComponentProps } from "@reach/router";
import { Group } from "../types/Group";
import ShowMe from "../utils/ShowMe";
import Loading from "../components/Loading";
import { Typography, Button } from "@material-ui/core";
import GroupAdmin from "../components/group/GroupAdmin";
import { useGroupCtx, GroupCtxProvider } from "../components/group/GroupCtx";
import { EventsCtxProvider } from "../contexts/eventsCtx/EventsCtx";
import DialogContainer from "../contexts/dialogCtx/DialogContainer";

interface GroupPageProps extends RouteComponentProps {
  groupId?: string;
}

const GroupPageContainer = (props: GroupPageProps) => {
  return (
    <GroupCtxProvider groupId={props.groupId}>
      <EventsCtxProvider>
        <GroupPage />
        <DialogContainer />
      </EventsCtxProvider>
    </GroupCtxProvider>
  );
};

const GroupPage = (props: GroupPageProps) => {
  const { loading, group, permissions } = useGroupCtx();

  if (loading) return <Loading scale={2} />;
  if (!group) return <div>no such group</div>;
  if (!permissions || (!permissions.isAdmin && !permissions.isMember))
    return <YoureOut groupName={group.groupName} />;
  return (
    <div>
      <Typography variant="h4">{group.groupName}</Typography>
      {permissions.isAdmin && <GroupAdmin />}
      <ShowMe obj={group} name="group" noModal />
      <ShowMe obj={permissions} name="permissions" noModal />
    </div>
  );
};

export default GroupPageContainer;

const YoureOut = ({ groupName }: { groupName?: string }) => {
  return (
    <div style={{ textAlign: "center", margin: "3rem auto" }}>
      {groupName && (
        <>
          <Typography>you've found</Typography>
          <Typography variant="h4" gutterBottom>
            {groupName}
          </Typography>
        </>
      )}
      <Typography gutterBottom>hmm... you're not in this group</Typography>
      <Button variant="outlined" color="primary">
        request to join?
      </Button>
    </div>
  );
};
