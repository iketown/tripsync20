import React, { createContext, useContext, useState, useEffect } from "react";
import { Person } from "../../types/people.types";
import { useGroupCtx } from "../../components/group/GroupCtx";
import { useFirebaseCtx } from "../FirebaseCtx";

type PeopleContext = {
  people: Person[];
  peopleObj: { [altId: string]: Person };
};

const PeopleCtx = createContext<Partial<PeopleContext>>({});

export const PeopleCtxProvider = (props: any) => {
  const [people, setPeople] = useState<Person[]>([]);
  const [peopleObj, setPeopleObj] = useState<{ [altId: string]: Person }>({});
  const { group } = useGroupCtx();
  const { firestore } = useFirebaseCtx();

  useEffect(() => {
    if (!group || !group.id || !firestore) return;
    const peopleRef = firestore.collection(`groups/${group.id}/people`);
    const unsubscribe = peopleRef.onSnapshot(snap => {
      const _people: Person[] = [];
      snap.forEach(doc => {
        //@ts-ignore
        _people.push({ id: doc.id, ...doc.data() });
      });
      const _peopleObj = _people.reduce(
        (obj: { [altId: string]: Person }, person) => {
          obj[person.altId] = person;
          return obj;
        },
        {}
      );
      setPeople(_people);
      setPeopleObj(_peopleObj);
    });
    return unsubscribe;
  }, [group, firestore]);
  return <PeopleCtx.Provider value={{ people, peopleObj }} {...props} />;
};

export const usePeopleCtx = () => {
  const ctx = useContext(PeopleCtx);
  if (!ctx)
    throw new Error("usePeopleCtx must be a descendant of PeopleCtxProvider");
  return ctx;
};
