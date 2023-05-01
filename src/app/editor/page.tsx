"use client";

import { Input } from "@/components/Input";
import { Main } from "@/components/Main";
import { Navbar } from "@/components/Navbar";
import { Select } from "@/components/Select";
import { Color, Thumbnail } from "@/components/Thumbnail";
import { Upload } from "@/components/Upload";
import { TrashIcon } from "@heroicons/react/24/solid";
import { toPng } from "html-to-image";
import { InputHTMLAttributes, useRef, useState } from "react";

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

  const handleColorChange: InputHTMLAttributes<HTMLSelectElement>["onChange"] =
    (event) => {
      setColor(event.target.value as Color);
    };

  return (
    <>
      <Navbar path="editor" />
      <Main>
        <div className="flex flex-col items-center justify-around gap-y-8 lg:flex-row-reverse lg:items-start lg:gap-x-8">
          {image && (
            <Thumbnail
              ref={thumbnailRef}
              image={image || undefined}
              title={title}
              color={color}
            />
          )}
          <form
            className="w-full space-y-8"
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <div className="space-y-2">
              <Upload handleFiles={handleFiles} />

              {imageFilename && (
                <div className="flex justify-start items-center">
                  <p className="text-sm leading-6 text-gray-400">
                    {imageFilename}
                  </p>
                  <button
                    type="button"
                    className="inline-flex items-center gap-x-1.5 rounded-md mx-1 px-1.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
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
      </Main>
    </>
  );
}
