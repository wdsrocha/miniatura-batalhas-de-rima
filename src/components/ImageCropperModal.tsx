import { getCroppedImg } from "@/lib/cropImage";
import { Dialog, Transition } from "@headlessui/react";
import cn from "classnames";
import { Fragment, useEffect, useState } from "react";
import Cropper, { Area } from "react-easy-crop";

interface Props {
  open: boolean;
  image: string;
  setOpen: (open: boolean) => void;
  onSave: (croppedImage: string) => void;
  onError?: () => void;
}

export const ImageCropperModal = (props: Props) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // The modal instance is reused across uploads, so its crop/zoom/area state
  // outlives the image it was measured against. Without this reset the crop
  // rectangle from the previous photo leaks into the next save — which is how
  // an unrelated (often out-of-bounds) region ended up being exported.
  useEffect(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  }, [props.image]);

  const isReady =
    !!croppedAreaPixels &&
    croppedAreaPixels.width >= 1 &&
    croppedAreaPixels.height >= 1;

  const saveAndClose = async () => {
    if (!isReady || isSaving) {
      return;
    }

    setIsSaving(true);
    try {
      const croppedImage = await getCroppedImg(props.image, croppedAreaPixels, 0);
      props.onSave(croppedImage);
      props.setOpen(false);
    } catch (error) {
      console.error(error);
      props.onError?.();
    } finally {
      setIsSaving(false);
    }
  };

  const handleCropComplete = (_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog
        data-test="crop-modal"
        as="div"
        className="relative z-10"
        onClose={props.setOpen}
      >
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
          <div className="flex h-full min-h-full items-end justify-center border-4 border-blue-500 px-4 py-32 text-center sm:items-center sm:py-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative flex h-full w-full transform flex-col space-y-4 overflow-hidden rounded-lg bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:space-y-6 sm:p-6">
                <Dialog.Title
                  as="h3"
                  className="grow-0 text-center text-base font-semibold leading-6 text-white sm:text-xl"
                >
                  Recortar
                </Dialog.Title>
                <div className="-mx-4 grow sm:-mx-6">
                  <div className="relative bottom-0 left-0 right-0 top-0 h-full">
                    <Cropper
                      key={props.image}
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
                  disabled={!isReady || isSaving}
                  className={cn(
                    "inline-flex w-full grow-0 justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 md:mx-auto md:w-64",
                    "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-indigo-600"
                  )}
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
