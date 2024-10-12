import React, { JSX } from "react";

type HeaderProps = {
  pageTitle: string;
  subTitle?: string;
  hasImage: boolean;
  hasVideo?: boolean;
  isAnimated?: boolean;
  imgSrc?: string;
  videoSrc?: string;
  animation?: JSX.Element;
  altImageAttribute?: string;
  pageSubtitle?: string;
  headerImgStyle?: string;
  dataNftCount?: number;
  alwaysCenterTitleAndSubTitle?: boolean;
  alwaysLeftAlignBodyContentOnMD?: boolean;
  children: React.ReactNode;
};
export const HeaderComponent: React.FC<HeaderProps> = (props: HeaderProps) => {
  const {
    pageTitle,
    subTitle,
    isAnimated,
    hasImage,
    hasVideo,
    imgSrc,
    videoSrc,
    animation,
    altImageAttribute,
    pageSubtitle,
    headerImgStyle,
    dataNftCount,
    alwaysCenterTitleAndSubTitle,
    alwaysLeftAlignBodyContentOnMD,
    children,
  } = props;
  return (
    <div className="flex justify-center py-4">
      <div className="flex flex-col w-full">
        <h1 className={`p-0 mb-3 text-center ${alwaysCenterTitleAndSubTitle ? "md:text-center" : "md:text-left"}`}>{pageTitle}</h1>
        {subTitle && <p className={`mb-3 text-center ${alwaysCenterTitleAndSubTitle ? "md:text-center" : "md:text-left"}`}>{subTitle}</p>}

        <div
          className={
            hasImage
              ? "-z-10 border-[0.5px] dark:border-slate-100/30 border-slate-300 rounded-[3rem]"
              : hasVideo
                ? "-z-10 border-[0.5px] dark:border-slate-100/30 border-slate-300 rounded-[3rem]"
                : "hidden"
          }>
          {isAnimated && <>{animation}</>}
          {hasImage ? (
            <img
              className={headerImgStyle ? "rounded-[3rem] 3xl:h-[375px] w-full " + headerImgStyle : "rounded-[3rem] 3xl:h-[375px] w-full"}
              src={imgSrc}
              alt={altImageAttribute}
            />
          ) : (
            <video src={videoSrc} className="rounded-[3rem] 3xl:h-[375px] w-full" autoPlay loop />
          )}
        </div>

        <div>
          {pageSubtitle ? (
            <h4 className={`my-5 !text-xl text-center ${alwaysCenterTitleAndSubTitle ? "md:text-center" : "md:text-left"}`}>
              {pageSubtitle} {dataNftCount && `: ${dataNftCount}`}
            </h4>
          ) : (
            <></>
          )}
          <div
            className={`flex flex-wrap base:flex-row flex-col justify-center ${alwaysLeftAlignBodyContentOnMD ? "md:justify-start" : "md:justify-around"} gap-x-8`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
