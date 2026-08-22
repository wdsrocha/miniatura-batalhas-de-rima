import { ArrowPathIcon, ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import cn from "classnames";
import { ChangeEvent } from "react";

interface Props {
  id: string;
  label: string;
  // Reading a file can take a while (HEIC photos have to be converted first)
  loading?: boolean;
  loadingLabel?: string;
  handleFiles: (files: FileList | null) => void;
}

export const Upload = (props: Props) => {
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    props.handleFiles(event.target.files);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    if (props.loading) {
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.currentTarget.click();
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor={props.loading ? undefined : props.id}>
        <span
          role="button"
          aria-controls="filename"
          aria-busy={props.loading}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className={cn(
            "inline-flex items-center gap-x-1.5 rounded-md bg-white/10 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm",
            props.loading ? "cursor-wait opacity-70" : "hover:bg-white/20",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          )}
        >
          {props.loading ? (
            <ArrowPathIcon
              className="-ml-0.5 h-5 w-5 animate-spin"
              aria-hidden="true"
            />
          ) : (
            <ArrowUpTrayIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
          )}
          {props.loading ? props.loadingLabel ?? "Carregando..." : props.label}
        </span>
      </label>
      <input
        tabIndex={-1}
        id={props.id}
        name={props.id}
        type="file"
        // Some browsers don't map the `.heic`/`.heif` extensions to `image/*`,
        // so they have to be listed explicitly
        accept="image/*,.heic,.heif"
        disabled={props.loading}
        className="sr-only"
        onClick={(event) => {
          // This is a hack to allow the user to select the same file twice
          // https://stackoverflow.com/a/58527761
          // @ts-ignore
          event.target.value = null;
        }}
        onChange={handleImageChange}
      />
    </div>
  );
};
