import React, { JSX } from "react";

type HeaderProps = {
  pageTitle: string;
  subTitle?: string;
  hasImage: boolean;
  isAnimated?: boolean;
  imgSrc?: string;
  animation?: JSX.Element;
  altImageAttribute?: string;
  pageSubtitle?: string;
  dataNftCount?: number;
  children: React.ReactNode;
};
export const HeaderComponent: React.FC<HeaderProps> = (props: HeaderProps) => {
  const { pageTitle, subTitle, isAnimated, hasImage, imgSrc, animation, altImageAttribute, pageSubtitle, dataNftCount, children } = props;
  return (
    <div className="flex justify-center py-4">
      <div className="flex flex-col w-full">
        <h1 className="py-4 mb-0">{pageTitle}</h1>
        {subTitle && <p className="mb-3">{subTitle}</p>}
        <div className={hasImage ? "-z-10 border-[0.5px] dark:border-slate-100/30 border-slate-300 rounded-[3rem]" : "hidden"}>
          {isAnimated && <>{animation}</>}
          <img className="rounded-[3rem] 3xl:h-[375px] w-full " src={imgSrc} alt={altImageAttribute} />
        </div>
        <div>
          {pageSubtitle && dataNftCount ? (
            <h4 className="my-4 text-center text-2xl">
              {pageSubtitle}: {dataNftCount}
            </h4>
          ) : (
            <></>
          )}
          <div className="flex flex-wrap base:flex-row flex-col justify-center md:justify-normal gap-x-20 ">{children}</div>
        </div>
      </div>
    </div>
  );
};
