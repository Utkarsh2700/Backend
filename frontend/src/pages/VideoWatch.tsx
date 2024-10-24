import Sidebar from "@/components/Sidebar";
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import { baseUrl } from "@/constants";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "@/hooks/use-toast";
import VideoPlayer from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { format, formatDistanceToNow } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ThumbsUp } from "lucide-react";

type videoDetailsProps = {};

const VideoWatch = () => {
  // const { videoId } = useParams();
  const { username, videoId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [videoDetails, setVideoDetails] = useState();
  const [userDetails, setUserDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState();
  const [load, setLoad] = useState(false);
  const [isSubs, setIsSubs] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentLoad, setCommentLoad] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem("token");
  const playerRef = useRef(null);
  // const videoLink =
  //   "http://localhost:8000/public/temp/90592924-89d7-4688-8a2a-fc4e7902d5c3/output.m3u8";

  useEffect(() => {
    getUserProfile();
  }, [isSubs, username]);

  useEffect(() => {
    if (userProfile) {
      setIsSubs(userProfile.isSubscribed);
    }
  }, [userProfile]);

  const getVideoById = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/videos/${videoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response);

      // if (response.status === 200) {
      setVideoDetails(response.data.data);
      // }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: "Failed",
        description: errorMessage || "CNV",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const getUserDetails = async () => {
    setLoading(true);
    if (!token) return;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/dashboard/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("UserDetails", response.data.data);
      setUserDetails(response.data.data);
    } catch (error) {
      toast({
        title: "Failed",
        description: error.message,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const getUserProfile = async () => {
    setLoad(true);
    if (!token) return;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/users/c/${username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("UserProfile", response.data.data);
      setUserProfile(response.data.data);
    } catch (error) {
      toast({
        title: "Failed",
        description: error.message,
        variant: "destructive",
      });
    }
    setLoad(false);
  };

  const subscribeChannel = async () => {
    try {
      const response = await axios.post(
        `
        ${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/subscriptions/c/${userProfile?._id}?subscribed=${isSubs}
        `,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("subscribeChannel", response.data);

      if (response.status === 200) {
        setIsSubs((prev) => !prev);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: "Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const getVideoComments = async () => {
    setCommentLoad(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/comments/${videoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("All comments", response);

      if (response.status === 200) {
        setComments(response.data.data);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: "Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const formSchema = z.object({
    comment: z.string().min(2, {
      message: "Comment must be atleast 2 characters",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });

  const handleCommentSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    console.log("data", data);
    const commentContent = {};
    commentContent.content = data.comment;

    console.log("comment", commentContent);

    try {
      // const formData = new FormData();
      // formData.append("content", data.comment);
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/comments/${videoId}`,
        commentContent,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("commented", response.data);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: "Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };
  useEffect(() => {
    getVideoById();
    getUserDetails();
    getVideoComments();
  }, [videoId]);

  const videoPlayerOptions = {
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: videoDetails?.videoFile,
        // src: videoLink,
        type: "application/x-mpegURL",
      },
    ],
  };
  console.log("videoDetails", videoDetails);

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };

  const formatTimeSincePosted = (createdAt: string) => {
    const date = new Date(createdAt);
    const difference = formatDistanceToNow(date, {
      addSuffix: true,
    });
    return difference;
  };

  return (
    !isLoading &&
    !loading &&
    !load && (
      <div className="flex min-h-screen w-full">
        <div className="overflow-y-auto sticky top-0 h-screen scrollbar-hidden w-58">
          {/* VideoWatch */}
          <Sidebar />
        </div>
        {videoDetails && (
          <div className="">
            <VideoPlayer
              options={videoPlayerOptions}
              onReady={handlePlayerReady}
            />
            <div className="flex items-center">
              <p className="text-white my-4">{videoDetails?.title}</p>
              <ThumbsUp className="text-white ml-16 cursor-pointer" size={18} />
            </div>
            <div className="nameImage flex text-white space-x-4 my-4">
              <img
                className="w-10 h-10 rounded-full"
                src={userDetails[0]?.avatar}
                alt=""
              />
              <div className="subs-col">
                <h3>{userDetails[0]?.username}</h3>
                <h3 className="text-gray-500 text-xs">
                  {userDetails[0]?.subscribers_details} subscribers
                </h3>
              </div>
              <Button
                variant={"mybtn"}
                className={`my-2 mx-4 rounded-3xl transition-colors ${
                  isSubs
                    ? "bg-gray-700 text-white hover:bg-neutral-900"
                    : " bg-red-600 hover:bg-red-700 "
                }`}
                onClick={() => subscribeChannel()}
              >
                {isSubs ? "Unsubscribe" : "Subscribe"}
              </Button>
            </div>
            <div className="bg-gray-500 text-white rounded-lg sm:w-[600px] md:w-[750px] lg:w-[956px] ">
              <div className="flex space-x-2">
                <p className="ml-2">{videoDetails.views} views</p>
                <p>
                  {format(new Date(videoDetails?.createdAt), "MMM dd, yyyy")}
                </p>
              </div>
              <div>
                <p className="ml-2">{videoDetails.description}</p>
              </div>
            </div>
            <hr className="border-gray-800 mt-4" />
            <div className="comments my-8">
              <h1 className="font-bold text-2xl text-white">
                {comments.length} Comments
              </h1>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleCommentSubmit)}
                className="space-y-8 text-white"
              >
                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel></FormLabel>
                      <FormControl className="flex items-center">
                        <span>
                          <img
                            src={userDetails[0].avatar}
                            className="w-10 h-10 rounded-full mr-2"
                            alt=""
                          />
                          <Input placeholder="Add a comment ..." {...field} />
                        </span>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit">Comment</Button>
              </form>
            </Form>
            {comments.map((comment, index) => (
              <div className="text-white flex items-center" key={comment._id}>
                <div className="mr-2">
                  <img
                    src={comment.user_details.avatar}
                    className="w-10 h-10 rounded-full"
                  />
                </div>
                <div className="flex-col">
                  <div className="flex space-x-2 items-center">
                    <h3>@{comment.user_details.username}</h3>
                    <p className="text-gray-500 text-xs">
                      {formatTimeSincePosted(comment.createdAt)}
                    </p>
                  </div>
                  <p>{comment.content}</p>
                  {/* <p>{comment._id}</p> */}
                  <ThumbsUp className="cursor-pointer" size={18} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  );
};

export default VideoWatch;

// export const comments = () => {
//   return (
//     <div>
//       <h1>All Comments</h1>
//     </div>
//   );
// };
