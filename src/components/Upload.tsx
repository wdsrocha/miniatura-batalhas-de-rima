import { ArrowUpTrayIcon, TrashIcon } from "@heroicons/react/24/solid";
import { ChangeEvent } from "react";

interface Props {
  handleFiles: (files: FileList | null) => void;
}

export const Upload = (props: Props) => {
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    props.handleFiles(event.target.files);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.currentTarget.click();
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor="image">
        <span
          role="button"
          aria-controls="filename"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className="inline-flex items-center gap-x-1.5 rounded-md bg-white/10 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
        >
          <ArrowUpTrayIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
          Escolher imagem
        </span>
      </label>
      <input
        tabIndex={-1}
        id="image"
        name="image"
        type="file"
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