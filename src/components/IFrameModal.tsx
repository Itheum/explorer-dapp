import React from "react";

type Props = {
  link: string | undefined;
};

export const IFrameModal: React.FC<Props> = (props: any) => {
  const { link } = props;
  const handleIframeClick = (e: React.MouseEvent<HTMLIFrameElement, MouseEvent>) => {
    e.stopPropagation(); // Prevent the click event from propagating to the outer modal
  };

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation(); // Prevent the click event from propagating to the document
  };

  return (
    <>
      <div className="bg-white p-8 rounded shadow-lg" onClick={handleModalClick}>
        <iframe title="Modal Content" src={link} className="w-full h-[85dvh]" onClick={handleIframeClick} />
      </div>
    </>
  );
};
