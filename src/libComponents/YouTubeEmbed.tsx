import React from "react";

const YouTubeEmbed = ({ embedId, title }: { embedId: string; title: string }) => {
  return (
    <iframe
      className="h-full w-full"
      src={`https://www.youtube.com/embed/${embedId}?controls=1&playsinline=1&color=white&autoplay=0`}
      title={title}
      frameborder="0"
      allowfullscreen="allowfullscreen"
      mozallowfullscreen="mozallowfullscreen"
      msallowfullscreen="msallowfullscreen"
      oallowfullscreen="oallowfullscreen"
      webkitallowfullscreen="webkitallowfullscreen"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
  );
};

export default YouTubeEmbed;
