import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { formatDistanceToNow } from "date-fns";

// fixing the dataformat for the API data

interface OwnerDetails {
  _id: string;
  username: string;
  fullName: string;
  avatar: string;
}

interface Video {
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

const VideoItem = ({
  _id,
  videoFile,
  thumbnail,
  title,
  duration,
  views,
  isPublished,
  createdAt,
  owner_details,
}: Video) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  //to handle vidoe Autoplay on hover
  useEffect(() => {
    if (videoRef.current === null) return;
    if (isVideoPlaying) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }, [isVideoPlaying]);

  //   function to handle date using date-fns(showing the days since video has been uploaded)
  const formatTimeSincePosted = (createdAt: string) => {
    const date = new Date(createdAt);
    const difference = formatDistanceToNow(date, { addSuffix: true });
    return difference;
  };

  //   converting the time from seconds to youtube time format
  const formatVideoDuration = (videoLength: number) => {
    const hours = Math.floor(videoLength / 3600);
    const minutes = Math.floor((videoLength % 3600) / 60);
    const seconds = Math.floor(videoLength % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
    // Otherwise, return H:MM:SS
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    isPublished && (
      <div
        className="flex flex-col gap-2"
        onMouseEnter={() => setIsVideoPlaying(true)}
        onMouseLeave={() => setIsVideoPlaying(false)}
      >
        <Link
          to={`/video/watch/${_id}/${owner_details.username}`}
          className="relative aspect-video"
        >
          <img
            src={thumbnail}
            className={`block w-full h-full object-cover transition-[border-radius] duration-200 ${
              isVideoPlaying ? "rounded-none" : "rounded-xl"
            }`}
            alt={title}
          />
          {/* +operator is also used to convert sting to number */}
          <div className="absolute bottom-1 right-1  px-2 rounded-md bg-[#000000]/50 text-white">
            {formatVideoDuration(+duration)}
          </div>
          <video
            className={`block h-full object-cover absolute inset-0 transition-opacity duration-200 ${
              isVideoPlaying ? "opacity-100 delay-200" : "opacity-0"
            }`}
            ref={videoRef}
            muted
            playsInline
            src={videoFile}
          />
        </Link>
        <div className="flex gap-2">
          <Link to={`/@/${owner_details.username}`} className="flex-shrink-0">
            <img
              className="w-12 h-12 rounded-full"
              src={owner_details.avatar}
              alt={owner_details.username}
            />
          </Link>
          <div className="flex flex-col">
            <Link to={"#"} className="font-bold text-white">
              {title}
            </Link>
            <Link to={"#"} className=" text-gray-400 ">
              {owner_details.username}
            </Link>
            <div className=" text-gray-400 flex items-center">
              <p className="views text-sm ">{` ${views} views`}</p>
              <p className="mx-1">•</p>
              <p className="posted-time text-sm ml-1">
                {formatTimeSincePosted(createdAt)}
              </p>
            </div>
          </div>
        </div>
        ;
      </div>
    )
  );
};

export default VideoItem;
