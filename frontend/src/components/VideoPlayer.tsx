import { useRef, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

// interface VideoPlayerProps {
//   options: VideoJsPlayerOptions;
//   onReady?: (player: VideoJsPlayer.) => void;
//   videoRef: React.RefObject<HTMLDivElement>;
//   playerRef: React.MutableRefObject<VideoJsPlayer | null>;
// }

// : VideoPlayerProps

export const VideoPlayer = (props) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const { options, onReady } = props;

  useEffect(() => {
    if (!props.playerRef.current) {
      const videoElement = document.createElement("video-js");

      videoElement.classList.add("vjs-big-play-centered");
      props.videoRef.current?.appendChild(videoElement);

      const player = (props.playerRef.current = videojs(
        videoElement,
        options,
        () => {
          videojs.log("player is ready");
          onReady && onReady(player);
        }
      ));
    } else {
      const player = props.playerRef.current;

      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [options, videoRef]);

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = props.playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div
      className="rounded-lg sm:w-[600px] md:w-[750px] lg:w-[956px] "
      data-vjs-player
      // style={{ width: "600px" }}
    >
      <div className="rounded-lg" ref={videoRef} />
    </div>
  );
};

export default VideoPlayer;
