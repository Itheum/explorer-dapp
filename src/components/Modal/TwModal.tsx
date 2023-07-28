import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

type ModalProps = {
  isModalOpen: boolean;
  content: React.ReactElement;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function MyModal(props: ModalProps) {
  const { isModalOpen = false, content, setIsModalOpen } = props;
  let [isOpen, setIsOpen] = useState(isModalOpen);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(isModalOpen);
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
        Open dialog
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-md" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-black p-6 text-left align-middle shadow-xl transition-all">
                  <div className="mt-2">{content}</div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center !rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}>
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
