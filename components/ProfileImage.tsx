import React, { useEffect, useRef, useState } from "react";
import {
  sendRequest,
  updatePhotoUrl,
  uploadImage,
  generateId,
  createChat,
} from "../utils/functions";
import { BsFillCameraFill } from "react-icons/bs";
import { MdOutlineSave } from "react-icons/md";
import { XIcon } from "@heroicons/react/solid";
import { FriendProps, User } from "../types";
import { auth, db } from "../firebase";
import { collection, onSnapshot } from "@firebase/firestore";
import { numberFormatter } from "../utils/functions";
import { useAuthState } from "react-firebase-hooks/auth";
import { HiUserAdd } from "react-icons/hi";
import { FaUserCheck, FaFacebookMessenger } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/router";

interface Props {
  myAccount: User | null;
  profileAccount: User | null;
}

const ProfileImage = ({ myAccount, profileAccount }: Props) => {
  const [user] = useAuthState(auth);

  const router = useRouter();

  const filePickerRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);

  const [myFriends, setMyFriends] = useState<FriendProps[]>([]);

  const [friends, setFriends] = useState<FriendProps[]>([]);

  const [hasAdded, setHasAdded] = useState(false);

  const [load, setLoad] = useState(false);

  const [seletedFile, setSelectedFile] = useState<
    string | ArrayBuffer | null | undefined
  >(null);

  const uploadProfileHandler = (e: React.FormEvent) => {
    uploadImage(e, setSelectedFile);
  };

  const updateProfileImage = async () => {
    setLoading(true);

    await updatePhotoUrl(`${myAccount?.id}`, `${seletedFile}`)
      .then(() => {
        setSelectedFile(null);

        setLoading(false);
      })
      .catch((err) => alert(err.message));
  };

  const sendRequestHandler = async () => {
    if (hasAdded) return;

    setLoad(true);

    profileAccount &&
      (await sendRequest(myAccount, profileAccount, uuidv4()).then(() =>
        setLoad(false)
      ));
  };

  const createChatHandler = async () => {
    const id = generateId(myAccount?.id, profileAccount?.id);

    setLoad(true);

    await createChat(myAccount, profileAccount, id).then(() => {
      setLoad(false);

      router.push(`/chats/${id}`);
    });
  };

  useEffect(
    () =>
      onSnapshot(
        collection(db, "users", `${user?.uid}`, "friends"),
        (snapshot) =>
          setMyFriends(
            snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
          )
      ),
    []
  );

  useEffect(
    () =>
      onSnapshot(
        collection(db, "users", `${profileAccount?.id}`, "friends"),
        (snapshot) =>
          setFriends(
            snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
          )
      ),
    [profileAccount]
  );

  useEffect(
    () =>
      setHasAdded(
        myFriends.findIndex(
          (friend) => friend.userId === profileAccount?.id
        ) !== -1
      ),
    [myFriends, profileAccount]
  );

  return (
    <div className="relative z-30 h-48 w-full border-b bg-white md:h-[120px]">
      <div className="absolute -top-1/2 left-1/2 flex -translate-x-1/2 flex-col items-center md:left-4 md:translate-x-0 md:flex-row md:items-end">
        <div className="relative h-40 w-40 rounded-full border-4 border-white bg-white">
          <img
            className="absolute top-0 h-full w-full rounded-full border object-cover"
            loading="lazy"
            src={profileAccount?.photoUrl || "/assets/no-profile.jpeg"}
            alt=""
          />

          {seletedFile && (
            <img
              className="absolute top-0 z-10 h-full w-full rounded-full border object-cover"
              loading="lazy"
              src={`${seletedFile}`}
              alt=""
            />
          )}

          {seletedFile && (
            <div className="absolute top-1/2 left-1/2 z-30 flex w-full -translate-x-1/2 -translate-y-1/2">
              <button
                className="fileBtn"
                disabled={loading}
                onClick={updateProfileImage}
              >
                <MdOutlineSave size={20} />
              </button>

              <button
                className="fileBtn"
                disabled={loading}
                onClick={() => setSelectedFile(null)}
              >
                <XIcon className="h-5" />
              </button>
            </div>
          )}

          <input
            ref={filePickerRef}
            type="file"
            accept="image/*"
            hidden
            onChange={uploadProfileHandler}
          />

          {profileAccount?.id === myAccount?.id && (
            <button
              onClick={() => !seletedFile && filePickerRef?.current?.click()}
              className="absolute bottom-2 right-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200"
            >
              <BsFillCameraFill size={20} />
            </button>
          )}
        </div>

        <div className="flex flex-col items-center space-y-2 md:flex-row md:items-center md:space-x-5 md:space-y-0">
          <div>
            <p className="whitespace-nowrap text-center text-3xl font-bold capitalize md:text-left">
              {profileAccount?.displayName}
            </p>

            {friends.length > 0 && (
              <p className="text-center text-lg font-medium text-gray-500 md:text-left">
                {numberFormatter(friends.length)} friend
                {friends.length > 1 && "s"}
              </p>
            )}
          </div>

          {profileAccount?.id !== user?.uid && (
            <div className="flex items-center space-x-2">
              <button
                onClick={sendRequestHandler}
                disabled={load}
                className={`${
                  hasAdded
                    ? "bg-gray-200 hover:bg-gray-300"
                    : "bg-blue-100 text-blue-500"
                } flex items-center space-x-2 rounded py-1 px-3 disabled:cursor-not-allowed`}
              >
                {hasAdded ? <FaUserCheck size={20} /> : <HiUserAdd size={20} />}

                <p>{hasAdded ? "Friend" : "Add Friend"}</p>
              </button>

              {hasAdded && (
                <button
                  disabled={load}
                  onClick={createChatHandler}
                  className="flex items-center space-x-2 rounded bg-blue-500 py-1 px-3 text-white disabled:cursor-not-allowed"
                >
                  <FaFacebookMessenger size={20} />

                  <p>Message</p>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileImage;
