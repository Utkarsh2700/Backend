import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type userProfileProps = {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  coverImage: string;
  subscriberCount: number;
  channelsSubscribedToCount: number;
  isSubscribed: boolean;
  allVideos: string[];
};

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState<userProfileProps>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubs, setIsSubs] = useState(false);
  let { username } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    getUserChannelProfile();
  }, [isSubs, username]);

  useEffect(() => {
    if (userProfile) {
      setIsSubs(userProfile.isSubscribed);
    }
  }, [userProfile]);

  const getUserChannelProfile = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/users/c/${username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserProfile(response.data.data);

      toast({
        title: "Success",
        description: response.data.message,
        variant: "success",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: "Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };
  const subscribeChannel = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/subscriptions/c/${
          userProfile?._id
        }?subscribed=${isSubs}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast({
          title: "Success",
          description: response.data.message,
          variant: "success",
        });
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

  return (
    !isLoading && (
      <div className="dark:bg-black dark:text-white min-h-screen text-white flex w-full">
        <div className="h-screen overflow-y-auto sticky top-0 scrollbar-hidden w-[250px] flex-shrink-0">
          <Sidebar />
        </div>
        <div className="space-y-6 w-full">
          <div
            className="firstCoverImage w-full"
            onClick={() => {
              if (localStorage.getItem("userId") === userProfile?._id) {
                navigate(`/channel/${userProfile?._id}/editing/profile`);
              }
            }}
          >
            <div className="flex justify-end w-full cursor-pointer">
              <img
                src={userProfile?.coverImage}
                className="w-full h-[250px] rounded-xl mr-6"
                alt=""
              />
            </div>
          </div>
          <div className="secondDetails flex space-x-6">
            <div
              className="avatar"
              onClick={() => {
                if (localStorage.getItem("userId") === userProfile?._id) {
                  navigate(`/channel/${userProfile._id}/editing/profile`);
                }
              }}
            >
              <img
                src={userProfile?.avatar}
                className="h-32 w-32 rounded-full cursor-pointer"
                alt={userProfile?.fullName}
              />
            </div>
            <div className="details space-y-3">
              <h1 className="text-white font-bold text-5xl">
                {userProfile?.fullName}
              </h1>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg">{userProfile?.username}</h3>
                <h3>• {userProfile?.subscriberCount} subscribers</h3>
                {userProfile?.allVideos !== undefined &&
                  userProfile?.allVideos.length > 0 && (
                    <h3>• {userProfile?.allVideos.length} Videos</h3>
                  )}
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
          </div>
          <hr className="border-gray-800" />
          <div className="thirdTabs bg-black">
            <Tabs defaultValue="account" className="bg-black">
              <TabsList className="grid grid-cols-6 w-full bg-black">
                <TabsTrigger value="Home" color="#DC493A" className="">
                  Home
                </TabsTrigger>
                <TabsTrigger value="Videos" className="">
                  Videos
                </TabsTrigger>
                <TabsTrigger value="Shorts" className="">
                  Shorts
                </TabsTrigger>
                <TabsTrigger value="Live" className="">
                  Live
                </TabsTrigger>
                <TabsTrigger value="Playlist" className="">
                  Playlist
                </TabsTrigger>
                <TabsTrigger value="Community" className="">
                  Community
                </TabsTrigger>
              </TabsList>
              <TabsContent value="Home">
                <div>
                  This tab contains all the playlist of user as heading and then
                  the videos are show inside
                </div>
              </TabsContent>
              <TabsContent value="Videos">
                <div>
                  Contains all the videos posted by user and three buttons to
                  sort the videos based on latest oldest and most viewed
                </div>
              </TabsContent>
              <TabsContent value="Shorts">
                <div>This feature will be added soon.</div>
              </TabsContent>
              <TabsContent value="Live">
                <div>This feature will be added soon.</div>
              </TabsContent>
              <TabsContent value="Playlist">
                <div>
                  This tab contains all the playlist created by the channel.
                </div>
              </TabsContent>
              <TabsContent value="Community">
                <div>
                  This tab contains all the tweets posted by user by the
                  channel.
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    )
  );
};

export default UserProfile;
