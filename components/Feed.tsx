import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { PostProps, User } from "../types";
import { collection, onSnapshot, orderBy, query } from "@firebase/firestore";
import { db } from "../firebase";
import Post from "./Post";
import Box from "./Box";
import EmptyPosts from "./EmptyPosts";
import People from "./People";

interface Props {
  myAccount: User | null;
}

const Feed = ({ myAccount }: Props) => {
  const [posts, setPosts] = useState<PostProps[]>([]);

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "posts"), orderBy("timestamp", "desc")),
        (snapshot) =>
          setPosts(
            snapshot.docs.map((doc: any) => ({
              id: doc.id,
              ...doc.data(),
            }))
          )
      ),
    []
  );

  return (
    <div className="flex-1 overflow-hidden px-3 pb-10 sm:px-8">
      <div className="mx-auto w-full max-w-xl">
        <Box myAccount={myAccount} />

        <People myAccount={myAccount} />

        {posts.length > 0 ? (
          <div className="mt-5 space-y-5">
            {posts?.map((post) => (
              <Post key={post.id} post={post} myAccount={myAccount} />
            ))}
          </div>
        ) : (
          <EmptyPosts />
        )}
      </div>
    </div>
  );
};

export default Feed;
