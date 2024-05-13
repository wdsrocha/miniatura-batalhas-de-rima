import { Grain, grains } from "@/lib/grains";
import { RadioGroup } from "@headlessui/react";
import cn from "classnames";

interface Props {
  selected: Grain["type"];
  onChange?: (grain: Grain["type"]) => void;
}

export const GrainPicker = (props: Props) => {
  return (
    <RadioGroup
      value={props.selected}
      onChange={props.onChange}
      className="space-y-2"
    >
      <RadioGroup.Label className="block text-sm font-medium leading-6 text-white">
        Textura granulada
      </RadioGroup.Label>
      <div className="flex flex-wrap gap-2">
        {Object.entries(grains).map(([name, grain]) => (
          <RadioGroup.Option
            key={name}
            value={name}
            className={({ active, checked }) =>
              cn(
                checked && active ? "ring " : "",
                checked && !active ? "ring-2 " : "",
                checked || active
                  ? "bg-indigo-600 font-semibold hover:bg-indigo-500"
                  : "bg-white/10 font-normal hover:bg-white/20",
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
              <RadioGroup.Label as="span" className="text-sm  text-white">
                {grain.label}
              </RadioGroup.Label>
            </div>
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
};
