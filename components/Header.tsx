import React, { useEffect, useState } from "react";
import Image from "next/image";
import { SearchIcon } from "@heroicons/react/outline";
import { RiNotification2Fill } from "react-icons/ri";
import { FaFacebookMessenger } from "react-icons/fa";
import IconBtn from "./IconBtn";
import Notifications from "./Notifications";
import Options from "./Options";
import { NotificationProps, User } from "../types";
import { useDispatch, useSelector } from "react-redux";
import { notificationSelector, profileSelector } from "../store/ui-slice";
import { setNotificationOpen, setProfileOpen } from "../store/store";
import { useRouter } from "next/router";
import { collection, onSnapshot, query, where } from "@firebase/firestore";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import SearchBox from "./SearchBox";

interface Props {
  myAccount: User | null;
  hideMessage?: boolean;
}

const Header = ({ myAccount, hideMessage }: Props) => {
  const router = useRouter();

  const [user] = useAuthState(auth);

  const dispatch = useDispatch();

  const profileOpen = useSelector(profileSelector);

  const notificationOpen = useSelector(notificationSelector);

  const [notications, setNotications] = useState<NotificationProps[]>([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [firstChatId, setFirstChatId] = useState("");

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "users", `${user?.uid}`, "notifications")),
        (snapshot) =>
          setNotications(
            snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
          )
      ),
    []
  );

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "chats"),
          where("usersMatched", "array-contains", user?.uid)
        ),
        (snapshot) => setFirstChatId(snapshot.docs?.[0]?.id)
      ),
    []
  );

  return (
    <>
      <header
        className={`sticky ${
          router.asPath !== "/" ? "z-50" : "z-30"
        } top-0 flex h-12 w-screen items-center space-x-2 border-b border-gray-300 bg-white px-6`}
      >
        <Image
          className="cursor-pointer"
          onClick={() => router.push("/")}
          src="/assets/facebook-logo.svg"
          width={135}
          height={130}
          objectFit="contain"
        />

        <div className="flex-1">
          <div className="mx-auto flex max-w-lg items-center space-x-2 rounded-full bg-gray-100 py-1.5 px-3">
            <SearchIcon className="h-4 text-gray-500" />

            <input
              className="flex-1 bg-transparent text-sm outline-none md:text-base"
              value={searchTerm}
              type="text"
              placeholder="Search Facebook"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="hidden items-center space-x-3 sm:inline-flex">
          {!hideMessage && (
            <IconBtn
              Icon={FaFacebookMessenger}
              text="Messenger"
              active={false}
              onClick={() =>
                firstChatId && router.push(`/chats/${firstChatId}`)
              }
            />
          )}

          <div className="relative">
            <IconBtn
              Icon={RiNotification2Fill}
              text="Notification"
              active={notificationOpen}
              onClick={() => dispatch(setNotificationOpen(!notificationOpen))}
            />

            {notificationOpen && (
              <div
                className={`absolute right-0 ${
                  router.asPath !== "/" ? "z-40" : "z-20"
                } mt-2`}
              >
                <Notifications notifications={notications} />
              </div>
            )}
          </div>

          {myAccount && (
            <div className="relative">
              <IconBtn
                imgSrc={
                  myAccount.photoUrl
                    ? myAccount.photoUrl
                    : "https://www.instagram.com/static/images/anonymousUser.jpg/23e7b3b2a737.jpg"
                }
                text="Account"
                active={profileOpen}
                onClick={() => dispatch(setProfileOpen(!profileOpen))}
              />

              {profileOpen && (
                <div
                  className={`absolute right-0 ${
                    router.asPath !== "/" ? "z-40" : "z-20"
                  } mt-2`}
                >
                  <Options myAccount={myAccount} />
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <div
        className={`fixed top-14 flex w-screen justify-center ${
          router.asPath !== "/" ? "z-40" : "z-20"
        }`}
      >
        {searchTerm.trim() && (
          <SearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        )}
      </div>
    </>
  );
};

export default Header;
