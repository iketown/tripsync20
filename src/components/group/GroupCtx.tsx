import React, { useState, useEffect, createContext, useContext } from "react";
import { Group } from "../../types/Group";
import { useFirebaseCtx } from "../../contexts/FirebaseCtx";
//
//

type ContextProps = {
  group: Group;
  permissions: { isAdmin: boolean; isMember: boolean; isOwner: boolean };
  loading: boolean;
};
const GroupCtx = createContext<Partial<ContextProps>>({});

export const GroupCtxProvider = ({
  children,
  groupId
}: {
  children: any;
  groupId?: string;
}) => {
  const { user, firestore } = useFirebaseCtx();
  const [group, setGroup] = useState<Group>();
  const [permissions, setPermissions] = useState({
    isAdmin: false,
    isMember: false,
    isOwner: false
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!groupId) return;
    if (!user) return;

    const unsubscribe = firestore?.doc(`groups/${groupId}`).onSnapshot(snap => {
      if (snap.exists) {
        const data = snap.data();
        if (data) {
          const {
            groupName,
            createdBy,
            admins,
            members,
            defaultMapCenter
          } = data;
          const isOwner = createdBy === user.uid;
          const isAdmin = admins.includes(user.uid);
          const isMember = members && members.includes(user.uid);
          setPermissions({ isAdmin, isMember, isOwner });
          setGroup({
            id: snap.id,
            groupName,
            createdBy,
            admins,
            members,
            defaultMapCenter
          });
          setLoading(false);
        }
      } else {
        setLoading(false);
        console.log("nope");
      }
    });
    return unsubscribe;
  }, [firestore, groupId, user]);
  return (
    <GroupCtx.Provider value={{ group, permissions, loading }}>
      {children}
    </GroupCtx.Provider>
  );
};

export default GroupCtx;

export const useGroupCtx = () => {
  const ctx = useContext(GroupCtx);
  if (!ctx)
    throw new Error("useGroupCtx must be a descendant of GroupCtxProvider :/");
  return ctx;
};
