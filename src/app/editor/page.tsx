"use client";

import { BorderPicker } from "@/components/BorderPicker";
import { COLORS, ColorPicker } from "@/components/ColorPicker";
import { DiagnosticsPanel } from "@/components/DiagnosticsPanel";
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
import {
  analyzeRenderedImage,
  buildDiagnosticsReport,
  describeImageElement,
  detectEngine,
  diagSession,
  DiagnosticsReport,
  isDegenerateRender,
} from "@/lib/diagnostics";
import { fonts } from "@/lib/fonts";
import { Grain } from "@/lib/grains";
import { readImageFile } from "@/lib/readImageFile";
import { getUnseenReleaseNotes, releaseNotes } from "@/lib/releaseNotes";
import { usePersistedState } from "@/lib/usePersistedState";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { track } from "@vercel/analytics/react";
import cn from "classnames";
import { toPng } from "html-to-image";
import { useEffect, useRef, useState } from "react";

const MAX_FILENAME_LENGTH = 20;

const truncateFilename = (filename: string) =>
  filename.length > MAX_FILENAME_LENGTH
    ? filename.slice(0, MAX_FILENAME_LENGTH) + "..."
    : filename;

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
  const [logoFilename, setLogoFilename] = usePersistedState("", "logoFilename");
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
  const [failMessage, setFailMessage] = useState<string | undefined>(undefined);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [isLoadingLogo, setIsLoadingLogo] = useState(false);
  const [lastVisited, setLastVisited] = usePersistedState(
    new Date().toISOString(),
    "lastVisited"
  );
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [diagnostics, setDiagnostics] = useState<DiagnosticsReport | null>(null);
  const [debugMode, setDebugMode] = useState(false);

  useEffect(() => {
    const unseenReleaseNotes = getUnseenReleaseNotes(lastVisited);
    if (unseenReleaseNotes.length > 0) {
      setShowWelcomeModal(true);
    }
  }, [lastVisited, setLastVisited]);

  useEffect(() => {
    // `?debug=1` in the URL (or a one-off localStorage flag) makes every export
    // open the diagnostics panel, even when nothing looked wrong — so we can ask
    // an affected user to reproduce with it on.
    setDebugMode(
      new URLSearchParams(window.location.search).has("debug") ||
        window.localStorage.getItem("miniatura:debug") === "1"
    );
  }, []);

  const onCloseReleaseNotesModal = () => {
    setShowWelcomeModal(false);

    // Set a timeout so the content does not disappear during close animation
    setTimeout(() => {
      setLastVisited(new Date().toISOString());
    }, 1_000);
  };

  const publishDiagnostics = (report: DiagnosticsReport) => {
    (window as unknown as { __miniaturaDiagnostics?: DiagnosticsReport }).__miniaturaDiagnostics =
      report;
    return report;
  };

  const exportImage = async () => {
    const node = thumbnailRef.current;
    if (!node) {
      return;
    }

    diagSession.bump("exports");
    const timings: Record<string, number> = {};
    const attempts: {
      pixelRatio: number | null;
      ms: number;
      luminance: Awaited<ReturnType<typeof analyzeRenderedImage>>;
    }[] = [];

    try {
      const webkit = detectEngine().webkit;

      // Make sure every <img> inside the thumbnail is actually decoded before we
      // rasterize it — html-to-image will otherwise snapshot a not-yet-painted
      // image as a blank layer.
      const imgs = Array.from(node.querySelectorAll("img"));
      const imagesBefore = imgs.map(describeImageElement);
      const decodeStart = performance.now();
      await Promise.allSettled(
        imgs.map((img) => (img.decode ? img.decode() : Promise.resolve()))
      );
      await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
      timings.decodeMs = Math.round(performance.now() - decodeStart);
      const imagesAfter = imgs.map(describeImageElement);

      // On iOS WebKit the *first* toPng call regularly rasterizes the thumbnail
      // without the nested photo <img> (the SVG/foreignObject is built before
      // html-to-image finishes embedding the resource). A throwaway warm-up call
      // populates html-to-image's resource cache so the real renders include it.
      if (webkit) {
        const warmupStart = performance.now();
        try {
          await toPng(node);
        } catch {
          /* ignore — this call only exists to warm the cache */
        }
        timings.warmupMs = Math.round(performance.now() - warmupStart);
      }

      // Render, checking each result, until one actually contains the photo.
      // Full device pixel ratio first; then fall back to smaller canvases, which
      // are more reliable on WebKit.
      // (The export is 1280x720 because the node is 640x360 at ratio 2 — or
      // 320x180 at ratio 4 on mobile. Lower ratios trade resolution for a frame
      // that is not black.)
      const pixelRatios: (number | undefined)[] = [undefined, undefined, undefined, 2, 1];
      let chosen: { dataUrl: string; luminance: (typeof attempts)[number]["luminance"] } | null =
        null;

      for (const pixelRatio of pixelRatios) {
        const started = performance.now();
        const dataUrl = await toPng(
          node,
          pixelRatio ? { pixelRatio } : undefined
        );
        const luminance = await analyzeRenderedImage(dataUrl);
        attempts.push({
          pixelRatio: pixelRatio ?? null,
          ms: Math.round(performance.now() - started),
          luminance,
        });
        if (!isDegenerateRender(luminance)) {
          chosen = { dataUrl, luminance };
          break;
        }
      }

      timings.renderMs = attempts.reduce((sum, a) => sum + a.ms, 0);
      const degenerate = !chosen;
      if (degenerate) {
        diagSession.bump("blackExportsDetected");
      }

      if (chosen) {
        const link = document.createElement("a");
        link.download = `${slugify(title)}.png`;
        link.href = chosen.dataUrl;
        link.click();
      }

      const report = publishDiagnostics(
        await buildDiagnosticsReport({
          stage: "export",
          degenerate,
          attemptCount: attempts.length,
          timings,
          imagesBefore,
          imagesAfter,
          attempts,
          finalLuminance: chosen?.luminance ?? attempts[attempts.length - 1]?.luminance,
        })
      );

      track("thumbnail-export", {
        engine: report.environment.engine.label,
        degenerate,
        attempts: attempts.length,
        cropClampAdjusted: !!report.crop?.clampAdjusted,
        webkit: report.environment.engine.webkit,
      });

      if (degenerate) {
        setFailMessage(
          "Não foi possível gerar a imagem corretamente (a foto saiu em branco). Toque em “Copiar” e envie o diagnóstico para o desenvolvedor."
        );
        setShowFailToast(true);
        setDiagnostics(report);
      } else {
        setShowSuccessToast(true);
        if (debugMode) {
          setDiagnostics(report);
        }
      }
    } catch (error) {
      console.error(error);
      const report = publishDiagnostics(
        await buildDiagnosticsReport({
          stage: "export",
          timings,
          error:
            error instanceof Error
              ? `${error.name}: ${error.message}`
              : String(error),
        })
      );
      track("thumbnail-export", {
        engine: report.environment.engine.label,
        error: true,
        webkit: report.environment.engine.webkit,
      });
      setFailMessage(undefined);
      setShowFailToast(true);
      setDiagnostics(report);
    }
  };

  const showFileError = () => {
    setFailMessage(
      "Não foi possível ler esta imagem. Tente novamente com outro arquivo."
    );
    setShowFailToast(true);
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) {
      return;
    }

    const file = files[0];
    setIsLoadingImage(true);
    try {
      const dataUrl = await readImageFile(file);
      setImage(dataUrl);
      setImageFilename(truncateFilename(file.name));
      setShowCropper(true);
    } catch (error) {
      console.error(error);
      showFileError();
    } finally {
      setIsLoadingImage(false);
    }
  };

  const handleLogoFiles = async (files: FileList | null) => {
    if (!files?.length) {
      return;
    }

    const file = files[0];
    setIsLoadingLogo(true);
    try {
      const dataUrl = await readImageFile(file);
      setLogo(dataUrl);
      setLogoFilename(truncateFilename(file.name));
    } catch (error) {
      console.error(error);
      showFileError();
    } finally {
      setIsLoadingLogo(false);
    }
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
              loading={isLoadingImage}
              loadingLabel="Carregando imagem..."
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
                  loading={isLoadingImage}
                  loadingLabel="Carregando imagem..."
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
                  loading={isLoadingLogo}
                  loadingLabel="Carregando logo..."
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

            {debugMode && (
              <button
                type="button"
                className="w-full rounded-md border border-white/20 px-3 py-2 text-sm font-semibold text-gray-300 hover:bg-white/10"
                onClick={async () => {
                  setDiagnostics(
                    publishDiagnostics(
                      await buildDiagnosticsReport({ stage: "manual" })
                    )
                  );
                }}
              >
                Gerar diagnóstico
              </button>
            )}
          </form>
        </div>
      </main>
      <ImageCropperModal
        open={showCropper}
        setOpen={setShowCropper}
        image={image}
        onSave={(croppedImage) => setCroppedImage(croppedImage)}
        onError={() => {
          setFailMessage(
            "Não foi possível recortar esta imagem. Tente ajustar o recorte novamente."
          );
          setShowFailToast(true);
        }}
      />
      <SuccessToast show={showSuccessToast} setShow={setShowSuccessToast} />
      <FailToast
        show={showFailToast}
        setShow={setShowFailToast}
        message={failMessage}
      />
      {diagnostics && (
        <DiagnosticsPanel
          report={diagnostics}
          onClose={() => setDiagnostics(null)}
          getImagePreview={async () => {
            if (!thumbnailRef.current) return null;
            try {
              return await toPng(thumbnailRef.current, { pixelRatio: 0.15 });
            } catch {
              return null;
            }
          }}
        />
      )}
    </>
  );
}
