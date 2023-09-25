import React, { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "libComponents/Dialog";
import { cn } from "libs/utils";
import { Filter } from "libComponents/Filter";

type ModalProps = {
  openTrigger: JSX.Element;
  modalClassName?: React.HTMLAttributes<HTMLDivElement>;
  titleClassName?: string;
  title?: string;
  descriptionClassName?: string;
  description?: string;
  hasFilter?: boolean;
  filterData?: Array<string>;
  children?: JSX.Element;
};

//NOTE : To activate the Dialog component from within a Context Menu or Dropdown Menu, you must encase the Context Menu or Dropdown Menu component in the Dialog component.
export const Modal: React.FC<ModalProps> = (props) => {
  const { openTrigger, modalClassName, titleClassName, title, descriptionClassName, description, hasFilter, filterData, children } = props;
  const internalFilterData: Array<string> = useMemo(() => filterData ?? [], [filterData]);

  return (
    <Dialog>
      <DialogTrigger asChild>{openTrigger}</DialogTrigger>
      <DialogContent
        className={cn("overflow-y-scroll overflow-x-hidden scrollbar max-w-[80%] max-h-[79dvh] !pt-0 rounded-xl border-foreground", modalClassName)}>
        <DialogHeader className="text-left sticky-top flex flex-row justify-between items-center backdrop-blur bg-background/60 w-full border-b border-foreground">
          <div className="flex flex-col">
            {title ? <DialogTitle className={titleClassName}>{title}</DialogTitle> : <></>}
            {description ? <DialogDescription className={descriptionClassName}>{description}</DialogDescription> : <></>}
          </div>
          {hasFilter ? <Filter filterData={internalFilterData ?? []} /> : <></>}
          <div></div>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
