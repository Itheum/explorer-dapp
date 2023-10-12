import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "libComponents/Dialog";
import { cn } from "libs/utils";
import { Filter, IFilterData } from "libComponents/Filter";

type ModalProps = {
  openTrigger: JSX.Element;
  modalClassName?: React.HTMLAttributes<HTMLDivElement>;
  titleClassName?: string;
  title?: string;
  descriptionClassName?: string;
  description?: string;
  closeOnOverlayClick?: boolean; //when false it prevents the closing of the modal when clicking outside the modal
  hasFilter?: boolean;
  filterData?: Array<IFilterData>;
  children?: JSX.Element;
};

//NOTE : To activate the Dialog component from within a Context Menu or Dropdown Menu, you must encase the Context Menu or Dropdown Menu component in the Dialog component.
export const Modal: React.FC<ModalProps> = (props) => {
  const { openTrigger, modalClassName, titleClassName, title, descriptionClassName, description, closeOnOverlayClick, hasFilter, filterData, children } = props;
  return (
    <Dialog>
      <DialogTrigger asChild>{openTrigger}</DialogTrigger>
      <DialogContent
        className={cn("overflow-y-auto overflow-x-hidden  max-w-[80%] min-h-[40%] max-h-[85%] !pt-0 rounded-xl border-foreground", modalClassName)}
        onPointerDownOutside={(e) => !closeOnOverlayClick && e.preventDefault()}>
        <DialogHeader className="text-left sticky-top flex flex-row justify-between items-center backdrop-blur bg-background/60 w-full border-b border-foreground max-h-[20dvh]">
          <div className="flex flex-col">
            {title ? <DialogTitle className={titleClassName}>{title}</DialogTitle> : <></>}
            {description ? <DialogDescription className={descriptionClassName}>{description}</DialogDescription> : <></>}
          </div>
          {hasFilter ? <Filter filterData={filterData ?? []} /> : <></>}
          <div></div>
        </DialogHeader>
        <div className="overflow-x-hidden scrollbar max-h-[70dvh]">{children}</div>
      </DialogContent>
    </Dialog>
  );
};
