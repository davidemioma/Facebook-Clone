import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { ChatProps, User } from "../types";
import { doc, onSnapshot } from "@firebase/firestore";
import { useRouter } from "next/router";

interface Props {
  chat: ChatProps;
}

const Chat = ({ chat }: Props) => {
  const router = useRouter();

  const [user] = useAuthState(auth);

  const [recipientId, setRecipientId] = useState("");

  const [recipientInfo, setRecipientInfo] = useState<User | null>(null);

  useEffect(() => {
    const id = chat.usersMatched.filter((item) => item !== `${user?.uid}`);

    setRecipientId(id[0]);
  }, []);

  useEffect(() => {
    let unsub;

    if (recipientId) {
      unsub = onSnapshot(doc(db, "users", recipientId), (snapshot: any) =>
        setRecipientInfo({ id: snapshot.id, ...snapshot.data() })
      );
    }

    return unsub;
  }, [recipientId]);

  return (
    <Link href={`/chats/${chat.id}`}>
      <div
        className={`${
          router.asPath === `/chats/${chat.id}` && "bg-blue-100"
        } relative flex cursor-pointer items-center justify-center rounded-lg py-1.5 px-2 hover:bg-blue-100 md:justify-start md:space-x-2`}
      >
        <img
          className="h-10 w-10 rounded-full border object-cover"
          loading="lazy"
          src={
            recipientInfo?.photoUrl
              ? recipientInfo?.photoUrl
              : "/assets/no-profile.jpeg"
          }
          alt=""
        />

        <p className="hidden font-semibold capitalize md:inline">
          {recipientInfo?.displayName}
        </p>
      </div>
    </Link>
  );
};

export default Chat;
