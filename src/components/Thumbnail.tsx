import { fonts } from "@/lib/fonts";
import cn from "classnames";
import Image from "next/image";
import { forwardRef, useId } from "react";

export type Color = "red" | "green" | "blue" | "yellow";

interface Props {
  image?: string;
  title: string;
  color: string;
  fontName: string;
}

// TODO: refactor this
const withSpacing = (i: number, s: string) => {
  if (i === 0) {
    return `${s}`;
  } else {
    return ` ${s}`;
  }
};

export const Thumbnail = forwardRef<HTMLDivElement, Props>(function Thumbnail(
  props: Props,
  ref
) {
  const tokens = props.title.toLocaleUpperCase().split(" ");
  const id = useId();

  const font = fonts[props.fontName];

  return (
    <div ref={ref}>
      <div
        style={{ borderColor: props.color }}
        className={cn(
          "relative h-[180px] w-[320px] overflow-hidden border-4 md:h-[360px] md:w-[640px]",
          "via-23% bg-gradient-to-t from-black via-black/90 to-transparent to-40%"
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
        <div
          className={cn(
            font.baseTokens,
            font.sizeTokens,
            "absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap uppercase text-white"
          )}
        >
          {tokens.map((token, i) => {
            if (token === "X" || token === "VS") {
              return (
                <span key={i} style={{ color: props.color }}>
                  {withSpacing(i, token)}
                </span>
              );
            } else if (token.match(/^\*.+\*$/)) {
              const trimmedToken = token.slice(1, -1);
              return (
                <span key={i} style={{ color: props.color }}>
                  {withSpacing(i, trimmedToken)}
                </span>
              );
            } else {
              return <span key={i}>{withSpacing(i, token)}</span>;
            }
          })}
        </div>
      </div>
    </div>
  );
});
