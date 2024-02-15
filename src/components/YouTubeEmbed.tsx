import React from "react";

const YouTubeEmbed = ({ embedId, title }: { embedId: string; title: string }) => {
  return (
    <iframe
      className="h-full w-full"
      src={`https://www.youtube.com/embed/${embedId}?controls=1&playsinline=1&color=white&autoplay=0`}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"></iframe>
  );
};

export default YouTubeEmbed;
