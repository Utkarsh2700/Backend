import Sidebar from "@/components/Sidebar";
import { Video } from "@/types/types";
import { formatDistanceToNow } from "date-fns";
import { useLocation, useNavigate } from "react-router-dom";

type Props = {};

const SearchPage = (props: Props) => {
  const location = useLocation();
  const { searchResults, query } = location.state || {
    searchResults: [],
    query: "",
  };
  const navigate = useNavigate();

  console.log("searchResults", searchResults);

  //   function to show time since video is posted

  const formatTimeSincePosted = (createdAt: string) => {
    const date = new Date(createdAt);
    const difference = formatDistanceToNow(date, { addSuffix: false });
    return difference;
  };

  //   function to convert duration to hours:minutes:seconds format from seconds

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

  const handleClick = (videoId: string, username: string) => {
    navigate(`/video/watch/${videoId}/${username}`);
  };

  return (
    <div className="text-white flex min-h-screen">
      <div className="left overflow-y-auto sticky top-0 h-screen scrollbar-hidden w-58 flex-shrink-0">
        <Sidebar />
      </div>
      <div className="right ml-4 space-y-6">
        {searchResults.map((video: Video) => (
          <div
            className="flex space-x-4"
            key={video._id}
            onClick={() => handleClick(video._id, video.owner_details.username)}
          >
            <div className=" relative flex-shrink-0">
              <img
                className="h-[200px] w-[356px] rounded-xl cursor-pointer"
                src={video.thumbnail}
                alt=""
              />
              <span className="absolute bottom-[7%] right-[7%] bg-black opacity-80 py-1 px-3 rounded-lg text-sm">
                {/* + operator used to convert num to str */}
                {formatVideoDuration(+video.duration)}
              </span>
            </div>
            <div className="cursor-pointer">
              <h2 className="text-2xl">{video.title}</h2>
              <p className="text-gray-500 text-sm">
                {video.views} views • {formatTimeSincePosted(video.createdAt)}
              </p>
              <p className="flex text-wrap text-gray-500 text-xs">
                {video.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
