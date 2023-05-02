import cn from "classnames";
import localFont from "next/font/local";
import Image from "next/image";
import { forwardRef, useId } from "react";

export type Color = "red" | "green" | "blue" | "yellow";

interface Props {
  image?: string;
  title: string;
  color: string;
}

const higher = localFont({
  src: "../../public/fonts/Higher.ttf",
  variable: "--font-higher",
});

export const Thumbnail = forwardRef<HTMLDivElement, Props>(function Thumbnail(
  props: Props,
  ref
) {
  const title = props.title.toLocaleUpperCase();
  // TODO: Add "VS" option
  const tokens = title.split(" X ");
  const id = useId();

  return (
    <div className={cn(higher.variable)} ref={ref}>
      <div
        style={{ borderColor: props.color }}
        className={cn(
          higher.variable,
          "relative h-[180px] w-[320px] md:h-[360px] md:w-[640px] overflow-hidden border-4",
          "bg-gradient-to-t from-black via-black via-15%"
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
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap text-5xl md:text-8xl font-normal uppercase text-white">
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
