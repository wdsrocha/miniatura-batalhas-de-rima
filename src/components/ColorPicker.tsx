import { RadioGroup } from "@headlessui/react";
import cn from "classnames";

interface Props {
  value: string | null;
  onChange?: (color: string) => void;
}

export const COLORS = [
  { name: "Vermelho", value: "#fb192a", ring: "ring-[#fb192a]" },
  { name: "Rosa", value: "#fd04e9", ring: "ring-[#fd04e9]" },
  { name: "Azul", value: "#0800e9", ring: "ring-[#0800e9]" },
  { name: "Ciano", value: "#1df3f1", ring: "ring-[#1df3f1]" },
  { name: "Verde", value: "#28e428", ring: "ring-[#28e428]" },
  { name: "Amarelo", value: "#fef726", ring: "ring-[#fef726]" },
];

export const ColorPicker = (props: Props) => {
  return (
    <RadioGroup
      value={props.value}
      onChange={props.onChange}
      className="space-y-2"
    >
      <RadioGroup.Label className="block text-sm font-medium leading-6 text-white">
        Cor Primária
      </RadioGroup.Label>
      <div className="flex flex-wrap gap-2">
        {COLORS.map((color) => (
          <RadioGroup.Option
            key={color.value}
            value={color.value}
            className={({ active, checked }) =>
              cn(
                color.ring,
                active && checked ? "ring" : "",
                !active && checked ? "ring-2" : "",
                "relative flex cursor-pointer items-center justify-center rounded-md p-0.5 focus:outline-none"
              )
            }
          >
            <RadioGroup.Label as="span" className="sr-only">
              {color.name}
            </RadioGroup.Label>
            <span
              aria-hidden="true"
              style={{
                backgroundColor: color.value,
              }}
              className={cn(
                "h-8 w-8 rounded-md border border-black border-opacity-10"
              )}
            />
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
};
