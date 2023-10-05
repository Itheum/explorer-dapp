import React from "react";

type HeaderProps = {
  pageTitle: string;
  hasImage: boolean;
  imgSrc?: string;
  altImageAttribute?: string;
  pageSubtitle?: string;
  dataNftCount?: number;
  children: React.ReactNode;
};
export const HeaderComponent: React.FC<HeaderProps> = (props: HeaderProps) => {
  const { pageTitle, hasImage, imgSrc, altImageAttribute, pageSubtitle, dataNftCount, children } = props;
  return (
    <div className="flex justify-center py-4">
      <div className="flex flex-col w-full">
        <h1 className="py-4 mb-0">{pageTitle}</h1>
        <div className={hasImage ? "border-[0.5px] dark:border-slate-100/30 border-slate-300 rounded-[3rem]" : "hidden"}>
          <img className="rounded-[3rem] w-full 2xl:h-[375px]" src={imgSrc} alt={altImageAttribute} />
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
