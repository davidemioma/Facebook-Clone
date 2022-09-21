import React, { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "../firebase";
import { CommentProps, Likeprops, PostFiles, PostProps, User } from "../types";
import Moment from "react-moment";
import { collection, doc, onSnapshot } from "@firebase/firestore";
import {
  EmojiHappyIcon,
  ThumbUpIcon,
  ChatAlt2Icon,
} from "@heroicons/react/outline";
import {
  ThumbUpIcon as ThumbsUpSolid,
  HeartIcon,
} from "@heroicons/react/solid";
import Carousel from "./Carousel";
import { numberFormatter, addComment, likePost } from "../utils/functions";
import Comment from "./Comment";

interface Props {
  post: PostProps;
  myAccount: User | null;
}

const Post = ({ post, myAccount }: Props) => {
  const [user, setUser] = useState<User>();

  const [files, setFiles] = useState<PostFiles[]>([]);

  const [showCommentForm, setShowCommentForm] = useState(true);

  const [likes, setLikes] = useState<Likeprops[]>([]);

  const [hasLiked, setHasLiked] = useState(false);

  const [comment, setComment] = useState("");

  const [comments, setComments] = useState<CommentProps[]>([]);

  const addCommentHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!comment.trim()) return;

    await addComment(post.id, `${myAccount?.id}`, comment)
      .then(() => setComment(""))
      .catch((err) => alert(err.message));
  };

  useEffect(
    () =>
      onSnapshot(doc(db, "users", post.userId), (snapshot: any) =>
        setUser({ id: snapshot.id, ...snapshot.data() })
      ),
    []
  );

  useEffect(
    () =>
      onSnapshot(collection(db, "posts", post?.id, "files"), (snapshot) =>
        setFiles(
          snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
        )
      ),
    []
  );

  useEffect(
    () =>
      onSnapshot(collection(db, "posts", post.id, "likes"), (snapshot) =>
        setLikes(
          snapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data(),
          }))
        )
      ),
    []
  );

  useEffect(
    () =>
      onSnapshot(collection(db, "posts", post.id, "comments"), (snapshot) =>
        setComments(
          snapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data(),
          }))
        )
      ),
    []
  );

  useEffect(
    () =>
      setHasLiked(likes?.findIndex((like) => like.id === myAccount?.id) !== -1),
    [likes]
  );

  return (
    <div className="space-y-2 rounded-lg bg-white py-2">
      <Link href={`/profile/${user?.id}`}>
        <div className="flex cursor-pointer items-center space-x-2 px-4">
          <img
            className="h-10 w-10 rounded-full object-cover"
            loading="lazy"
            src={user?.photoUrl ? user?.photoUrl : "/assets/no-profile.jpeg"}
            alt=""
          />

          <div>
            <p className="text-sm font-medium capitalize sm:text-base">
              {user?.displayName}
            </p>

            <p className="text-xs tracking-wide text-gray-500">
              <Moment
                fromNow
                date={new Date(post.timestamp.seconds * 1000).toUTCString()}
              />
            </p>
          </div>
        </div>
      </Link>

      <p className="px-4 text-sm font-light leading-6 line-clamp-2">
        {post.caption}
      </p>

      <Carousel files={files} />

      <div className="flex items-center justify-between font-light">
        {likes.length > 0 && (
          <div className="flex items-center space-x-1.5 py-2 pl-4">
            <div className="flex items-center">
              <span className="icon bg-blue-500 ">
                <ThumbsUpSolid className="h-3" />
              </span>

              <span className="icon -ml-1 bg-red-500">
                <HeartIcon className="h-3" />
              </span>
            </div>

            <p>{numberFormatter(likes.length)}</p>
          </div>
        )}

        {comments.length > 0 && (
          <p className="py-2 pr-4">
            {numberFormatter(comments.length)} comment
            {comments.length > 1 && "s"}
          </p>
        )}
      </div>

      <div className="mx-4 grid grid-cols-2 gap-2 border-b border-t border-gray-300 py-2">
        <button
          onClick={() =>
            likePost(
              hasLiked,
              post.id,
              `${myAccount?.id}`,
              `${myAccount?.firstname}`,
              `${myAccount?.surname}`
            )
          }
          className="flex items-center justify-center space-x-2 rounded hover:bg-gray-100"
        >
          {hasLiked ? (
            <ThumbsUpSolid className="h-7 text-blue-500" />
          ) : (
            <ThumbUpIcon className="h-7" />
          )}

          <p>Like</p>
        </button>

        <button
          onClick={() => setShowCommentForm((prev) => !prev)}
          className="flex items-center justify-center space-x-2 rounded hover:bg-gray-100"
        >
          <ChatAlt2Icon className="h-7" />

          <p>Comment</p>
        </button>
      </div>

      {comments.length > 0 && (
        <div className="max-h-60 space-y-2 overflow-x-hidden overflow-y-scroll px-4 py-2 scrollbar-hide">
          {comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </div>
      )}

      {showCommentForm && (
        <div className="flex items-center space-x-2 px-4">
          <img
            className="h-9 w-9 rounded-full object-cover"
            loading="lazy"
            src={
              myAccount?.photoUrl
                ? myAccount?.photoUrl
                : "/assets/no-profile.jpeg"
            }
            alt=""
          />

          <form
            onSubmit={addCommentHandler}
            className="flex flex-1 items-center space-x-3 rounded-full bg-gray-100 px-4 py-1.5"
          >
            <input
              className="flex-1 bg-transparent text-sm outline-none"
              value={comment}
              type="text"
              placeholder="Write a comment..."
              onChange={(e) => setComment(e.target.value)}
            />

            <EmojiHappyIcon className="h-5" />
          </form>
        </div>
      )}
    </div>
  );
};

export default Post;
