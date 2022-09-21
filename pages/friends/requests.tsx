import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { User, RequestProps } from "../../types";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "@firebase/firestore";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Header from "../../components/Header";
import { useDispatch } from "react-redux";
import { setProfileOpen } from "../../store/store";
import Sidebar from "../../components/Sidebar";
import Request from "../../components/Request";

const Requests = () => {
  const [user] = useAuthState(auth);

  const dispatch = useDispatch();

  const [myAccount, setMyAccount] = useState<User | null>(null);

  const [friendRequests, setFriendRequests] = useState<RequestProps[]>([]);

  useEffect(() => {
    dispatch(setProfileOpen(false));
  }, []);

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

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "users", `${user?.uid}`, "friend requests"),
          orderBy("timstamp", "desc")
        ),
        (snapshot) =>
          setFriendRequests(
            snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
          )
      ),
    []
  );

  return (
    <div className="h-screen w-screen overflow-hidden">
      <Head>
        <title>Friend Requests</title>

        <link rel="icon" href="/assets/facebook-icon.webp" />
      </Head>

      <Header myAccount={myAccount} />

      <main
        className="relative flex"
        onClick={() => dispatch(setProfileOpen(false))}
      >
        <Sidebar myAccount={myAccount} />

        <div className="my-5 h-[calc(100vh-48px)] w-full px-4 ">
          <div className="mx-auto h-[calc(100%-40px)] w-full max-w-4xl overflow-y-scroll scrollbar-hide">
            <h1 className="text-xl font-bold">Friend Requests</h1>

            {friendRequests.length > 0 ? (
              <div className=" mt-4 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {friendRequests.map((request) => (
                  <Request
                    key={request.id}
                    request={request}
                    myAccount={myAccount}
                  />
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

                  <p className="text-lg font-bold">
                    You have no friend request
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Requests;
