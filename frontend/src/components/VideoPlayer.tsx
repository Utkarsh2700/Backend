// FIRST
// import { useRef, useEffect } from "react";
// import videojs from "video.js";
// import "video.js/dist/video-js.css";

// // interface VideoPlayerProps {
// //   options: VideoJsPlayerOptions;
// //   onReady?: (player: VideoJsPlayer.) => void;
// //   videoRef: React.RefObject<HTMLDivElement>;
// //   playerRef: React.MutableRefObject<VideoJsPlayer | null>;
// // }

// // : VideoPlayerProps

// export const VideoPlayer = (props: any) => {
//   const videoRef = useRef(null);
//   const playerRef = useRef(null);
//   const { options, onReady } = props;

//   useEffect(() => {
//     if (!props.playerRef.current) {
//       const videoElement = document.createElement("video-js");

//       videoElement.classList.add("vjs-big-play-centered");
//       props.videoRef.current?.appendChild(videoElement);

//       const player = (props.playerRef.current = videojs(
//         videoElement,
//         options,
//         () => {
//           videojs.log("player is ready");
//           onReady && onReady(player);
//         }
//       ));
//     } else {
//       const player = props.playerRef.current;

//       player.autoplay(options.autoplay);
//       player.src(options.sources);
//     }
//   }, [options, videoRef]);

//   // Dispose the Video.js player when the functional component unmounts
//   useEffect(() => {
//     const player = props.playerRef.current;

//     return () => {
//       if (player && !player.isDisposed()) {
//         player.dispose();
//         playerRef.current = null;
//       }
//     };
//   }, [playerRef]);

//   return (
//     <div
//       className="rounded-lg sm:w-[600px] md:w-[750px] lg:w-[956px] "
//       data-vjs-player
//       // style={{ width: "600px" }}
//     >
//       <div className="rounded-lg" ref={videoRef} />
//     </div>
//   );
// };

// export default VideoPlayer;

// SECOND

// import { useRef, useEffect } from "react";
// import videojs from "video.js";
// import { VideoJsPlayer } from "video.js";
// import "video.js/dist/video-js.css";

// export const VideoPlayer = (props: any) => {
//   const videoRef = useRef<HTMLDivElement | null>(null);
//   const playerRef = useRef<VideoJsPlayer | null>(null);
//   const { options, onReady } = props;

//   useEffect(() => {
//     // Make sure the video element is available and has been added to the DOM
//     if (videoRef.current && !playerRef.current) {
//       const videoElement = document.createElement("video-js");
//       videoElement.classList.add("vjs-big-play-centered");
//       videoRef.current.appendChild(videoElement);

//       // Initialize the player
//       const player = (playerRef.current = videojs(videoElement, options, () => {
//         videojs.log("player is ready");
//         onReady && onReady(player);
//       }));
//     } else if (playerRef.current) {
//       // Update player options if player already exists
//       playerRef.current.autoplay(options.autoplay);
//       playerRef.current.src(options.sources);
//     }
//   }, [options]);

//   // Dispose the Video.js player when the component unmounts
//   useEffect(() => {
//     return () => {
//       if (playerRef.current) {
//         playerRef.current.dispose();
//         playerRef.current = null;
//       }
//     };
//   }, []);

//   return (
//     <div
//       className="rounded-lg sm:w-[600px] md:w-[750px] lg:w-[956px]"
//       data-vjs-player
//     >
//       <div className="rounded-lg" ref={videoRef} />
//     </div>
//   );
// };

// export default VideoPlayer;

// THIRD

import { useRef, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import Player from "video.js/dist/types/player";

export const VideoPlayer = (props: any) => {
  const videoRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<Player | null>(null); // Use videojs.Player here
  const { options, onReady } = props;

  useEffect(() => {
    // Make sure the video element is available and has been added to the DOM
    if (videoRef.current && !playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);

      // Initialize the player
      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log("player is ready");
        onReady && onReady(player);
      }));
    } else if (playerRef.current) {
      // Update player options if player already exists
      playerRef.current.autoplay(options.autoplay);
      playerRef.current.src(options.sources);
    }
  }, [options]);

  // Dispose the Video.js player when the component unmounts
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div
      className="rounded-lg sm:w-[600px] md:w-[750px] lg:w-[956px]"
      data-vjs-player
    >
      <div className="rounded-lg" ref={videoRef} />
    </div>
  );
};

export default VideoPlayer;

// FOURTH

// import { useRef, useEffect } from "react";
// import videojs from "video.js";
// import "video.js/dist/video-js.css";

// export const VideoPlayer = (props: any) => {
//   const videoRef = useRef<HTMLDivElement | null>(null);
//   const playerRef = useRef<videojs.Player | null>(null); // Use videojs.Player here
//   const { options, onReady } = props;

//   useEffect(() => {
//     // Make sure the video element is available and has been added to the DOM
//     if (videoRef.current && !playerRef.current) {
//       const videoElement = document.createElement("video-js");
//       videoElement.classList.add("vjs-big-play-centered");
//       videoRef.current.appendChild(videoElement);

//       // Initialize the player
//       const player = (playerRef.current = videojs(videoElement, options, () => {
//         videojs.log("player is ready");
//         onReady && onReady(player);
//       }));
//     } else if (playerRef.current) {
//       // Update player options if player already exists
//       playerRef.current.autoplay(options.autoplay);
//       playerRef.current.src(options.sources);
//     }
//   }, [options]);

//   // Dispose the Video.js player when the component unmounts
//   useEffect(() => {
//     return () => {
//       if (playerRef.current) {
//         playerRef.current.dispose();
//         playerRef.current = null;
//       }
//     };
//   }, []);

//   return (
//     <div
//       className="rounded-lg sm:w-[600px] md:w-[750px] lg:w-[956px]"
//       data-vjs-player
//     >
//       <div className="rounded-lg" ref={videoRef} />
//     </div>
//   );
// };

// export default VideoPlayer;

// FIFTH

// import React from 'react';
// import videojs from 'video.js';
// import 'video.js/dist/video-js.css';

// export const VideoPlayer = ({props}) => {
//   const videoRef = React.useRef(null);
//   const playerRef = React.useRef(null);
//   const {options, onReady} = props;

//   React.useEffect(() => {

//     // Make sure Video.js player is only initialized once
//     if (!playerRef.current) {
//       // The Video.js player needs to be inside the component el for React 18 Strict Mode.
//       const videoElement = document.createElement("video-js");

//       videoElement.classList.add('vjs-big-play-centered');
//       videoRef.current.appendChild(videoElement);

//       const player = playerRef.current = videojs(videoElement, options, () => {
//         videojs.log('player is ready');
//         onReady && onReady(player);
//       });

//     // You could update an existing player in the else block here
//     // on prop change, for example:
//     } else {
//       const player = playerRef.current;

//       player.autoplay(options.autoplay);
//       player.src(options.sources);
//     }
//   }, [options, videoRef]);

//   // Dispose the Video.js player when the functional component unmounts
//   React.useEffect(() => {
//     const player = playerRef.current;

//     return () => {
//       if (player && !player.isDisposed()) {
//         player.dispose();
//         playerRef.current = null;
//       }
//     };
//   }, [playerRef]);

//   return (
//     <div data-vjs-player>
//       <div ref={videoRef} />
//     </div>
//   );
// }

// export default VideoPlayer;
