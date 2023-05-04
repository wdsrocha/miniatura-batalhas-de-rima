"use client";

import { COLORS, ColorPicker } from "@/components/ColorPicker";
import { FontPicker } from "@/components/FontPicker";
import { Input } from "@/components/Input";
import { Main } from "@/components/Main";
import { Modal } from "@/components/Modal";
import { Navbar } from "@/components/Navbar";
import { SuccessNotification } from "@/components/SuccessNotification";
import { Color, Thumbnail } from "@/components/Thumbnail";
import { Upload } from "@/components/Upload";
import { fonts } from "@/lib/fonts";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import cn from "classnames";
import { toPng } from "html-to-image";
import { useRef, useState } from "react";

// https://gist.github.com/codeguy/6684588?permalink_comment_id=3361909#gistcomment-3361909
const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");

export default function EditorPage() {
  const thumbnailRef = useRef<HTMLDivElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [imageFilename, setImageFilename] = useState("");
  const [title, setTitle] = useState("");
  const [color, setColor] = useState(COLORS[0].value);
  const [selectedFont, setSelectedFont] = useState(Object.keys(fonts)[0]);
  const [showCropper, setShowCropper] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const exportImage = async () => {
    if (thumbnailRef.current) {
      // Why the hell it exports in the intended size? In the code, the image is
      // 640x360, but after exporting, it changes to 1280x720. This is intended,
      // but not expected. TODO: verify if I can trust this magic behavior
      const base64image = await toPng(thumbnailRef.current);
      const link = document.createElement("a");
      link.download = `${slugify(title)}.png`;
      link.href = base64image;
      link.click();

      setShowSuccessModal(true);
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) {
      return;
    }

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
    };
    reader.readAsDataURL(file as Blob);

    setImageFilename(file.name);
    setShowCropper(true);
  };

  if (!image) {
    return (
      <>
        <Navbar path="editor" />
        <Main>
          <Upload
            handleFiles={handleFiles}
            label="Escolha uma imagem para começar"
          />
        </Main>
      </>
    );
  }

  return (
    <>
      <Navbar path="editor" />
      <Main>
        <div className="flex flex-col items-center justify-around gap-y-8 lg:flex-row-reverse lg:items-start lg:gap-x-8">
          <Thumbnail
            ref={thumbnailRef}
            image={croppedImage || undefined}
            title={title}
            fontName={selectedFont}
            color={color}
          />
          <form
            className="w-full space-y-8"
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <div className="space-y-2">
              <Upload handleFiles={handleFiles} label="Trocar imagem" />

              {imageFilename && (
                <div className="flex items-center justify-start space-x-2">
                  <p className="text-sm leading-6 text-gray-400">
                    {imageFilename}
                  </p>
                  <button
                    type="button"
                    className={cn(
                      "inline-flex items-center rounded-md px-1 py-1 text-sm font-semibold text-white shadow-sm hover:bg-white/20",
                      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    )}
                    onClick={() => {
                      setShowCropper(true);
                    }}
                  >
                    <PencilIcon
                      className="-ml-0.4 h-4 w-4 text-gray-400 "
                      aria-hidden="true"
                    />
                  </button>
                  <button
                    type="button"
                    className={cn(
                      "inline-flex items-center rounded-md px-1 py-1 text-sm font-semibold text-white shadow-sm hover:bg-white/20",
                      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    )}
                    onClick={() => {
                      setImage(null);
                      setCroppedImage(null);
                      setImageFilename("");
                    }}
                  >
                    <TrashIcon
                      className="-ml-0.4 h-4 w-4 text-gray-400"
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

            <FontPicker
              selectedFont={selectedFont}
              onChange={setSelectedFont}
            />

            <ColorPicker value={color} onChange={setColor} />

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
      <Modal
        open={showCropper}
        setOpen={setShowCropper}
        image={image}
        onSave={(croppedImage) => setCroppedImage(croppedImage)}
      />
      <SuccessNotification
        show={showSuccessModal}
        setShow={setShowSuccessModal}
      />
    </>
  );
}
