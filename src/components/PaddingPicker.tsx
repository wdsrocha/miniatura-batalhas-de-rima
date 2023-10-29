import { paddings } from "@/lib/fonts";
import { RadioGroup } from "@headlessui/react";
import cn from "classnames";

interface Props {
  selectedPadding: string;
  onChange?: (padding: string) => void;
}

export const PaddingPicker = (props: Props) => {
  return (
    <RadioGroup
      value={props.selectedPadding}
      onChange={props.onChange}
      className="space-y-2"
    >
      <RadioGroup.Label className="block text-sm font-medium leading-6 text-white">
        Espaçamento
      </RadioGroup.Label>
      <div className="flex flex-wrap gap-2">
        {Object.entries(paddings).map(([name, padding]) => (
          <RadioGroup.Option
            key={name}
            value={padding}
            className={({ active, checked }) =>
              cn(
                checked && active ? "ring " : "",
                checked && !active ? "ring-2 " : "",
                checked || active
                  ? "bg-indigo-600 hover:bg-indigo-500 "
                  : "bg-white/10 hover:bg-white/20",
                "flex flex-wrap items-center justify-center",
                "h-8 w-28 cursor-pointer rounded-md ring-indigo-600 hover:ring-indigo-500 focus:outline-none"
              )
            }
          >
            <div
              className={cn(
                "flex items-center justify-center",
                "h-full w-full rounded-md border-2 border-gray-900"
              )}
            >
              <RadioGroup.Label
                as="span"
                className={cn(
                  "rounded text-sm font-semibold uppercase tracking-wider text-white"
                )}
              >
                {name}
              </RadioGroup.Label>
            </div>
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
};
