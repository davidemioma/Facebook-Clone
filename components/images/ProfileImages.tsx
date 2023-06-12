import React, { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { MdOutlineSave } from "react-icons/md";
import { XIcon } from "@heroicons/react/solid";
import { BsFillCameraFill } from "react-icons/bs";
import useAccountById from "@/hooks/useAccountById";
import useCurrentUser from "@/hooks/useCurrentUser";
import { updatePhotoUrl, uploadImage } from "../../utils/functions";

interface Props {
  accountId: string;
}

const ProfileImages = ({ accountId }: Props) => {
  const currentUser = useCurrentUser();

  const account = useAccountById(accountId);

  const [loading, setLoading] = useState(false);

  const filePickerRef = useRef<HTMLInputElement>(null);

  const [seletedFile, setSelectedFile] = useState<any>(null);

  const uploadProfileHandler = (e: React.FormEvent) => {
    uploadImage(e, setSelectedFile);
  };

  const updateProfileImage = () => {
    setLoading(true);

    updatePhotoUrl(currentUser?.id!, seletedFile)
      .then(() => {
        setSelectedFile(null);

        toast.success("cover image updated");
      })
      .catch((err) => {
        toast.error("Something went wrong");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="relative z-30 h-48 w-full border-b bg-white md:h-[120px]">
      <div className="absolute -top-1/2 left-1/2 flex -translate-x-1/2 flex-col items-center md:left-4 md:translate-x-0 md:flex-row md:items-end">
        <div className="relative h-40 w-40 rounded-full border-4 border-white bg-white">
          <img
            className="absolute top-0 h-full w-full rounded-full border object-cover"
            loading="lazy"
            src={account?.photoUrl || "/assets/no-profile.jpeg"}
            alt=""
          />

          {seletedFile && (
            <div className="absolute top-0 z-10 h-full w-full overflow-hidden rounded-full border">
              <Image className="object-cover" fill src={seletedFile} alt="" />
            </div>
          )}

          {seletedFile && (
            <div className="absolute z-30 flex h-full w-full items-center justify-center rounded-full bg-black/70 text-white">
              <div className="flex flex-col gap-3">
                <button
                  className="fileBtn"
                  disabled={loading}
                  onClick={updateProfileImage}
                >
                  <MdOutlineSave size={25} />
                </button>

                <button
                  className="fileBtn"
                  disabled={loading}
                  onClick={() => setSelectedFile(null)}
                >
                  <XIcon className="h-7" />
                </button>
              </div>
            </div>
          )}

          <input
            ref={filePickerRef}
            type="file"
            accept="image/*"
            hidden
            onChange={uploadProfileHandler}
          />

          {!seletedFile && (
            <>
              {account?.id === currentUser?.id && (
                <button
                  onClick={() =>
                    !seletedFile && filePickerRef?.current?.click()
                  }
                  className="absolute bottom-2 right-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200"
                >
                  <BsFillCameraFill size={20} />
                </button>
              )}
            </>
          )}
        </div>

        <div className="flex flex-col items-center space-y-2 md:flex-row md:items-center md:space-x-5 md:space-y-0">
          <div>
            <p className="whitespace-nowrap text-center text-3xl font-bold capitalize md:text-left">
              {account?.displayName}
            </p>

            {/* {friends.length > 0 && (
              <p className="text-center text-lg font-medium text-gray-500 md:text-left">
                {numberFormatter(friends.length)} friend
                {friends.length > 1 && "s"}
              </p>
            )} */}
          </div>

          {/* {profileAccount?.id !== user?.uid && (
            <div className="flex items-center space-x-2">
              <button
                onClick={sendRequestHandler}
                disabled={load}
                className={`${
                  hasAdded
                    ? "bg-gray-200 hover:bg-gray-300"
                    : "bg-blue-100 text-blue-500"
                } flex items-center space-x-2 rounded px-3 py-1 disabled:cursor-not-allowed`}
              >
                {hasAdded ? <FaUserCheck size={20} /> : <HiUserAdd size={20} />}

                <p>{hasAdded ? "Friend" : "Add Friend"}</p>
              </button>

              {hasAdded && (
                <button
                  disabled={load}
                  onClick={createChatHandler}
                  className="flex items-center space-x-2 rounded bg-blue-500 px-3 py-1 text-white disabled:cursor-not-allowed"
                >
                  <FaFacebookMessenger size={20} />

                  <p>Message</p>
                </button>
              )}
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default ProfileImages;
