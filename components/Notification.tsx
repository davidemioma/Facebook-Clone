import React, { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "../firebase";
import { doc, onSnapshot } from "@firebase/firestore";
import { NotificationProps, User } from "../types";
import Moment from "react-moment";

interface Props {
  notification: NotificationProps;
}

const Notification = ({ notification }: Props) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(
    () =>
      onSnapshot(doc(db, "users", notification.requestId), (snapshot: any) =>
        setUser({ id: snapshot.id, ...snapshot.data() })
      ),
    []
  );

  return (
    <div>
      {notification.task === "friend request" && (
        <Link href="/friends/requests">
          <div className="flex cursor-pointer items-center space-x-2">
            <img
              className="h-7 w-7 rounded-full border"
              loading="lazy"
              src={user?.photoUrl ? user?.photoUrl : "/assets/no-profile.jpeg"}
              alt=""
            />

            <p className="flex-1 text-sm">
              <span className="font-bold capitalize"> {user?.displayName}</span>{" "}
              sent you a friend request
            </p>

            <p className="whitespace-nowrap text-xs text-gray-500">
              <Moment
                fromNow
                date={new Date(
                  notification.timstamp.seconds * 1000
                ).toUTCString()}
              />
            </p>
          </div>
        </Link>
      )}
    </div>
  );
};

export default Notification;
