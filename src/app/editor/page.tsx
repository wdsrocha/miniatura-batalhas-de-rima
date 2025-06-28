"use client";

import { BorderPicker } from "@/components/BorderPicker";
import { COLORS, ColorPicker } from "@/components/ColorPicker";
import { FailToast } from "@/components/FailToast";
import { FontPicker } from "@/components/FontPicker";
import { GrainPicker } from "@/components/GrainPicker";
import { ImageCropperModal } from "@/components/ImageCropperModal";
import { Input } from "@/components/Input";
import { Navbar } from "@/components/Navbar";
import { ReleaseNotesModal } from "@/components/ReleaseNotesModal";
import { SuccessToast } from "@/components/SuccessToast";
import { Thumbnail } from "@/components/Thumbnail";
import { Upload } from "@/components/Upload";
import { Border } from "@/lib/borders";
import { fonts } from "@/lib/fonts";
import { Grain } from "@/lib/grains";
import { getUnseenReleaseNotes, releaseNotes } from "@/lib/releaseNotes";
import { usePersistedState } from "@/lib/usePersistedState";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import cn from "classnames";
import { toPng } from "html-to-image";
import { useEffect, useRef, useState } from "react";

const MAX_FILENAME_LENGTH = 20;

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
  const [logo, setLogo] = usePersistedState<string | null>(null, "logo");
  const [logo2, setLogo2] = usePersistedState<string | null>(null, "logo2");
  const [logoFilename, setLogoFilename] = usePersistedState("", "logoFilename");
  const [logo2Filename, setLogo2Filename] = usePersistedState(
    "",
    "logo2Filename"
  );
  const [title, setTitle] = useState("");
  const [color, setColor] = usePersistedState<string>(COLORS[0].value, "color");
  const [selectedFont, setSelectedFont] = usePersistedState(
    Object.keys(fonts)[0],
    "font"
  );
  const [border, setBorder] = usePersistedState<Border["type"]>(
    "default",
    "border"
  );
  const [grain, setGrain] = usePersistedState<Grain["type"]>("none", "grain");
  const [showCropper, setShowCropper] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailToast, setShowFailToast] = useState(false);
  const [lastVisited, setLastVisited] = usePersistedState(
    new Date().toISOString(),
    "lastVisited"
  );
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    const unseenReleaseNotes = getUnseenReleaseNotes(lastVisited);
    if (unseenReleaseNotes.length > 0) {
      setShowWelcomeModal(true);
    }
  }, [lastVisited]);

  const onCloseReleaseNotesModal = () => {
    setShowWelcomeModal(false);

    // Set a timeout so the content does not disappear during close animation
    setTimeout(() => {
      setLastVisited(new Date().toISOString());
    }, 1_000);
  };

  const exportImage = async () => {
    if (!thumbnailRef.current) {
      return;
    }

    try {
      // Why the hell it exports in the intended size? In the code, the image is
      // 640x360, but after exporting, it changes to 1280x720. This is intended,
      // but not expected. TODO: verify if I can trust this magic behavior
      const base64image = await toPng(thumbnailRef.current);
      const link = document.createElement("a");
      link.download = `${slugify(title)}.png`;
      link.href = base64image;
      link.click();

      setShowSuccessToast(true);
    } catch (error) {
      console.error(error);
      setShowFailToast(true);
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

    setImageFilename(
      file.name.length > MAX_FILENAME_LENGTH
        ? file.name.slice(0, MAX_FILENAME_LENGTH) + "..."
        : file.name
    );
    setShowCropper(true);
  };

  const handleLogoFiles = (files: FileList | null) => {
    if (!files?.length) {
      return;
    }

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      setLogo(event.target?.result as string);
    };
    reader.readAsDataURL(file as Blob);
    setLogoFilename(
      file.name.length > MAX_FILENAME_LENGTH
        ? file.name.slice(0, MAX_FILENAME_LENGTH) + "..."
        : file.name
    );
  };

  const handleLogo2Files = (files: FileList | null) => {

    if (!files?.length) {
      return;
    }

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      setLogo2(event.target?.result as string);
    };
    reader.readAsDataURL(file as Blob);
    setLogo2Filename(
      file.name.length > MAX_FILENAME_LENGTH
        ? file.name.slice(0, MAX_FILENAME_LENGTH) + "..."
        : file.name
    );
  };

  if (!image) {
    return (
      <>
        <Navbar path="editor" />
        <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <Upload
              id="startimage"
              handleFiles={handleFiles}
              label="Escolha uma imagem para começar"
            />
          </div>
        </main>

        <ReleaseNotesModal
          lastVisited={lastVisited}
          open={showWelcomeModal}
          onClose={onCloseReleaseNotesModal}
        />
      </>
    );
  }

  return (
    <>
      <Navbar path="editor" />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-around gap-y-8 lg:flex-row-reverse lg:items-start lg:gap-x-8">
          <Thumbnail
            ref={thumbnailRef}
            image={croppedImage || undefined}
            title={title}
            logo={logo || undefined}
            logo2={logo2 || undefined}
            fontName={selectedFont}
            color={color}
            border={border}
            grain={grain}
          />
          <form
            className="w-full space-y-8"
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <div className="items-top flex w-full space-x-8">
              <div className="space-y-2">
                <Upload
                  id="image"
                  handleFiles={handleFiles}
                  label="Trocar imagem"
                />
                {imageFilename && (
                  <div className="flex items-center justify-start space-x-2">
                    <p className="text-clip text-sm leading-6 text-gray-400">
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
                      <span className="sr-only">Editar recorte</span>
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
                      <span className="sr-only">Apagar imagem</span>
                    </button>
                  </div>
                )}
              </div>
              <div className="h-16 w-px bg-white/10"></div>
              <div className="space-y-2">
                <Upload
                  id="logo"
                  handleFiles={handleLogoFiles}
                  label={logoFilename ? "Trocar logo" : "Adicionar logo"}
                />
                {logoFilename && (
                  <div className="flex items-center justify-start space-x-2">
                    <p className="text-sm leading-6 text-gray-400">
                      {logoFilename}
                    </p>
                    <button
                      type="button"
                      className={cn(
                        "inline-flex items-center rounded-md px-1 py-1 text-sm font-semibold text-white shadow-sm hover:bg-white/20",
                        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                      )}
                      onClick={() => {
                        setLogo(null);
                        setLogoFilename("");
                      }}
                    >
                      <TrashIcon
                        className="-ml-0.4 h-4 w-4 text-gray-400"
                        aria-hidden="true"
                      />
                      <span className="sr-only">Apagar logo</span>
                    </button>
                  </div>
                )}
              </div>
              <div className="h-16 w-px bg-white/10"></div>
              <div className="space-y-2">
                <Upload
                  id="logo2"
                  handleFiles={handleLogo2Files}
                  label={logo2Filename ? "Trocar logo 2" : "Adicionar logo 2"}
                />
                {logo2Filename && (
                  <div className="flex items-center justify-start space-x-2">
                    <p className="text-sm leading-6 text-gray-400">
                      {logo2Filename}
                    </p>
                    <button
                      type="button"
                      className={cn(
                        "inline-flex items-center rounded-md px-1 py-1 text-sm font-semibold text-white shadow-sm hover:bg-white/20",
                        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                      )}
                      onClick={() => {
                        setLogo2(null);
                        setLogo2Filename("");
                      }}
                    >
                      <TrashIcon
                        className="-ml-0.4 h-4 w-4 text-gray-400"
                        aria-hidden="true"
                      />
                      <span className="sr-only">Apagar logo 2</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <Input
              id="title"
              label="Título"
              placeholder="Emicida X Negra Re"
              description={`"X" e "VS" são destacados automaticamente. Para
              destacar outras palavras, insira um asterisco antes e depois da(s)
              palavra(s). Exemplo: Grande *Final*. Também é possível entrar no
              modo itálico ao iniciar e terminar o título com aspas. Exemplo:
              "Quem é o maior campeão?"`}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />

            <FontPicker
              selectedFont={selectedFont}
              onChange={setSelectedFont}
            />

            <ColorPicker value={color} onChange={setColor} />

            <BorderPicker selectedBorder={border} onChange={setBorder} />

            <GrainPicker selected={grain} onChange={setGrain} />

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
      </main>
      <ImageCropperModal
        open={showCropper}
        setOpen={setShowCropper}
        image={image}
        onSave={(croppedImage) => setCroppedImage(croppedImage)}
      />
      <SuccessToast show={showSuccessToast} setShow={setShowSuccessToast} />
      <FailToast show={showFailToast} setShow={setShowFailToast} />
    </>
  );
}
