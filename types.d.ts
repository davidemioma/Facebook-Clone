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

export interface PostProps {
  id: string;
  userId: string;
  caption: string;
  timestamp: {
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
