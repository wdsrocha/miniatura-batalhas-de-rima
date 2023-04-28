"use client";

import { Upload } from "@/components/Upload";
import { TrashIcon } from "@heroicons/react/24/solid";
import cn from "classnames";
import { toPng } from "html-to-image";
import localFont from "next/font/local";
import Image from "next/image";
import {
  ChangeEvent,
  InputHTMLAttributes,
  forwardRef,
  useId,
  useRef,
  useState,
} from "react";

const higher = localFont({
  src: "../../public/fonts/Higher.ttf",
  variable: "--font-higher",
});

type Color = "red" | "green" | "blue" | "yellow";

interface IThumbnail {
  image?: string;
  title: string;
  color: Color;
}

const Thumbnail = forwardRef<HTMLDivElement, IThumbnail>(function Thumbnail(
  props: IThumbnail,
  ref
) {
  const title = props.title.toLocaleUpperCase();
  // TODO: Add "VS" option
  const tokens = title.split(" X ");
  const id = useId();

  const colorVariants: Record<Color, string> = {
    red: "border-red-500 text-red-500",
    green: "border-green-500 text-green-500",
    blue: "border-blue-500 text-blue-500",
    yellow: "border-yellow-500 text-yellow-500",
  };

  const color = colorVariants[props.color];

  return (
    <div className={cn(higher.variable)} ref={ref}>
      <div
        className={cn(
          higher.variable,
          color,
          "relative h-[180px] w-[320px] md:h-[360px] md:w-[640px] overflow-hidden border-4",
          "bg-gradient-to-t from-black via-black via-15%"
        )}
      >
        {props.image ? (
          <Image
            className="relative -z-10 object-contain"
            width="1280"
            height="720"
            src={props.image}
            alt=""
          />
        ) : null}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap text-5xl md:text-8xl font-normal uppercase text-white">
          {tokens.map((token, i) => {
            const key = `${id}${i}`;
            // TODO: Find out why this pops the Warning: Each child in a list
            // should have a nuique "key" prop.
            if (i) {
              return (
                <>
                  <span key={`${key}:separator`} className={color}>
                    {" X "}
                  </span>
                  <span key={`${key}:token`}>{token}</span>
                </>
              );
            }
            return <span key={key}>{token}</span>;
          })}
        </div>
      </div>
    </div>
  );
});

interface IInput {
  id: string;
  label: string;
  placeholder?: string;
  description?: string;

  value: string;
  onChange: InputHTMLAttributes<HTMLInputElement>["onChange"];
}

const Input = (props: IInput) => (
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

interface IOption {
  value: string;
  label: string;
}

interface ISelect {
  id: string;
  label: string;
  defaultValue?: string;
  onChange: InputHTMLAttributes<HTMLSelectElement>["onChange"];
  options: IOption[];
}

const Select = (props: ISelect) => (
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

export default function Home() {
  const thumbnailRef = useRef<HTMLDivElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [imageFilename, setImageFilename] = useState("");
  const [title, setTitle] = useState("");
  const [color, setColor] = useState<Color>("red"); // In tailwind token...

  const exportImage = async () => {
    if (thumbnailRef.current) {
      console.log("Exporting image...");

      // Why the hell it exports in the intended size? In the code, the image is
      // 640x360, but after exporting, it changes to 1280x720. This is intended,
      // but not expected. TODO: verify if I can trust this magic behavior
      const base64image = await toPng(thumbnailRef.current);

      // https://gist.github.com/codeguy/6684588?permalink_comment_id=3361909#gistcomment-3361909
      const slug = title
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-");

      const link = document.createElement("a");
      link.download = `${slug}.png`;
      link.href = base64image;
      link.click();
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) {
      return;
    }

    const file = files[0];
    const reader = new FileReader();

    setImageFilename(file.name);

    reader.onload = (event) => {
      setImage(event.target?.result as string);
    };

    reader.readAsDataURL(file as Blob);
  };

  const handleImageDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleFiles(event.dataTransfer.files);
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
  };

  const handleColorChange: InputHTMLAttributes<HTMLSelectElement>["onChange"] =
    (event) => {
      setColor(event.target.value as Color);
    };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.currentTarget.click();
    }
  };

  return (
    <div className="mx-auto mt-8 sm:mt-16 flex max-w-5xl flex-col items-center justify-around gap-y-8 px-8 lg:flex-row-reverse lg:items-start lg:gap-x-8">
      <Thumbnail
        ref={thumbnailRef}
        image={image || undefined}
        title={title}
        color={color}
      />
      <form
        className="w-full space-y-8"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <div className="space-y-2">
          <Upload handleFiles={handleFiles} />

          {imageFilename && (
            <div className="flex justify-between items-center">
              <p className="text-sm leading-6 text-gray-400">{imageFilename}</p>
              <button
                type="button"
                className="inline-flex items-center gap-x-1.5 rounded-md px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
                onClick={() => {
                  setImage(null);
                  setImageFilename("");
                }}
              >
                <TrashIcon
                  className="-ml-0.3 h-3 w-3 text-gray-400"
                  aria-hidden="true"
                />
              </button>
            </div>
          )}
        </div>

        <Input
          id="title"
          label="Título"
          placeholder="Emicida X Negra Re"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <Select
          id="color"
          label="Cor Primária"
          defaultValue="red"
          onChange={handleColorChange}
          options={[
            {
              value: "red",
              label: "Vermelho (#ef4444)",
            },
            {
              value: "green",
              label: "Verde (#22c55e)",
            },
            {
              value: "blue",
              label: "Azul (#3b82f6)",
            },
            {
              value: "yellow",
              label: "Amarelo (#f59e0b)",
            },
          ]}
        />

        <hr className="border-white/10" />

        <button
          type="submit"
          className="w-full rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          onClick={exportImage}
        >
          Salvar imagem
        </button>
      </form>
    </div>
  );
}
