import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, onSnapshot } from "@firebase/firestore";
import { answerFriendRequest } from "../utils/functions";
import { RequestProps, User } from "../types";

interface Props {
  request: RequestProps;
  myAccount: User | null;
}

const Request = ({ request, myAccount }: Props) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(
    () =>
      onSnapshot(doc(db, "users", request.requestId), (snapshot: any) =>
        setUser({ id: snapshot.id, ...snapshot.data() })
      ),
    []
  );

  return (
    <div className="w-56 overflow-hidden rounded-xl bg-white">
      <img
        className="h-48 w-full border object-cover lg:h-52"
        loading="lazy"
        src={user?.photoUrl ? user?.photoUrl : "/assets/no-profile.jpeg"}
        alt=""
      />

      <div className="p-2 text-sm md:text-base">
        <p className="mb-4 font-semibold capitalize">{user?.displayName}</p>

        <button
          onClick={() =>
            user && answerFriendRequest(myAccount, user, request.id, "add")
          }
          className="mb-2 w-full rounded bg-blue-100 py-0.5 font-medium text-blue-500"
        >
          Add Friend
        </button>

        <button
          onClick={() =>
            user && answerFriendRequest(myAccount, user, request.id, "remove")
          }
          className="mb-2 w-full rounded bg-gray-300 py-0.5 font-medium "
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default Request;
