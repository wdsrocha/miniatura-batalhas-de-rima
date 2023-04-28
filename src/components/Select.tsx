import { InputHTMLAttributes } from "react";

interface IOption {
  value: string;
  label: string;
}

interface Props {
  id: string;
  label: string;
  defaultValue?: string;
  onChange: InputHTMLAttributes<HTMLSelectElement>["onChange"];
  options: IOption[];
}

export const Select = (props: Props) => (
  <div className="space-y-2">
    <label
      htmlFor={props.id}
      className="block text-sm font-medium leading-6 text-white"
    >
      {props.label}
    </label>
    <select
      id={props.id}
      name={props.id}
      defaultValue={props.defaultValue}
      className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 [&_*]:text-black"
      onChange={props.onChange}
    >
      {props.options.map((option, key) => (
        <option key={key} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);
