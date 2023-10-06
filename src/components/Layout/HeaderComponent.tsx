import React from "react";
import disk  from "assets/img/nf-tunes-logo-disk.png";
import stick from "assets/img/nf-tunes-logo-stick.png";
 

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
        <div className={hasImage ? "z-[-1] border-[0.5px] dark:border-slate-100/30 border-slate-300 rounded-[3rem]" : "hidden"}>
        {pageTitle === "NF-Tunes" &&
           <div className="relative  top-[15%]">
             < img 
                className="animate-spin-slow w-[20%] left-[40%] max-w-[300px] absolute "
                src={disk} 
                alt="disk"
               
            /><img className="rotate-[20deg] absolute top-[-10px] md:top-[-15px] max-w-[200px] left-[52%] 3xl:left-[50%] w-[15%] " src={stick} alt="stick"/>

            </div>
          }
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
