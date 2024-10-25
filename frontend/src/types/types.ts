export interface OwnerDetails {
  _id: string;
  username: string;
  fullName?: string;
  avatar: string;
  email?: string;
  coverImage?: string;
  createdAt?: string;
  updatedAt?: string;
  watchHistory?: [];
}

export interface Video {
  _id: string;
  videoFile: string;
  thumbnail: string;
  title: string;
  description: string;
  duration: string;
  views: number;
  isPublished: boolean;
  owner: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  owner_details: OwnerDetails;
}

export interface Videos {
  createdAt: string;
  description: string;
  duration: number;
  isPublished: boolean;
  owner: string;
  thumbnail: string;
  title: string;
  updatedAt: string;
  videoFile: string;
  views: string;
}

export interface UserProfile {
  allVideos: Videos[];
  avatar: string;
  channelsSubscribedToCount: number;
  coverImage: string;
  email: string;
  fullname: string;
  isSubscribed: boolean;
  subscriberCount: number;
  username: string;
  _id: string;
}

export interface VideoDetails {
  views: string;
}

export interface User {
  avatar: string;
  coverImage: string;
  email: string;
  fullName: string;
  subscribers_details: number;
  totalVideos: number;
  username: string;
  video_details: VideoDetails;
  _id: string;
}

export interface Comments {
  _id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  owner: string;
  video: string;
  //   length:number,
  user_details: OwnerDetails;
}

// export interface AllComments {
//   data: Comments[];
//   user_details: OwnerDetails;
//   length: number;
// }

export type CommentResponse = Comments[];

export interface VideoById {
  createdAt: string;
  description: string;
  duration: number;
  isPublished: boolean;
  owner: string;
  owner_details: OwnerDetails;
  segments: [];
  thumbnail: string;
  title: string;
  updatedAt: string;
  videoFile: string;
  views: string;
  _id: string;
}
