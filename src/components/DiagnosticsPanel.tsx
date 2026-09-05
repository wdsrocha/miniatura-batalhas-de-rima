import cn from "classnames";
import { useMemo, useState } from "react";

interface Props {
  report: object;
  onClose: () => void;
  /** Optional: returns a small (~96px) preview of the current thumbnail. */
  getImagePreview?: () => Promise<string | null>;
}

export const DiagnosticsPanel = ({ report, onClose, getImagePreview }: Props) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [busyPreview, setBusyPreview] = useState(false);
  const [copied, setCopied] = useState(false);

  const text = useMemo(
    () =>
      JSON.stringify(
        preview ? { ...report, imagePreview: preview } : report,
        null,
        2
      ),
    [report, preview]
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API blocked — the textarea is already selected on focus, so
      // the user can copy manually.
    }
  };

  const download = () => {
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "miniatura-diagnostico.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const togglePreview = async (checked: boolean) => {
    if (!checked || !getImagePreview) {
      setPreview(null);
      return;
    }
    setBusyPreview(true);
    try {
      setPreview(await getImagePreview());
    } finally {
      setBusyPreview(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Diagnóstico"
    >
      <div className="flex max-h-full w-full max-w-lg flex-col gap-3 overflow-hidden rounded-lg bg-gray-800 p-4 shadow-xl">
        <h2 className="text-base font-semibold text-white">Diagnóstico</h2>
        <p className="text-sm text-gray-400">
          Isto ajuda a investigar o problema. Contém apenas informações técnicas
          (navegador, tamanhos, tempos e médias de brilho) — nenhuma parte da sua
          imagem, a menos que você marque a opção abaixo. Copie e envie para o
          desenvolvedor.
        </p>

        <textarea
          readOnly
          value={text}
          onFocus={(event) => event.currentTarget.select()}
          className="h-56 w-full resize-none rounded bg-gray-900 p-2 font-mono text-xs leading-relaxed text-gray-200"
        />

        {getImagePreview && (
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={!!preview}
              disabled={busyPreview}
              onChange={(event) => togglePreview(event.target.checked)}
            />
            Incluir uma prévia reduzida (96px) da imagem — ajuda a ver se ficou
            preta ou recortada errada
          </label>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={copy}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            {copied ? "Copiado!" : "Copiar"}
          </button>
          <button
            type="button"
            onClick={download}
            className="rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-600"
          >
            Baixar .json
          </button>
          <a
            href="https://wa.me/5592982100440/"
            className="rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-600"
          >
            Abrir WhatsApp
          </a>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "ml-auto rounded-md px-3 py-2 text-sm font-semibold text-gray-300 hover:text-white",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            )}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
