export interface MessageProps {
  id: string;
  userId: string;
  message: string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
}

export interface ChatProps {
  id: string;
  usersMatched: string[];
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
}

export interface PostProps {
  id: string;
  userId: string;
  caption: string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
}

export interface FriendProps {
  id: string;
  userId: string;
  mail: string;
}

export interface RequestProps {
  id: string;
  requestId: string;
  mail: string;
  timstamp: {
    seconds: number;
    nanoseconds: number;
  };
}

export interface NotificationProps {
  id: string;
  requestId: string;
  task: string;
  timstamp: {
    seconds: number;
    nanoseconds: number;
  };
}

export interface PostFiles {
  id: string;
  name: string;
  type: string;
  postContentUrl: string;
}

export interface Likeprops {
  id: string;
  firstname: string;
  surname: string;
  photoUrl: string;
}

export interface CommentProps {
  id: string;
  userId: string;
  comment: string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
}

export interface FormProps {
  email: string;
  password: string;
  firstname?: string;
  surname?: string;
}

export interface User {
  id: string;
  displayName: string;
  firstname: string;
  mail: string;
  photoUrl: string | null;
  coverUrl: string;
  surname: string;
}

export interface Fileprops {
  name: string;
  type: string;
  dataUrl: string;
}

export interface DummyPost {
  userId: string;
  caption: string;
}
