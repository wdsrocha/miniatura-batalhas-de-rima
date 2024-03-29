import { Input } from "./Input";
import { SlideOver } from "./SlideOver";
import { usePersistedState } from "@/lib/usePersistedState";
import { Popover, RadioGroup, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/solid";
import cn from "classnames";
import { Fragment, useState } from "react";
import { HexColorPicker } from "react-colorful";

interface Props {
  value: string | null;
  onChange?: (color: string) => void;
}

export const COLORS = [
  { name: "Vermelho", value: "#fb192a", ring: "ring-[#fb192a]" },
  { name: "Laranja", value: "#ff5722", ring: "ring-[#ff5722]" },
  { name: "Amarelo", value: "#fef726", ring: "ring-[#fef726]" },
  { name: "Verde", value: "#28e428", ring: "ring-[#28e428]" },
  { name: "Ciano", value: "#1df3f1", ring: "ring-[#1df3f1]" },
  { name: "Azul", value: "#0800e9", ring: "ring-[#0800e9]" },
  { name: "Roxo", value: "#6700ff", ring: "ring-[#6700ff]" },
  { name: "Rosa", value: "#fd04e9", ring: "ring-[#fd04e9]" },
];

// https://stackoverflow.com/a/12043228
const isLight = (hexColor: string | undefined) => {
  // "transparent" edge case
  if (!hexColor) {
    return false;
  }

  const c = hexColor.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;

  var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

  return luma > 128;
};

const CustomColorButton = (props: {
  customColor?: string;
  onClick?: () => void;
}) => {
  const { customColor, onClick } = props;
  return (
    <RadioGroup.Option
      onClick={onClick}
      value={customColor}
      className={({ active, checked }) =>
        cn(
          "ring-gray-400",
          checked && active ? "ring" : "",
          checked && !active ? "ring-2" : "",
          "relative flex items-center justify-center",
          "cursor-pointer rounded-md p-0.5 hover:brightness-150 focus:outline-none"
        )
      }
    >
      <RadioGroup.Label as="span" className="sr-only">
        Cor customizada referente ao código hex {customColor}
      </RadioGroup.Label>
      <span
        aria-hidden="true"
        style={{
          backgroundColor: customColor,
        }}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded",
          !customColor && "border border-white"
        )}
      >
        <PlusIcon
          className={cn(
            "h-6 w-6",
            isLight(customColor) ? "text-black" : "text-white"
          )}
        />
      </span>
    </RadioGroup.Option>
  );
};

export const ColorPicker = (props: Props) => {
  const [customColor, setCustomColor] = usePersistedState<string>(
    "transparent",
    "custom-color"
  );

  const onCustomColorChange = (color: string) => {
    setCustomColor(color);
    props.onChange?.(color);
  };

  return (
    <RadioGroup
      value={props.value}
      onChange={props.onChange}
      className="space-y-2"
    >
      <RadioGroup.Label className="block text-sm font-medium leading-6 text-white">
        Cor
      </RadioGroup.Label>
      <div data-test="color-options" className="flex flex-wrap gap-2">
        {COLORS.map((color) => (
          <RadioGroup.Option
            key={color.value}
            value={color.value}
            className={({ active, checked }) =>
              cn(
                color.ring,
                checked && active ? "ring" : "",
                checked && !active ? "ring-2" : "",
                "relative flex items-center justify-center",
                "cursor-pointer rounded-md p-0.5 hover:brightness-150 focus:outline-none"
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
              className="h-8 w-8 rounded"
            />
          </RadioGroup.Option>
        ))}
        <CustomColorPicker color={customColor} setColor={onCustomColorChange} />
      </div>
    </RadioGroup>
  );
};

interface CustomColorPickerProps {
  color: string;
  setColor: (color: string) => void;
}

const CustomColorPicker = (props: CustomColorPickerProps) => {
  const [initialColor, setInitialColor] = useState<string>(props.color);
  const [pickerOpen, setPickerOpen] = useState(false);

  const onClose = () => {
    // Revert the original color to the initial color on close/cancel
    props.setColor(initialColor);
    setPickerOpen(false);
  };

  const onSave = () => {
    // Update the initial color (because React wont dismount this component, so
    // useState won't be called again)
    setInitialColor(props.color);
    setPickerOpen(false);
  };

  return (
    <div>
      <div className="block md:hidden ">
        <CustomColorButton
          customColor={props.color}
          onClick={() => setPickerOpen(true)}
        />
        <SlideOver open={pickerOpen} onClose={onClose}>
          <div className="space-y-4">
            <HexColorPicker
              style={{
                width: "auto",
              }}
              color={props.color}
              onChange={props.setColor}
            />
            <Input
              id="customColorPicker"
              label="Hex"
              placeholder="#ffffff"
              value={props.color !== "transparent" ? props.color : ""}
              onChange={(e) => props.setColor(e.target.value)}
            />

            <button
              className="w-full rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              onClick={onSave}
            >
              Salvar
            </button>
          </div>
        </SlideOver>
      </div>
      <div className="hidden md:block">
        <Popover>
          <Popover.Button>
            <CustomColorButton customColor={props.color} />
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
            <Popover.Panel className="absolute z-10">
              <div className="flex flex-col items-center gap-y-4 rounded-lg bg-gray-700 pb-3">
                <HexColorPicker color={props.color} onChange={props.setColor} />
                <div className="px-2">
                  <Input
                    id="customColorPicker"
                    label="Hex"
                    placeholder="#ffffff"
                    value={props.color !== "transparent" ? props.color : ""}
                    onChange={(e) => props.setColor(e.target.value)}
                  />
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </Popover>
      </div>
    </div>
  );
};
