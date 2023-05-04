import { fonts } from "@/lib/fonts";
import cn from "classnames";

interface Props {
  sample: string;
  onChange?: (font: string) => void;
}

export const FontPicker = (props: Props) => {
  return (
    <fieldset className="space-y-2">
      <legend className="block text-sm font-medium leading-6 text-white">
        Fonte
      </legend>
      <div className="space-y-4">
        {Object.entries(fonts).map(([name, font]) => (
          <div key={name} className="flex items-center space-x-3">
            <input
              type="radio"
              id={name}
              name="font"
              defaultChecked={name === "higher"}
              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
              onChange={() => props.onChange?.(name)}
            />
            <label
              htmlFor={name}
              className={cn(
                font.baseTokens,
                "block text-xl leading-6 tracking-wider text-white"
              )}
            >
              {font.label}
            </label>
          </div>
        ))}
      </div>
    </fieldset>
  );
};
