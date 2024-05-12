import { fonts } from "@/lib/fonts";
import cn from "classnames";
import Image from "next/image";
import { forwardRef, useId } from "react";

interface Props {
  image?: string;
  title: string;
  color: string;
  fontName: string;
  logo?: string;
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
    <div data-test="thumbnail-frame" ref={ref}>
      <div
        style={{ borderColor: props.color }}
        className={cn(
          "relative h-[180px] w-[320px] overflow-hidden border-2 md:h-[360px] md:w-[640px] md:border-4",
          "via-18% bg-gradient-to-t from-black via-black/90 to-transparent to-35%"
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
        {props.logo ? (
          <Image
            className="h-15 w-15 absolute left-1 top-1 z-10 object-contain md:h-28 md:w-28"
            width="60"
            height="60"
            src={props.logo}
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
