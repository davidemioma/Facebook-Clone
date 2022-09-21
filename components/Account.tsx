import React, { useState } from "react";
import Link from "next/link";
import { HiUserAdd, HiUserRemove } from "react-icons/hi";
import { sendRequest } from "../utils/functions";
import { v4 as uuidv4 } from "uuid";
import { User } from "../types";

interface Props {
  user: User;
  myAccount: User | null;
}

const Account = ({ user, myAccount }: Props) => {
  const [sentRequest, setSentRequest] = useState(false);

  const sendFriendRequest = async () => {
    await sendRequest(myAccount, user, uuidv4())
      .then(() => setSentRequest(true))
      .catch((err) => console.log(err));
  };

  return (
    <div className="w-36 overflow-hidden rounded border bg-white shadow-md">
      <Link href={`/profile/${user.id}`}>
        <img
          className="h-32 w-full cursor-pointer border-b object-cover"
          loading="lazy"
          src={user?.photoUrl ? user?.photoUrl : "/assets/no-profile.jpeg"}
          alt=""
        />
      </Link>

      <div className="overflow-hidden p-2">
        <p className="mb-5 space-x-1 text-xs font-bold capitalize sm:text-sm">
          {user.displayName}
        </p>

        <button
          disabled={sentRequest}
          onClick={sendFriendRequest}
          className={`${
            sentRequest ? "bg-gray-300" : "bg-blue-100 text-blue-500"
          } flex w-full justify-center rounded py-1 text-xs font-bold disabled:cursor-not-allowed sm:text-sm`}
        >
          {sentRequest ? (
            <div className="flex space-x-1">
              <HiUserRemove size={20} />

              <p>Sent</p>
            </div>
          ) : (
            <div className="flex space-x-1">
              <HiUserAdd size={20} />

              <p>Add Friend</p>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default Account;
