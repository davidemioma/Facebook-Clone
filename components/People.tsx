import { collection, onSnapshot, query, where } from "@firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { User } from "../types";
import Account from "./Account";

interface Props {
  myAccount: User | null;
}

const People = ({ myAccount }: Props) => {
  const [user] = useAuthState(auth);

  const [users, setUsers] = useState<User[]>([]);

  const [requestsEmails, setRequestsEmails] = useState([]);

  const [friendsEmails, setFriendsEmails] = useState([]);

  const [sentEmails, setSentEmails] = useState([]);

  useEffect(
    () =>
      onSnapshot(
        collection(db, "users", `${user?.uid}`, "friend requests"),
        (snapshot: any) =>
          setRequestsEmails(snapshot.docs.map((doc: any) => doc.data()?.mail))
      ),
    []
  );

  useEffect(
    () =>
      onSnapshot(
        collection(db, "users", `${user?.uid}`, "friends"),
        (snapshot: any) =>
          setFriendsEmails(snapshot.docs.map((doc: any) => doc.data()?.mail))
      ),
    []
  );

  useEffect(
    () =>
      onSnapshot(
        collection(db, "users", `${user?.uid}`, "sent"),
        (snapshot: any) =>
          setSentEmails(snapshot.docs.map((doc: any) => doc.data()?.mail))
      ),
    []
  );

  useEffect(() => {
    const newRequestsEmails =
      requestsEmails.length > 0 ? requestsEmails : ["test"];

    const newFriendsEmails =
      friendsEmails.length > 0 ? friendsEmails : ["test"];

    const newSentEmails = sentEmails.length > 0 ? sentEmails : ["test"];

    const unSub = onSnapshot(
      query(
        collection(db, "users"),
        where("mail", "not-in", [
          ...newRequestsEmails,
          ...newFriendsEmails,
          ...newSentEmails,
        ])
      ),
      (snapshot) =>
        setUsers(
          snapshot.docs
            .filter((doc) => doc.id !== user?.uid)
            .map((doc: any) => ({ id: doc.id, ...doc.data() }))
        )
    );

    return unSub;
  }, [requestsEmails, friendsEmails, sentEmails]);

  return (
    <>
      {users.length > 0 && (
        <div className="relative mx-auto mt-5 flex w-full max-w-xl items-center space-x-2 overflow-x-scroll rounded-xl bg-white px-3 py-2 scrollbar-hide">
          {users?.map((user) => (
            <Account key={user.id} user={user} myAccount={myAccount} />
          ))}
        </div>
      )}
    </>
  );
};

export default People;
