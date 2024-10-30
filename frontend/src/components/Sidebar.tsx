import {
  ChevronDown,
  ChevronUp,
  CircleHelp,
  Clapperboard,
  Clock,
  Film,
  Flag,
  Flame,
  Gamepad2,
  History,
  Home,
  Library,
  Lightbulb,
  MessageSquareWarning,
  Music2,
  Newspaper,
  PlaySquare,
  Podcast,
  Radio,
  Repeat,
  Settings,
  Shirt,
  ShoppingBag,
  Trophy,
} from "lucide-react";
import React, { ElementType, ReactNode, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSidebarContext } from "@/contexts/SidebarContext";
import { PageHeaderFirstSection } from "./Header";
import { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import api from "@/utils/axiosInterceptor";

type userDetails = {
  _id: string;
  username: string;
  fullname: string;
  avatar: string;
};

type subscribeChannelsProps = {
  channel: string;
  createdAt: string;
  updatedAt: string;
  subscriber: string;
  user_details: userDetails;
  _id: string;
};

const Sidebar = () => {
  const { isLargeOpen, isSmallOpen, close } = useSidebarContext();
  const [isLoading, setIsLoading] = useState(false);
  const [subscribeChannels, setSubscribedChannels] = useState<
    subscribeChannelsProps[]
  >([]);

  const encryptedUserId: string = localStorage.getItem("userId") ?? "";
  // console.log("encryptedUserId", encryptedUserId);
  const userId: string = atob(encryptedUserId);
  // console.log("decryptedUserId", userId);

  // const token = localStorage.getItem("token");
  const encryptedtoken: string = localStorage.getItem("token") ?? "";
  let token: string = atob(encryptedtoken);
  // console.log("decryptedToken", token);

  useEffect(() => {
    getSubscribedChannels();
  }, []);
  const getSubscribedChannels = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(
        `${
          import.meta.env.VITE_REACT_APP_BACKEND_BASEURL
        }/subscriptions/c/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setSubscribedChannels(response.data.data);
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
    setIsLoading(false);
  };
  return (
    <>
      <aside
        className={`sticky top-0 overflow-y-auto scrollbar-hidden p-4 flex flex-col ml-1 ${
          isLargeOpen ? "lg:hidden" : "lg:flex"
        }`}
      >
        <SmallSidebarItem
          IconOrImgUrl={Home}
          title="Home"
          url="/videos"
        ></SmallSidebarItem>
        <SmallSidebarItem
          IconOrImgUrl={Repeat}
          title="Shorts"
          url="/"
        ></SmallSidebarItem>
        <SmallSidebarItem
          IconOrImgUrl={Clapperboard}
          title="Subscriptons"
          url="/videos"
        ></SmallSidebarItem>
        <SmallSidebarItem
          IconOrImgUrl={Library}
          title="Library"
          url="/videos"
        ></SmallSidebarItem>
      </aside>
      {isSmallOpen && (
        <div
          onClick={close}
          className="lg:hidden fixed inset-0 z-[999] bg-black opacity-50 "
        />
      )}
      <aside
        className={`w-56 lg:sticky absolute top-0 overflow-y-auto scrollbar-hidden pb-4 flex-col gap-2 px-2 ${
          isLargeOpen ? "lg:flex" : "lg:hidden"
        } ${isSmallOpen ? "flex z-[999] bg-black max-h-screen" : "hidden"}`}
      >
        <div className="lg:hidden pt-2 pb-4 px-2 sticky top-0 bg-black">
          <PageHeaderFirstSection />
        </div>
        <LargeSidebarSection>
          <LargeSidebarItem
            isActive
            IconOrImgUrl={Home}
            title="Home"
            url="/videos"
          />
          <LargeSidebarItem
            IconOrImgUrl={Clapperboard}
            title="Subscriptions"
            url="/videos"
          />
        </LargeSidebarSection>
        <hr className=" border-gray-800" />
        <LargeSidebarSection>
          <LargeSidebarItem
            IconOrImgUrl={Library}
            title="Library"
            url="/library"
          />
          <LargeSidebarItem
            IconOrImgUrl={History}
            title="History"
            url="/history"
          />
          <LargeSidebarItem
            IconOrImgUrl={PlaySquare}
            title="Your Videos"
            url="/your-videos"
          />
          <LargeSidebarItem
            IconOrImgUrl={Clock}
            title="Watch Later"
            url="/playlist?list=WL"
          />
          {/* {playlists.map((playlist) => (
            <LargeSidebarItem
              key={playlist.id}
              IconOrImgUrl={ListVideo}
              title={playlist.name}
              url={`/playlist?list=${playlist.id}`}
            />
          ))} */}
        </LargeSidebarSection>
        <hr className=" border-gray-800" />
        <LargeSidebarSection title="Subscriptions">
          {!isLoading &&
            subscribeChannels.map((subscription) => (
              // <Link to={`/@/${subscription.user_details.username}`}>
              <LargeSidebarItem
                key={subscription._id}
                IconOrImgUrl={subscription.user_details.avatar}
                title={subscription.user_details.username}
                url={`/@/${subscription.user_details.username}`}
              />
              // </Link>
            ))}
        </LargeSidebarSection>
        <hr className=" border-gray-800" />
        <LargeSidebarSection title="Explore">
          <LargeSidebarItem
            IconOrImgUrl={Flame}
            title="Trending"
            url="/trending"
          />
          <LargeSidebarItem
            IconOrImgUrl={ShoppingBag}
            title="Shopping"
            url="/shopping"
          />
          <LargeSidebarItem IconOrImgUrl={Music2} title="Music" url="/music" />
          <LargeSidebarItem
            IconOrImgUrl={Film}
            title="Movies & TV"
            url="/movies-tv"
          />
          <LargeSidebarItem IconOrImgUrl={Radio} title="Live" url="/live" />
          <LargeSidebarItem
            IconOrImgUrl={Gamepad2}
            title="Gaming"
            url="/gaming"
          />
          <LargeSidebarItem IconOrImgUrl={Newspaper} title="News" url="/news" />
          <LargeSidebarItem
            IconOrImgUrl={Trophy}
            title="Sports"
            url="/sports"
          />
          <LargeSidebarItem
            IconOrImgUrl={Lightbulb}
            title="Learning"
            url="/learning"
          />
          <LargeSidebarItem
            IconOrImgUrl={Shirt}
            title="Fashion & Beauty"
            url="/fashion-beauty"
          />
          <LargeSidebarItem
            IconOrImgUrl={Podcast}
            title="Podcasts"
            url="/podcasts"
          />
        </LargeSidebarSection>
        <hr className="border-gray-800" />
        <LargeSidebarSection>
          <LargeSidebarItem
            IconOrImgUrl={Settings}
            title="Settings"
            url="/videos"
          />
          <LargeSidebarItem
            IconOrImgUrl={Flag}
            title="Repeat history"
            url="/videos"
          />
          <LargeSidebarItem
            IconOrImgUrl={CircleHelp}
            title="Help"
            url="/videos"
          />
          <LargeSidebarItem
            IconOrImgUrl={MessageSquareWarning}
            title="Feedback"
            url="/videos"
          />
          <LargeSidebarItem
            IconOrImgUrl={Settings}
            title="Settings"
            url="/videos"
          />
        </LargeSidebarSection>
      </aside>
    </>
  );
};

export default Sidebar;

type SmallSidebarItemProps = {
  IconOrImgUrl: ElementType;
  title: string;
  url: string;
};

function SmallSidebarItem({ IconOrImgUrl, title, url }: SmallSidebarItemProps) {
  return (
    <Link
      to={url}
      className="text-white py-4 px-1 flex flex-col items-center rounded-lg gap-1"
    >
      <IconOrImgUrl className="h-6 w-6" />
      <div className="text-sm">{title}</div>
    </Link>
  );
}
type LargeSidebarSectionProps = {
  children: ReactNode;
  title?: string;
  visibleItemCount?: number;
};

function LargeSidebarSection({
  children,
  title,
  visibleItemCount = Number.POSITIVE_INFINITY,
}: LargeSidebarSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const childrenArray = React.Children.toArray(children).flat();
  const showExpandedButton = childrenArray.length > visibleItemCount;
  const visibleChildren = isExpanded
    ? childrenArray
    : childrenArray.slice(0, visibleItemCount);
  const ButtonIcon = isExpanded ? ChevronUp : ChevronDown;
  return (
    <div>
      {title && (
        <div className="ml-4 mt-2 text-lg mb-1 text-white">{title}</div>
      )}
      {visibleChildren}
      {showExpandedButton && (
        <button
          //   variant="ghost"
          className="w-full items-center flex rounded-lg gap-4 p-3 text-white "
          onClick={() => setIsExpanded((e) => !e)}
        >
          <ButtonIcon className="w-6 h-6 text-white" />
          <div className="text-white">
            {isExpanded ? "Show Less" : "Show More"}
          </div>
        </button>
      )}
    </div>
  );
}

type LargeSidebarItemProps = {
  IconOrImgUrl: ElementType | string;
  title: string;
  url: string;
  isActive?: boolean;
};

function LargeSidebarItem({
  IconOrImgUrl,
  title,
  url,
  isActive = false,
}: LargeSidebarItemProps) {
  return (
    <Link
      to={url}
      className={`w-full items-center flex rounded-lg gap-4 p-3 text-white ${
        isActive ? "font-bold bg-neutral-800" : "null"
      } hover:bg-slate-900`}
    >
      {typeof IconOrImgUrl === "string" ? (
        <img src={IconOrImgUrl} className="w-6 h-6 rounded-full" alt="" />
      ) : (
        <IconOrImgUrl className="w-6 h-6" />
      )}
      <div className="whitespace-nowrap overflow-hidden text-ellipsis">
        {title}
      </div>
    </Link>
  );
}
