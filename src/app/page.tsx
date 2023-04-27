"use client";
import Image from "next/image";
import thumb from "../../public/images/sample_thumb.jpg";
import cn from "classnames";
import localFont from "next/font/local";

import { toPng } from "html-to-image";
import {
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
  title: string;
  color: Color;
}

const Thumbnail = forwardRef<HTMLDivElement, IThumbnail>(function Thumbnail(
  props: IThumbnail,
  ref
) {
  const title = props.title.toLocaleUpperCase() || "MC 1 X MC 2";
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
          "relative h-[360px] w-[640px] overflow-hidden border-2",
          "bg-gradient-to-t from-black via-black via-15%"
        )}
      >
        <Image
          className="relative -z-10 object-contain"
          width="640"
          height="360"
          src={thumb}
          alt=""
        />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-7xl font-normal uppercase text-white">
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

  const handleColorChange: InputHTMLAttributes<HTMLSelectElement>["onChange"] =
    (event) => {
      setColor(event.target.value as Color);
    };

  return (
    <div className="mx-auto mt-16 flex max-w-5xl items-start justify-around gap-x-8">
      <form
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <div className="space-y-12">
          <div className="border-b border-white/10 pb-12">
            <div className="space-y-8">
              <div className="space-y-2">
                <label
                  htmlFor="cover-photo"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  Imagem
                </label>
                <div className="flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10">
                  <div className="text-center">
                    <div className="mt-4 flex text-sm leading-6 text-gray-400">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-gray-900 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-indigo-500"
                      >
                        <span>Carregue uma imagem</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">ou arraste e solte</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-400">
                      PNG, JPG ou JPEG
                    </p>
                  </div>
                </div>
              </div>

              <Input
                id="title"
                label="Título"
                placeholder="Dudu X Jaya Luck"
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
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-white"
          >
            Limpar
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            onClick={exportImage}
          >
            Exportar imagem
          </button>
        </div>
      </form>

      <Thumbnail ref={thumbnailRef} title={title} color={color} />

      {/* <form>
        <div className="space-y-12">
          <div className="border-b border-white/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-white">
              Profile
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-400">
              This information will be displayed publicly so be careful what you
              share.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  Username
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                    <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                      workcation.com/
                    </span>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      autoComplete="username"
                      className="flex-1 border-0 bg-transparent py-1.5 pl-1 text-white focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="janesmith"
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="about"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  About
                </label>
                <div className="mt-2">
                  <textarea
                    id="about"
                    name="about"
                    rows={3}
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                    defaultValue={""}
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-400">
                  Write a few sentences about yourself.
                </p>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  Photo
                </label>
                <div className="mt-2 flex items-center gap-x-3">
                  <button
                    type="button"
                    className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
                  >
                    Change
                  </button>
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="cover-photo"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  Cover photo
                </label>
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10">
                  <div className="text-center">
                    <div className="mt-4 flex text-sm leading-6 text-gray-400">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-gray-900 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-400">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-white/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-white">
              Personal Information
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-400">
              Use a permanent address where you can receive mail.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  First name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="first-name"
                    id="first-name"
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="last-name"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  Last name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="last-name"
                    id="last-name"
                    autoComplete="family-name"
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  Country
                </label>
                <div className="mt-2">
                  <select
                    id="country"
                    name="country"
                    autoComplete="country-name"
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 [&_*]:text-black"
                  >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>Mexico</option>
                  </select>
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="street-address"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  Street address
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="street-address"
                    id="street-address"
                    autoComplete="street-address"
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 sm:col-start-1">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  City
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="city"
                    id="city"
                    autoComplete="address-level2"
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="region"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  State / Province
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="region"
                    id="region"
                    autoComplete="address-level1"
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="postal-code"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  ZIP / Postal code
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="postal-code"
                    id="postal-code"
                    autoComplete="postal-code"
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-white/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-white">
              Notifications
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-400">
              We'll always let you know about important changes, but you pick
              what else you want to hear about.
            </p>

            <div className="mt-10 space-y-10">
              <fieldset>
                <legend className="text-sm font-semibold leading-6 text-white">
                  By Email
                </legend>
                <div className="mt-6 space-y-6">
                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input
                        id="comments"
                        name="comments"
                        type="checkbox"
                        className="h-4 w-4 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-gray-900"
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label
                        htmlFor="comments"
                        className="font-medium text-white"
                      >
                        Comments
                      </label>
                      <p className="text-gray-400">
                        Get notified when someones posts a comment on a posting.
                      </p>
                    </div>
                  </div>
                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input
                        id="candidates"
                        name="candidates"
                        type="checkbox"
                        className="h-4 w-4 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-gray-900"
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label
                        htmlFor="candidates"
                        className="font-medium text-white"
                      >
                        Candidates
                      </label>
                      <p className="text-gray-400">
                        Get notified when a candidate applies for a job.
                      </p>
                    </div>
                  </div>
                  <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                      <input
                        id="offers"
                        name="offers"
                        type="checkbox"
                        className="h-4 w-4 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-gray-900"
                      />
                    </div>
                    <div className="text-sm leading-6">
                      <label
                        htmlFor="offers"
                        className="font-medium text-white"
                      >
                        Offers
                      </label>
                      <p className="text-gray-400">
                        Get notified when a candidate accepts or rejects an
                        offer.
                      </p>
                    </div>
                  </div>
                </div>
              </fieldset>
              <fieldset>
                <legend className="text-sm font-semibold leading-6 text-white">
                  Push Notifications
                </legend>
                <p className="mt-1 text-sm leading-6 text-gray-400">
                  These are delivered via SMS to your mobile phone.
                </p>
                <div className="mt-6 space-y-6">
                  <div className="flex items-center gap-x-3">
                    <input
                      id="push-everything"
                      name="color"
                      type="radio"
                      className="h-4 w-4 border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-gray-900"
                    />
                    <label
                      htmlFor="push-everything"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Everything
                    </label>
                  </div>
                  <div className="flex items-center gap-x-3">
                    <input
                      id="push-email"
                      name="color"
                      type="radio"
                      className="h-4 w-4 border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-gray-900"
                    />
                    <label
                      htmlFor="push-email"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Same as email
                    </label>
                  </div>
                  <div className="flex items-center gap-x-3">
                    <input
                      id="push-nothing"
                      name="color"
                      type="radio"
                      className="h-4 w-4 border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-gray-900"
                    />
                    <label
                      htmlFor="push-nothing"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      No push notifications
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-white"
          >
            Limpar
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            onClick={exportImage}
          >
            Exportar imagem
          </button>
        </div>
      </form> */}
    </div>
  );
}
