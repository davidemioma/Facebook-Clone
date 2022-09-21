import React, { useEffect, useState } from "react";
import Head from "next/head";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Feed from "../components/Feed";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { User } from "../types";
import { onSnapshot, doc } from "@firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { setProfileOpen } from "../store/store";
import AddPostModal from "../components/AddPostModal";
import { formSelector } from "../store/ui-slice";

const Home = () => {
  const dispatch = useDispatch();

  const [user] = useAuthState(auth);

  const formOpen = useSelector(formSelector);

  const [myAccount, setMyAccount] = useState<User | null>(null);

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

  return (
    <div className={`${formOpen && "h-screen overflow-hidden"} w-screen`}>
      <Head>
        <title>Facebook - Home</title>

        <link rel="icon" href="/assets/facebook-icon.webp" />
      </Head>

      <Header myAccount={myAccount} />

      {myAccount && (
        <main
          className="relative flex w-screen"
          onClick={() => dispatch(setProfileOpen(false))}
        >
          <Sidebar myAccount={myAccount} />

          <Feed myAccount={myAccount} />
        </main>
      )}

      {formOpen && <AddPostModal myAccount={myAccount} />}
    </div>
  );
};

export default Home;
