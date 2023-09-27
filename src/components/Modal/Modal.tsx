import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "libComponents/Dialog";
import { cn } from "libs/utils";

type ModalProps = {
  openTrigger: JSX.Element;
  modalClassName?: React.HTMLAttributes<HTMLDivElement>;
  titleClassName?: string;
  title?: string;
  descriptionClassName?: string;
  description?: string;
  closeOnOverlayClick?: boolean; //when false it prevents the closing of the modal when clicking outside the modal
  children?: JSX.Element;
};
//NOTE : To activate the Dialog component from within a Context Menu or Dropdown Menu, you must encase the Context Menu or Dropdown Menu component in the Dialog component.
export const Modal: React.FC<ModalProps> = (props) => {
  const { openTrigger, modalClassName, titleClassName, title, descriptionClassName, description, closeOnOverlayClick, children } = props;
  return (
    <Dialog>
      <DialogTrigger asChild>{openTrigger}</DialogTrigger>
      <DialogContent
        className={cn("overflow-y-scroll overflow-x-hidden scrollbar max-w-[80%] max-h-[79dvh] !pt-0 rounded-xl border-foreground", modalClassName)}
        onPointerDownOutside={(e) => !closeOnOverlayClick && e.preventDefault()}>
        <DialogHeader className="text-left sticky-top flex flex-row justify-between backdrop-blur bg-background/60 w-full">
          {title ? <DialogTitle className={titleClassName}>{title}</DialogTitle> : <></>}
          {description ? <DialogDescription className={descriptionClassName}>{description}</DialogDescription> : <></>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
