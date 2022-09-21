import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "@firebase/firestore";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { db, storage } from "../firebase";
import { DummyPost, Fileprops, User } from "../types";

export const generateId = (id1: any, id2: any) =>
  id1 > id2 ? id1 + id2 : id2 + id1;

export const numberFormatter = (num: number) => {
  let newNumber = "";

  if (num >= 1000000000) {
    newNumber = (num / 1000000000).toFixed(1) + "B";
  } else if (num >= 1000000) {
    newNumber = (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    newNumber = (num / 1000).toFixed(1) + "K";
  } else {
    newNumber = `${num}`;
  }

  return newNumber;
};

const readFileContents = async (file: any) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
};

export const readAllFiles = async (files: any) => {
  const results = await Promise.all(
    files.map(async (file: any) => {
      const fileContents = await readFileContents(file);

      return {
        name: file.name,
        type: file.type,
        dataUrl: fileContents,
      };
    })
  );

  return results;
};

export const uploadPost = async (
  post: DummyPost,
  selectedFiles: Fileprops[]
) => {
  await addDoc(collection(db, "posts"), {
    ...post,
    timestamp: serverTimestamp(),
  }).then((docRef) => {
    if (selectedFiles.length > 0) {
      const postRef = ref(storage, `posts/${docRef?.id}/files`);

      selectedFiles.map(async (file) => {
        await uploadString(postRef, file.dataUrl, "data_url").then(
          async (snapshot) => {
            const downloadUrl = await getDownloadURL(postRef);

            await addDoc(collection(db, "posts", docRef?.id, "files"), {
              postContentUrl: downloadUrl,
              name: file.name,
              type: file.type,
            });
          }
        );
      });
    }
  });
};

export const likePost = async (
  hasLiked: boolean,
  postId: string,
  userId: string,
  firstname: string,
  surname: string
) => {
  if (hasLiked) {
    await deleteDoc(doc(db, "posts", postId, "likes", userId));
  } else {
    await setDoc(doc(db, "posts", postId, "likes", userId), {
      firstname,
      surname,
    });
  }
};

export const addComment = async (
  postId: string,
  userId: string,
  comment: string
) => {
  await addDoc(collection(db, "posts", postId, "comments"), {
    userId,
    comment,
    timestamp: serverTimestamp(),
  });
};

export const uploadImage = (e: React.FormEvent, setSelectedFile: any) => {
  const reader = new FileReader();

  const file = (e.target as HTMLFormElement).files?.[0];

  reader.readAsDataURL(file);

  reader.onload = (readerEvent) => {
    setSelectedFile(readerEvent.target?.result);
  };
};

export const updateCoverUrl = async (userId: string, selectedFile: string) => {
  const imageRef = ref(storage, `posts/${userId}/cover`);

  await uploadString(imageRef, selectedFile, "data_url").then(
    async (snapshot) => {
      const downloadUrl = await getDownloadURL(imageRef);

      await updateDoc(doc(db, "users", userId), {
        coverUrl: downloadUrl,
      });
    }
  );
};

export const updatePhotoUrl = async (userId: string, selectedFile: string) => {
  const imageRef = ref(storage, `posts/${userId}/profile`);

  await uploadString(imageRef, selectedFile, "data_url").then(
    async (snapshot) => {
      const downloadUrl = await getDownloadURL(imageRef);

      await updateDoc(doc(db, "users", userId), {
        photoUrl: downloadUrl,
      });
    }
  );
};

export const sendRequest = async (
  myAccount: User | null,
  userAccount: User,
  id: string
) => {
  await addDoc(collection(db, "users", userAccount.id, "notifications"), {
    requestId: myAccount?.id,
    task: "friend request",
    timstamp: serverTimestamp(),
  });

  await setDoc(doc(db, "users", userAccount?.id, "friend requests", id), {
    requestId: myAccount?.id,
    mail: myAccount?.mail,
    timstamp: serverTimestamp(),
  });

  await addDoc(collection(db, "users", `${myAccount?.id}`, "sent"), {
    mail: userAccount?.mail,
  });
};

export const answerFriendRequest = async (
  myAccount: User | null,
  userAccount: User,
  requestId: string,
  task: string
) => {
  if (task === "add") {
    await deleteDoc(
      doc(db, "users", `${myAccount?.id}`, "friend requests", requestId)
    );

    await addDoc(collection(db, "users", `${myAccount?.id}`, "friends"), {
      userId: userAccount.id,
      mail: userAccount.mail,
    });

    await addDoc(collection(db, "users", userAccount.id, "friends"), {
      userId: myAccount?.id,
      mail: myAccount?.mail,
    });
  } else {
    await deleteDoc(
      doc(db, "users", `${myAccount?.id}`, "friend requests", requestId)
    );
  }
};

export const createChat = async (
  myAccount: User | null,
  userAccount: User | null,
  id: string
) => {
  await setDoc(doc(db, "chats", id), {
    usersMatched: [myAccount?.id, userAccount?.id],
    timestamp: serverTimestamp(),
  });
};

export const sendMessage = async (
  chatId: string,
  userId: string,
  message: string
) => {
  await addDoc(collection(db, "chats", chatId, "messages"), {
    userId,
    message,
    timestamp: serverTimestamp(),
  });
};
