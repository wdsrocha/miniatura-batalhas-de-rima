import { getCroppedImg } from "@/lib/cropImage";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import Cropper, { Area } from "react-easy-crop";

interface Props {
  open: boolean;
  image: string;
  setOpen: (open: boolean) => void;
  onSave: (croppedImage: string) => void;
}

export const Modal = (props: Props) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const saveAndClose = async () => {
    const croppedImage = await getCroppedImg(props.image, croppedAreaPixels, 0);
    props.onSave(croppedImage || "");
    props.setOpen(false);
  };

  const handleCropComplete = (_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={props.setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full h-full items-end justify-center border-blue-500 border-4 p-4 text-center sm:items-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="w-full space-y-4 sm:space-y-6 flex flex-col relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:p-6 h-full">
                <Dialog.Title
                  as="h3"
                  className="grow-0 text-base sm:text-xl font-semibold leading-6 text-gray-900 text-center"
                >
                  Recortar
                </Dialog.Title>
                <div className="grow -mx-4 sm:-mx-6">
                  <div className="relative top-0 left-0 right-0 bottom-0 h-full">
                    <Cropper
                      image={props.image!}
                      crop={crop}
                      zoom={zoom}
                      aspect={16 / 9}
                      onCropChange={setCrop}
                      onCropComplete={handleCropComplete}
                      onZoomChange={setZoom}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className="grow-0 inline-flex w-full md:w-64 md:mx-auto justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={saveAndClose}
                >
                  Salvar
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
