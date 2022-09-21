import React, { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "../firebase";
import { doc, onSnapshot } from "@firebase/firestore";
import { CommentProps, User } from "../types";
import Moment from "react-moment";

interface Props {
  comment: CommentProps;
}

const Comment = ({ comment }: Props) => {
  const [user, setUser] = useState<User>();

  useEffect(
    () =>
      onSnapshot(doc(db, "users", comment?.userId), (snapshot: any) =>
        setUser({ id: snapshot.id, ...snapshot.data() })
      ),
    []
  );

  return (
    <div className="flex items-center space-x-2">
      <Link href={`/profile/${user?.id}`}>
        <img
          className="h-9 w-9 cursor-pointer rounded-full object-cover"
          src={user?.photoUrl ? user?.photoUrl : "/assets/no-profile.jpeg"}
          alt=""
        />
      </Link>

      <div className="flex-1 text-sm">
        <p className="font-semibold capitalize">{user?.displayName}</p>

        <p>{comment.comment}</p>
      </div>

      <p className="text-xs">
        <Moment
          fromNow
          date={new Date(comment.timestamp.seconds * 1000).toUTCString()}
        />
      </p>
    </div>
  );
};

export default Comment;
