import React, { useEffect, useState } from "react";
import Link from "next/link";
import { auth, db } from "../firebase";
import { collection, doc, onSnapshot } from "@firebase/firestore";
import { FriendProps, User } from "../types";
import { HiUserAdd } from "react-icons/hi";
import { useAuthState } from "react-firebase-hooks/auth";
import { sendRequest } from "../utils/functions";
import { v4 as uuidv4 } from "uuid";

interface Props {
  friend: FriendProps;
  myAccount: User | null;
}

const Friend = ({ friend, myAccount }: Props) => {
  const [user] = useAuthState(auth);

  const [userProfile, setUserProfile] = useState<User | null>(null);

  const [myFriends, setMyFriends] = useState<FriendProps[]>([]);

  const [hasAdded, setHasAdded] = useState(false);

  const [loading, setIsLoading] = useState(false);

  const sendRequestHandler = async () => {
    setIsLoading(true);

    if (!userProfile) return;

    await sendRequest(myAccount, userProfile, uuidv4()).then(() =>
      setIsLoading(false)
    );
  };

  useEffect(
    () =>
      onSnapshot(doc(db, "users", friend.userId), (snapshot: any) =>
        setUserProfile({ id: snapshot.id, ...snapshot.data() })
      ),
    []
  );

  useEffect(
    () =>
      onSnapshot(
        collection(db, "users", `${user?.uid}`, "friends"),
        (snapshot) =>
          setMyFriends(
            snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
          )
      ),
    []
  );

  useEffect(
    () =>
      setHasAdded(
        myFriends.findIndex((myFriend) => myFriend.userId === friend.userId) !==
          -1
      ),
    [myFriends]
  );

  return (
    <div className="flex items-center space-x-3 rounded-lg border py-3 px-4">
      <Link href={`/profile/${friend.userId}`}>
        <img
          className="h-16 w-16 cursor-pointer rounded-lg border object-cover shadow-md"
          src={
            userProfile?.photoUrl
              ? userProfile?.photoUrl
              : "/assets/no-profile.jpeg"
          }
          loading="lazy"
          alt=""
        />
      </Link>

      <p className="flex-1 text-sm font-bold capitalize md:text-base">
        {userProfile?.displayName}
      </p>

      {friend.userId !== user?.uid && (
        <>
          {!hasAdded && (
            <button
              onClick={sendRequestHandler}
              disabled={loading}
              className="flex items-center space-x-1 rounded bg-blue-100 px-3 py-1 text-blue-500 transition-transform duration-200 hover:scale-105 disabled:cursor-not-allowed"
            >
              <HiUserAdd size={20} />

              <p className="hidden sm:inline">Add Friend</p>
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Friend;
