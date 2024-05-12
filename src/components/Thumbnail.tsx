import { Title } from "./Title";
import { borders, Border } from "@/lib/borders";
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
  border: Border["type"];
}

export const Thumbnail = forwardRef<HTMLDivElement, Props>(function Thumbnail(
  props: Props,
  ref
) {
  const font = fonts[props.fontName];
  const border = borders[props.border];

  return (
    <div data-test="thumbnail-frame" ref={ref}>
      <div
        style={{ borderColor: props.color, outlineColor: props.color }}
        className={cn(
          border.tokens,
          "relative h-[180px] w-[320px] overflow-hidden md:h-[360px] md:w-[640px] ",
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
            className="h-15 w-15 absolute left-3 top-3 z-10 object-contain md:h-28 md:w-28"
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
          <Title text={props.title} color={props.color} />
        </div>
      </div>
    </div>
  );
});
