import { InputHTMLAttributes } from "react";

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
    <label
      htmlFor={props.id}
      className="block text-sm font-medium  leading-6 text-white"
    >
      {props.label}
    </label>
    <p className="text-sm leading-6 text-gray-400">{props.description}</p>
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
