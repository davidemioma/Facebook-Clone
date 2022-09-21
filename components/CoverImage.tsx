import React, { useRef, useState } from "react";
import { updateCoverUrl, uploadImage } from "../utils/functions";
import { BsFillCameraFill } from "react-icons/bs";
import { RiEarthLine } from "react-icons/ri";
import { User } from "../types";

interface Props {
  myAccount: User | null;
  profileAccount: User | null;
}

const CoverImage = ({ myAccount, profileAccount }: Props) => {
  const [loading, setLoading] = useState(false);

  const [seletedFile, setSelectedFile] = useState<
    string | ArrayBuffer | null | undefined
  >(null);

  const filePickerRef = useRef<HTMLInputElement>(null);

  const uploadImageHandler = (e: React.FormEvent) => {
    uploadImage(e, setSelectedFile);
  };

  const updateCoverImage = async () => {
    setLoading(true);

    await updateCoverUrl(`${myAccount?.id}`, `${seletedFile}`)
      .then(() => {
        setSelectedFile(null);

        setLoading(false);
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className="relative h-40 w-full overflow-hidden rounded-b-lg bg-white bg-gradient-to-b from-gray-50 to-gray-300 sm:h-56 md:h-64 lg:h-96 lg:rounded-b-xl">
      {profileAccount?.coverUrl && (
        <img
          className="absolute top-0 mx-auto h-full w-full object-cover"
          loading="lazy"
          src={profileAccount?.coverUrl}
          alt=""
        />
      )}

      {seletedFile && (
        <img
          className="absolute top-0 z-10 h-full w-full object-cover"
          loading="lazy"
          src={`${seletedFile}`}
          alt=""
        />
      )}

      {seletedFile && (
        <div className="absolute top-0 z-30 flex w-full flex-col items-center space-y-2 bg-black/50 py-2 px-4 text-white sm:flex-row sm:justify-between sm:space-y-0">
          <div className="flex items-center space-x-1.5">
            <RiEarthLine />

            <p className="text-sm">Your cover photo is public.</p>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <button
              onClick={() => setSelectedFile(null)}
              className="rounded-lg bg-black/30 px-6 py-1.5"
            >
              Cancel
            </button>

            <button
              onClick={updateCoverImage}
              disabled={loading}
              className="rounded-lg bg-blue-500 px-6 py-1.5"
            >
              {loading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      )}

      <input
        ref={filePickerRef}
        type="file"
        accept="image/*"
        hidden
        onChange={uploadImageHandler}
      />

      {profileAccount?.id === myAccount?.id && (
        <button
          className="absolute bottom-4 right-4 z-20 flex items-center space-x-2 rounded bg-white px-3 py-1 transition-transform duration-300 hover:scale-105"
          onClick={() => !seletedFile && filePickerRef?.current?.click()}
        >
          <BsFillCameraFill size={20} />

          <p className="hidden sm:inline">Add cover photo</p>
        </button>
      )}
    </div>
  );
};

export default CoverImage;
