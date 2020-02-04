import React, { useState, useEffect, useCallback } from "react";
import { useFirebaseCtx } from "../contexts/FirebaseCtx";
import { useGroupCtx } from "../components/group/GroupCtx";
import { TravelEmail } from "../forms/smartTravels/travelEmail.types";
export type ListenEmail = {
  email: string;
  id: string;
};

export type ImportedItin = {};

export const useTravelImport = () => {
  const { firestore } = useFirebaseCtx();
  const { group } = useGroupCtx();
  const [travEmails, setTravEmails] = useState<TravelEmail[]>([]);

  useEffect(() => {
    if (!group || !group.id) return;
    const travEmailsRef = firestore?.collection(
      `groups/${group.id}/travelEmails`
    );
    const unsubscribe = travEmailsRef?.onSnapshot(snap => {
      const _travEmails: TravelEmail[] = [];
      snap.forEach(doc => {
        //@ts-ignore
        const data: TravelEmail = doc.data();
        _travEmails.push(data);
      });
      setTravEmails(_travEmails);
    });
    return unsubscribe;
  }, [firestore, group]);

  return { travEmails };
};
