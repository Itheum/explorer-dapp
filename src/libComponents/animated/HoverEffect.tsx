import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "libs/utils";
import { PlayCircle, Search } from "lucide-react";

export const HoverEffect = ({
  items,
  className,
  viewData,
}: {
  items: {
    title?: string;
    description?: string;
    image?: string;
    ownedDataNftIndex?: number;
    link?: string;
  }[];
  className?: string;
  viewData: (index: number) => void;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3  py-10", className)}>
      {items.map((item, idx) => (
        <div key={idx} className="relative group  block p-2 h-full w-full" onMouseEnter={() => setHoveredIndex(idx)} onMouseLeave={() => setHoveredIndex(null)}>
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-teal-950/[0.6] block  rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            <div className="relative flex justify-center items-center group">
              <img src={item.image} className="group-hover:scale-110 transition-all duration-500  rounded-2xl" />
              {item.ownedDataNftIndex && item.ownedDataNftIndex >= 0 ? (
                <PlayCircle
                  onClick={() => viewData(item.ownedDataNftIndex ?? 0)}
                  className="absolute z-[100] text-teal-900 fill-black/80 w-16 h-0 hover:cursor-pointer group-hover:h-16 transition-all duration-500"
                />
              ) : (
                <Link
                  to={"https://nft.ici.ro/ethereal-echoes"}
                  target="_blank"
                  className="hover:scale-125 transition-all bottom-0 right-0 gap-1 absolute bg-teal-900/80 rounded-2xl px-2 flex flex-row">
                  Find <Search className="w-4" />
                </Link>
              )}
            </div>
            <CardTitle>{item.title}</CardTitle>
            {item.description && <CardDescription>{item.description}</CardDescription>}
          </Card>
        </div>
      ))}
    </div>
  );
};

export const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return (
    <div className={cn("rounded-2xl h-full w-full p-4 overflow-hidden border border-teal-900/[0.5] group-hover:border-teal-900 relative z-20", className)}>
      <div className="relative z-50">
        <div className=" ">{children}</div>
      </div>
    </div>
  );
};

export const CardTitle = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return <h4 className={cn("!text-base font-semibold	text-foreground tracking-wide mt-4", className)}>{children}</h4>;
};

export const CardDescription = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return <p className={cn("mt-8 text-zinc-400 tracking-wide leading-relaxed text-sm", className)}>{children}</p>;
};
