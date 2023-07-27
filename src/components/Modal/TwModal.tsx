import React, {Fragment} from "react";

import {Dialog, Transition} from "@headlessui/react";

type ModalProps = {
  content: any;
  setContent: any,
  title?: string;
}
const TwModal: React.FC<ModalProps> = (props) => {
  const {content, setContent, title} = props;
  console.log(content);
  const handleIframeClick = (e: React.MouseEvent<HTMLIFrameElement, MouseEvent>) => {
    e.stopPropagation(); // Prevent the click event from propagating to the outer modal
  };

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation(); // Prevent the click event from propagating to the document
  };
  const close = () => setContent(null);

  return (
    <>
      <Transition appear show={!!content} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 "
          onClose={close}
        >
          <div className="min-h-screen px-4 text-center font-pixel" onClick={handleModalClick}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed pointer-events-none inset-0 backdrop-blur"/>
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div
                className="inline-block w-full max-w-6xl max-h-[90dvh] p-6 my-8 text-left align-middle transition-all transform shadow-xl rounded-lg bg-black" onClick={handleIframeClick}>
                {title ?
                <Dialog.Title
                  as="h3"
                  className="text-lg text-center font-medium leading-6 text-gray-300 rounded-lg shadow-white py-1.5 pb-2"
                >
                  {title}
                </Dialog.Title>
                  :
                  <></>
                }
                <div className="mt-4 overflow-y-scroll text-slate-300 scrollbar max-h-[75dvh]">{content}</div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-500 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                    onClick={close}
                  >
                    Close
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
export default TwModal;