import {
  formatDate,
  getUnseenReleaseNotes,
  releaseNotes,
} from "@/lib/releaseNotes";
import { Dialog, Transition } from "@headlessui/react";
import { NewspaperIcon } from "@heroicons/react/24/outline";
import cn from "classnames";
import { useRouter } from "next/navigation";
import { Fragment } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  lastVisited: string;
}

export const ReleaseNotesModal = (props: Props) => {
  const unseenReleaseNotes = getUnseenReleaseNotes(props.lastVisited);

  const router = useRouter();

  const onCheckReleaseNotes = () => {
    router.push("/novidades");
    props.onClose();
  };

  if (unseenReleaseNotes.length === 0) {
    return null;
  }

  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog className="relative z-10" onClose={props.onClose}>
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

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <NewspaperIcon
                      className="h-6 w-6 text-green-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-center text-base font-semibold leading-6 text-white"
                    >
                      Novidades
                    </Dialog.Title>
                    <div className="prose prose-sm prose-invert mt-2 md:prose-base">
                      {unseenReleaseNotes.map((item, i) => (
                        <div key={i}>
                          <h3>{formatDate(item.date)}</h3>
                          <ul>
                            {item.notes.map((note, j) => (
                              <li key={j}>{note}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                    onClick={onCheckReleaseNotes}
                  >
                    Ver todas as notas de atualização
                  </button>
                  <button
                    type="button"
                    className={cn(
                      "mt-3 inline-flex w-full justify-center rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-white/20 sm:col-start-1 sm:mt-0",
                      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    )}
                    onClick={props.onClose}
                  >
                    Voltar ao editor
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
