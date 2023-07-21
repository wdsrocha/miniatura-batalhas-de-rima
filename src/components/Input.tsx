import { Popover, Transition } from "@headlessui/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { Fragment, InputHTMLAttributes } from "react";

interface Props {
  id: string;
  label: string;
  placeholder?: string;
  description?: string;

  value: string;
  onChange: InputHTMLAttributes<HTMLInputElement>["onChange"];
}

export const Input = (props: Props) => (
  <div className="space-y-2">
    <div className="flex items-center space-x-1">
      <label
        htmlFor={props.id}
        className="block text-sm font-medium  leading-6 text-white"
      >
        {props.label}
      </label>
      {props.description && (
        <Popover className="relative">
          <Popover.Button className="flex items-center rounded-md hover:bg-white/20  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
            <InformationCircleIcon
              className="h-5 w-5 text-white"
              aria-hidden="true"
            />
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute z-10  w-64 rounded-lg bg-gray-700 p-4 sm:w-96">
              <p className="text-sm leading-6 text-gray-400">
                {props.description}
              </p>
            </Popover.Panel>
          </Transition>
        </Popover>
      )}
    </div>
    <input
      type="text"
      name={props.id}
      id={props.id}
      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
      placeholder={props.placeholder}
      value={props.value}
      onChange={props.onChange}
    />
  </div>
);
