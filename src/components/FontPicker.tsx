import { Font, fonts } from "@/lib/fonts";
import { RadioGroup } from "@headlessui/react";
import cn from "classnames";
import localFont from "next/font/local";

interface Props {
  sample: string;
  // value: string | null;
  onChange?: (font: string) => void;
}

// const fonts = [
//   { name: "Higher", value: "var(--font-higher)", font: higher },
//   {
//     name: "Drone Ranger",
//     value: "var(--font-drone-ranger)",
//     font: droneRanger,
//   },
//   { name: "Freezer Btn", value: "var(--font-freezer-btn)", font: freezerBtn },
// ];

export const FontPicker = (props: Props) => {
  return (
    <fieldset className="space-y-2">
      <legend className="block text-sm font-medium leading-6 text-white">
        Fonte
      </legend>
      <div className="space-y-4">
        {Object.entries(fonts).map(([name, font]) => (
          <div key={name} className="flex items-start space-x-3">
            <input
              type="radio"
              id={name}
              name="font"
              defaultChecked={name === "higher"}
              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
              onChange={() => props.onChange?.(name)}
            />
            <div className="flex flex-col items-start font-medium">
              <label
                htmlFor={name}
                className={cn("leading-2 block text-xs text-white")}
              >
                {font.label}
              </label>
              <p
                className={cn(
                  font.baseTokens,
                  "text-sm leading-6 text-gray-400"
                )}
              >
                {props.sample}
              </p>
            </div>
          </div>
        ))}
      </div>
    </fieldset>
  );
};
