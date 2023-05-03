import { Font, fonts } from "@/lib/fonts";
import cn from "classnames";
import { NextFontWithVariable } from "next/dist/compiled/@next/font";
import localFont from "next/font/local";
import Image from "next/image";
import { forwardRef, useId } from "react";

export type Color = "red" | "green" | "blue" | "yellow";

interface Props {
  image?: string;
  title: string;
  color: string;
  fontName: string;
}

export const Thumbnail = forwardRef<HTMLDivElement, Props>(function Thumbnail(
  props: Props,
  ref
) {
  const title = props.title.toLocaleUpperCase();
  // TODO: Add "VS" option
  const tokens = title.split(" X ");
  const id = useId();

  const font = fonts[props.fontName];

  console.log({ font });

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
            "absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap uppercase text-white"
          )}
        >
          {tokens.map((token, i) => {
            const key = `${id}${i}`;
            // TODO: Find out why this pops the Warning: Each child in a list
            // should have a nuique "key" prop.
            if (i) {
              return (
                <>
                  <span key={`${key}:separator`} style={{ color: props.color }}>
                    {" X "}
                  </span>
                  <span key={`${key}:token`}>{token}</span>
                </>
              );
            }
            return <span key={key}>{token}</span>;
          })}
        </div>
      </div>
    </div>
  );
});
