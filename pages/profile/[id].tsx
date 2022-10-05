import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase";
import { User, PostProps, FriendProps } from "../../types";
import { onSnapshot, doc, query, collection, where } from "@firebase/firestore";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { formSelector } from "../../store/ui-slice";
import { setProfileOpen } from "../../store/store";
import CoverImage from "../../components/CoverImage";
import ProfileImage from "../../components/ProfileImage";
import Box from "../../components/Box";
import AddPostModal from "../../components/AddPostModal";
import EmptyPosts from "../../components/EmptyPosts";
import Post from "../../components/Post";
import Friend from "../../components/Friend";

const Profile = () => {
  const dispatch = useDispatch();

  const formOpen = useSelector(formSelector);

  const [user] = useAuthState(auth);

  const router = useRouter();

  const { id } = router.query;

  const [myAccount, setMyAccount] = useState<User | null>(null);

  const [profileAccount, setProfileAccount] = useState<User | null>(null);

  const [show, setShow] = useState(0);

  const [posts, setPosts] = useState<PostProps[]>([]);

  const [friends, setFriends] = useState<FriendProps[]>([]);

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
      onSnapshot(doc(db, "users", `${id}`), (snapshot: any) =>
        setProfileAccount({
          id: snapshot.id,
          ...snapshot.data(),
        })
      ),
    [id]
  );

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "posts"), where("userId", "==", id)),
        (snapshot) =>
          setPosts(
            snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
          )
      ),
    [id]
  );

  useEffect(
    () =>
      onSnapshot(collection(db, "users", `${id}`, "friends"), (snapshot) =>
        setFriends(
          snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
        )
      ),
    [id]
  );

  return (
    <div className={`${formOpen && "h-screen overflow-hidden"} w-screen`}>
      <Head>
        <title>{`${profileAccount?.firstname} ${profileAccount?.surname}`}</title>

        <link rel="icon" href="/assets/facebook-icon.webp" />
      </Head>

      <Header myAccount={myAccount} />

      <main
        className="relative flex w-screen"
        onClick={() => dispatch(setProfileOpen(false))}
      >
        <Sidebar myAccount={myAccount} />

        <div className="flex-1">
          <div className="w-full">
            <CoverImage myAccount={myAccount} profileAccount={profileAccount} />

            <ProfileImage
              myAccount={myAccount}
              profileAccount={profileAccount}
            />

            <div className="flex items-center bg-white px-4 pt-1">
              <div
                onClick={() => setShow(0)}
                className={`${
                  show === 0
                    ? "border-b-4 border-blue-500 text-blue-500"
                    : "text-bborder-l-black mb-1 rounded-lg"
                } selectBtn`}
              >
                Posts
              </div>

              <div
                onClick={() => setShow(1)}
                className={`${
                  show === 1
                    ? "border-b-4 border-blue-500 text-blue-500"
                    : "mb-1 rounded-lg text-black"
                } selectBtn`}
              >
                Friends
              </div>
            </div>
          </div>

          {show === 0 ? (
            <div className="mx-auto w-full max-w-xl px-3 sm:px-0">
              {myAccount?.id === profileAccount?.id && (
                <Box myAccount={myAccount} />
              )}

              {myAccount?.id === profileAccount?.id ? (
                <div>
                  {posts.length > 0 ? (
                    <div className="mt-5 mb-10 space-y-5">
                      {posts.map((post, i) => (
                        <Post key={i} post={post} myAccount={myAccount} />
                      ))}
                    </div>
                  ) : (
                    <EmptyPosts />
                  )}
                </div>
              ) : (
                <div>
                  {posts.length > 0 ? (
                    <div className="mt-5 mb-10 space-y-5">
                      {posts.map((post, i) => (
                        <Post key={i} post={post} myAccount={myAccount} />
                      ))}
                    </div>
                  ) : (
                    <div className="mt-5 text-lg font-bold">
                      No post Available!
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4">
              <div className="w-full rounded-lg bg-white p-4">
                <div className="flex items-center justify-between space-x-2">
                  <h2 className="text-lg font-bold">Friends</h2>

                  {profileAccount?.id === user?.uid && (
                    <Link href="/friends/requests">
                      <div className="cursor-pointer whitespace-nowrap rounded-lg px-3 py-1 text-blue-500 hover:bg-gray-100">
                        Friend Requests
                      </div>
                    </Link>
                  )}
                </div>

                <div className="h-60 overflow-x-hidden overflow-y-scroll scrollbar-hide">
                  {friends.length > 0 ? (
                    <div className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {friends.map((friend) => (
                        <Friend
                          key={friend.id}
                          friend={friend}
                          myAccount={myAccount}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="flex flex-col items-center">
                        <Image
                          src="/assets/empty.svg"
                          width={150}
                          height={150}
                          objectFit="contain"
                        />

                        <p className="text-lg font-bold">No new friends</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {formOpen && <AddPostModal myAccount={myAccount} />}
    </div>
  );
};

export default Profile;
