import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "@firebase/firestore";
import { db } from "../firebase";
import { User } from "../types";
import { SearchIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";

interface Props {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
}

const SearchBox = ({ searchTerm, setSearchTerm }: Props) => {
  const router = useRouter();

  const [allUsers, setAllUsers] = useState<User[]>([]);

  const [searchedUsers, setSearchedUsers] = useState<User[]>([]);

  useEffect(
    () =>
      onSnapshot(collection(db, "users"), (snapshot) =>
        setAllUsers(
          snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
        )
      ),
    []
  );

  useEffect(
    () =>
      setSearchedUsers(
        allUsers.filter((user) =>
          user.displayName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      ),
    [searchTerm]
  );

  return (
    <div className="mx-auto h-48 w-[90vw] max-w-md overflow-y-scroll rounded-lg bg-white p-1 shadow-md scrollbar-hide">
      {searchedUsers?.map((user, i) => (
        <div
          key={i}
          onClick={() =>
            router.push(`/profile/${user.id}`).then(() => setSearchTerm(""))
          }
          className="flex cursor-pointer items-center space-x-2 rounded-lg py-2 px-3 hover:bg-gray-100"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <SearchIcon className="h-5 text-blue-500" />
          </div>

          <p>{user.displayName}</p>
        </div>
      ))}
    </div>
  );
};

export default SearchBox;
