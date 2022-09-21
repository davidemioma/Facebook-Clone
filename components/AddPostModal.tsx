import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setFormOpen } from "../store/store";
import { readAllFiles, uploadPost } from "../utils/functions";
import { XIcon, EmojiHappyIcon } from "@heroicons/react/outline";
import { MdAddToPhotos } from "react-icons/md";
import { Fileprops, User } from "../types";

interface Props {
  myAccount: User | null;
}

const AddPostModal = ({ myAccount }: Props) => {
  const dispatch = useDispatch();

  const filePickerRef = useRef<HTMLInputElement>(null);

  const [useImage, setUseImage] = useState(true);

  const [caption, setCaption] = useState("");

  const [seletedFiles, setSeletedFiles] = useState<Fileprops[] | any>([]);

  const [loading, setIsLoading] = useState(false);

  const uploadFiles = (e: any) => {
    let AllFiles: any = [];

    [...e.target?.files].map((file) => AllFiles.push(file));

    readAllFiles(AllFiles)
      .then((result) => {
        setSeletedFiles(result);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const uploadPostHandler = async () => {
    setIsLoading(true);

    const post = {
      userId: `${myAccount?.id}`,
      caption,
    };

    await uploadPost(post, seletedFiles).then(() => {
      setIsLoading(false);

      setSeletedFiles([]);

      setCaption("");

      dispatch(setFormOpen(false));
    });
  };

  return (
    <>
      <div
        onClick={() => dispatch(setFormOpen(false))}
        className="fixed top-0 z-40 h-screen w-screen overflow-hidden bg-white/50"
      />

      <div className="absolute top-1/2 left-1/2 z-50 mx-auto w-11/12 max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-xl">
        <div className="relative flex h-14 items-center border-b">
          <h1 className="absolute left-1/2 -translate-x-1/2 text-center text-lg font-semibold">
            Create post
          </h1>

          <button
            onClick={() => dispatch(setFormOpen(false))}
            className="absolute right-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex items-center space-x-2 px-4 py-2">
          <img
            className="h-8 w-8 rounded-full object-cover sm:h-10 sm:w-10"
            src={
              myAccount?.photoUrl
                ? myAccount?.photoUrl
                : "https://www.instagram.com/static/images/anonymousUser.jpg/23e7b3b2a737.jpg"
            }
            alt=""
          />

          <p className="text-sm font-medium capitalize sm:text-base">
            {myAccount?.displayName}
          </p>
        </div>

        <div className="flex w-full items-center space-x-3 px-4 pb-5">
          <input
            className="flex-1 outline-none"
            value={caption}
            type="text"
            placeholder={`What's on your mind, ${myAccount?.firstname}?`}
            onChange={(e) => setCaption(e.target.value)}
          />

          <EmojiHappyIcon className="h-7 text-gray-400" />
        </div>

        {useImage && (
          <div className="mx-4 h-48 rounded-lg border border-gray-300 p-2">
            {seletedFiles?.length > 0 ? (
              <div className="h-full w-full overflow-hidden rounded-lg">
                {seletedFiles?.[0]?.type.includes("video") ? (
                  <video
                    className="h-full w-full object-cover"
                    src={seletedFiles?.[0]?.dataUrl}
                    loop
                    controls
                  />
                ) : (
                  <img
                    className="h-full w-full object-cover"
                    src={seletedFiles?.[0]?.dataUrl}
                    alt=""
                  />
                )}
              </div>
            ) : (
              <div className="relative h-full w-full rounded-lg bg-gray-100 hover:bg-gray-200">
                <button
                  className="absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white hover:bg-gray-200"
                  onClick={() => setUseImage(false)}
                >
                  <XIcon className="h-5" />
                </button>

                <div
                  onClick={() => filePickerRef?.current?.click()}
                  className="absolute top-0 left-0 z-10 h-full w-full cursor-pointer"
                />

                <div className="absolute top-1/2 left-1/2 flex -translate-y-1/2 -translate-x-1/2 flex-col items-center text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                    <MdAddToPhotos size={20} />
                  </div>

                  <h1 className="whitespace-nowrap text-lg font-medium">
                    Add photos/videos
                  </h1>

                  <p className="text-xs font-light">or drag and drop</p>
                </div>

                <input
                  ref={filePickerRef}
                  type="file"
                  accept="image/*, video/*"
                  multiple
                  hidden
                  onChange={uploadFiles}
                />
              </div>
            )}
          </div>
        )}

        <button
          onClick={uploadPostHandler}
          disabled={!caption.trim() || !seletedFiles || loading}
          className="my-5 mx-4 flex w-[calc(100%-32px)] items-center justify-center rounded-lg bg-blue-500 py-1.5 text-white disabled:cursor-not-allowed"
        >
          {loading ? <div className="loader" /> : <p>Post</p>}
        </button>
      </div>
    </>
  );
};

export default AddPostModal;
