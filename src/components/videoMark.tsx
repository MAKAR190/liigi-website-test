"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { rowdies } from "@/fonts";

const YOUTUBE_API_KEY = "AIzaSyBDfkCYyDhM52rbql7FjAWcOfw8AJctAZ0"; 

const VideoMark = ({ url }: { url: string }) => {
  const [duration, setDuration] = useState<string>("");

  useEffect(() => {
    const fetchDuration = async () => {
      try {
        if (isYouTubeUrl(url)) {
          const videoId = extractYouTubeVideoId(url);
          if (videoId) {
            const videoDuration = await getYouTubeVideoDuration(videoId);
            setDuration(videoDuration);
          }
        } else {
          const video = document.createElement("video");
          video.src = url;
          video.addEventListener("loadedmetadata", () => {
            const durationInSeconds = Math.round(video.duration);
            const minutes = Math.floor(durationInSeconds / 60);
            const seconds = durationInSeconds % 60;
            const formattedDuration = `${minutes}:${seconds
              .toString()
              .padStart(2, "0")}`;
            setDuration(formattedDuration);
          });

          return () => {
            video.removeEventListener("loadedmetadata", () => {});
          };
        }
      } catch (error) {
        console.error("Error fetching video duration:", error);
        setDuration("Error");
      }
    };

    fetchDuration();
  }, [url]);

  const isYouTubeUrl = (url: string) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  const extractYouTubeVideoId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|watch\?v=|watch\?.+?&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const getYouTubeVideoDuration = async (videoId: string) => {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${YOUTUBE_API_KEY}`
    );
    const data = await response.json();
    if (data.items.length > 0) {
      const duration = data.items[0].contentDetails.duration;
      return formatYouTubeDuration(duration);
    }
    return "0:00";
  };

  const formatYouTubeDuration = (duration: string) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) {
      return "0:00";
    }

    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;

    const totalMinutes = hours * 60 + minutes;
    return `${totalMinutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center justify-around w-[6%] min-w-[75px] p-0.5 absolute bottom-0 left-0 rounded-tr-[4px] bg-primary">
      <Image
        src={"/play-small-icon.svg"}
        alt={"play-icon"}
        width={30}
        height={30}
      />
      <p className={`text-md pr-1 text-white ${rowdies.className}`}>
        {duration || "..."}
      </p>
    </div>
  );
};

export default VideoMark;
