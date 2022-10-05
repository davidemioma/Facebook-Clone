import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase";
import { ChatProps, MessageProps, User } from "../../types";
import { useDispatch } from "react-redux";
import { setProfileOpen } from "../../store/store";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "@firebase/firestore";
import Header from "../../components/Header";
import ChatRow from "../../components/Chat";
import { useRouter } from "next/router";
import { BiHappyAlt } from "react-icons/bi";
import { sendMessage } from "../../utils/functions";
import Message from "../../components/Message";

const Chat = () => {
  const router = useRouter();

  const { id } = router.query;

  const dispatch = useDispatch();

  const [user] = useAuthState(auth);

  const [myAccount, setMyAccount] = useState<User | null>(null);

  const [chats, setChats] = useState<ChatProps[]>([]);

  const [currentChat, setCurrentChat] = useState<ChatProps | null>(null);

  const [recipientId, setRecipientId] = useState("");

  const [recipientInfo, setRecipientInfo] = useState<User | null>(null);

  const [messages, setMessages] = useState<MessageProps[]>([]);

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const endOfMessageRef = useRef<HTMLDivElement>(null);

  //Send Message
  const sendMessageHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!message.trim()) return;

    setLoading(true);

    await sendMessage(`${id}`, `${user?.uid}`, message).then(() => {
      setLoading(false);

      setMessage("");

      endOfMessageRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  //Close all modals and popup's
  useEffect(() => {
    dispatch(setProfileOpen(false));
  }, []);

  //Fetch current user's account details
  useEffect(
    () =>
      onSnapshot(doc(db, "users", `${user?.uid}`), (snapshot: any) =>
        setMyAccount({
          id: snapshot.id,
          ...snapshot.data(),
        })
      ),
    []
  );

  //Fetch all chats
  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "chats"),
          where("usersMatched", "array-contains", user?.uid)
        ),
        (snapshot) =>
          setChats(
            snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
          )
      ),
    []
  );

  //Fetch current chat details
  useEffect(
    () =>
      onSnapshot(doc(db, "chats", `${id}`), (snapshot: any) =>
        setCurrentChat({ id: snapshot.id, ...snapshot.data() })
      ),
    [id]
  );

  //Getting the recipient id
  useEffect(() => {
    const id = currentChat?.usersMatched.filter(
      (item) => item !== `${user?.uid}`
    );

    if (id) {
      setRecipientId(id[0]);
    }
  }, [currentChat]);

  //Fetching the recipient account details.
  useEffect(() => {
    let unsub;

    if (recipientId) {
      unsub = onSnapshot(doc(db, "users", recipientId), (snapshot: any) =>
        setRecipientInfo({ id: snapshot.id, ...snapshot.data() })
      );
    }

    return unsub;
  }, [recipientId]);

  //Fetching messages for the current chat
  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "chats", `${id}`, "messages"),
          orderBy("timestamp", "asc")
        ),
        (snapshot) =>
          setMessages(
            snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
          )
      ),
    [id]
  );

  return (
    <div>
      <Head>
        <title>Messenger</title>

        <link rel="icon" href="/assets/facebook-icon.webp" />
      </Head>

      <Header myAccount={myAccount} hideMessage />

      <main className="flex h-[calc(100vh-48px)] w-screen overflow-hidden">
        <div className="w-16 border-r border-gray-300 bg-white px-1 py-3 md:w-64 md:px-3 lg:w-72">
          <h1 className="text-lg font-bold">Chats</h1>

          {chats.length > 0 ? (
            <div className="mt-2 h-[85vh] space-y-2 overflow-y-scroll scrollbar-hide">
              {chats.map((chat) => (
                <ChatRow key={chat.id} chat={chat} />
              ))}
            </div>
          ) : (
            <div className="flex h-[80%] items-center justify-center">
              <div className="flex flex-col items-center">
                <Image
                  src="/assets/empty.svg"
                  width={150}
                  height={150}
                  objectFit="contain"
                />

                <p className="hidden text-lg font-bold md:inline">
                  You have no new chat
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="relative h-full w-full flex-1 bg-white">
          <div className="flex h-12 items-center space-x-2 border-b border-gray-300 px-4">
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

            <p className="font-semibold capitalize">
              {recipientInfo?.displayName}
            </p>
          </div>

          {messages.length > 0 ? (
            <div className="h-[calc(100%-112px)] w-full space-y-2 overflow-x-hidden overflow-y-scroll px-4 py-2 scrollbar-hide">
              {messages?.map((message) => (
                <Message key={message.id} message={message} />
              ))}

              <div ref={endOfMessageRef} />
            </div>
          ) : (
            <div className="flex h-[calc(100%-112px)] items-center justify-center">
              <div className="flex flex-col items-center">
                <Image
                  src="/assets/empty.svg"
                  width={150}
                  height={150}
                  objectFit="contain"
                />

                <p className="hidden text-lg font-bold md:inline">
                  You have no new message
                </p>
              </div>
            </div>
          )}

          <form
            onSubmit={sendMessageHandler}
            className="absolute bottom-0 flex h-16 w-full items-center space-x-2 px-4"
          >
            <div className="flex flex-1 items-center space-x-2 rounded-full bg-gray-100 px-4 py-1.5">
              <input
                className="flex-1 bg-transparent outline-none"
                value={message}
                type="text"
                placeholder="Aa"
                onChange={(e) => setMessage(e.target.value)}
              />

              <BiHappyAlt className="text-blue-500" size={20} />
            </div>

            <button
              disabled={loading}
              className="font-semibold text-blue-500 disabled:cursor-not-allowed"
              type="submit"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Chat;
