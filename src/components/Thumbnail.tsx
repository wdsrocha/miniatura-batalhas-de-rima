import { fonts, paddings } from "@/lib/fonts";
import cn from "classnames";
import Image from "next/image";
import { forwardRef, useId } from "react";

interface Props {
  image?: string;
  title: string;
  color: string;
  fontName: string;
  padding: string;
}

// TODO: refactor this
const withSpacing = (i: number, s: string) => {
  if (i === 0) {
    return `${s}`;
  } else {
    return ` ${s}`;
  }
};

const PairThumbnail = forwardRef<HTMLDivElement, Props>(function Thumbnail(
  props: Props,
  ref
) {
  const title = props.title.toLocaleUpperCase();
  const id = useId();

  const [l0, l1, versus, r0, r1] = getGroups(title);
  const leftTokens = [l0, l1];
  const rightTokens = [r0, r1];

  // console.log({ left, versus, right, leftTokens, rightTokens });

  const font = fonts[props.fontName];
  const padding = props.padding;
  console.log({ font, padding });

  return (
    <div data-test="thumbnail-frame" ref={ref}>
      <div
        style={{ borderColor: props.color }}
        className={cn(
          "relative h-[180px] w-[320px] overflow-hidden border-4 md:h-[360px] md:w-[640px]",
          "via-23% bg-gradient-to-t from-black via-black/90 to-transparent to-50%"
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
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-start">
              {leftTokens.map((token, i) => {
                return (
                  <div className="-my-1" key={i}>
                    {withSpacing(i, token)}
                  </div>
                );
              })}
            </div>
            <div
              style={{ color: props.color }}
              className={cn(
                padding,
                fonts["headliner"].baseTokens,
                fonts["headliner"].sizeTokens
              )}
            >
              {versus}
            </div>
            <div className="flex flex-col items-end">
              {rightTokens.map((token, i) => {
                return (
                  <div className="-my-1" key={i}>
                    {withSpacing(i, token)}
                  </div>
                );
              })}
            </div>
          </div>
          {/* {tokens.map((token, i) => {
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
          })} */}
        </div>
      </div>
    </div>
  );
});

function getGroups(title: string) {
  // Checks if there is two or more players in each team
  const expression = String.raw`^(.+) e (.+) (x|vs) (.+) e (.+)$`;
  const regex = new RegExp(
    expression,
    "giu" // global, insensitive and unicode
  );

  // const result = title.match(regex);
  const result = regex.exec(title);

  if (!result) {
    return ["", "", ""];
  }

  const [_, leftTeam0, leftTeam1, versus, rightTeam0, rightTeam1] = result;

  return [leftTeam0, leftTeam1, versus, rightTeam0, rightTeam1];
}

function isPair(title: string) {
  // Checks if there is two or more players in each team
  const expression = String.raw`^(.+) e (.+) (x|vs) (.+) e (.+)$`;
  const regex = new RegExp(
    expression,
    "giu" // global, insensitive and unicode
  );

  // const result = title.match(regex);
  const result = regex.exec(title);

  if (!result) {
    return false;
  }

  const [_, leftTeam, versus, rightTeam] = result;

  return true;
}

interface ITitle {}

enum CharAction {
  None,
  Highlight,
  Hide,
}

function getActions(s: string) {
  let isOpen = false;
  const actions = s.split("").map((_) => CharAction.None);
  s.split("").forEach((c, i) => {
    if (c == "*" && !isOpen) {
      isOpen = true;
      actions[i] = CharAction.Hide;
    } else if (c == "*" && isOpen) {
      isOpen = false;
      actions[i] = CharAction.Hide;
    } else if (isOpen) {
      actions[i] = CharAction.Highlight;
    }
  });

  // This means that the last * never closed, so I should unhilight
  if (isOpen) {
    for (let i = actions.length - 1; i >= 0; i--) {
      if (actions[i] === CharAction.Hide) {
        i = -1; // break loop
      }
      actions[i] = CharAction.Hide;
    }
  }

  return actions;
}

const StandardTitle = (props: { text: string; color: string }) => {
  const result = props.text.match(/^(.+) (x|vs) (.+)$/);
  if (!result) {
    return <div>teste</div>;
  }

  const [_, left, versus, right] = result;

  return (
    <div className="w-[320px] whitespace-pre-wrap text-center md:w-[640px]">
      <span>{left} </span>
      <span style={{ color: props.color }}>{versus}</span>
      <span> {right}</span>
    </div>
  );
};

const PairTitle = () => {};

export const Thumbnail = forwardRef<HTMLDivElement, Props>(function Thumbnail(
  props: Props,
  ref
) {
  const title = props.title.toLocaleUpperCase();
  const id = useId();

  if (isPair(title)) {
    return <PairThumbnail {...props} ref={ref} />;
  }

  const tokens = props.title.toLocaleUpperCase().split(" ");

  const font = fonts[props.fontName];

  return (
    <div data-test="thumbnail-frame" ref={ref}>
      <div
        style={{ borderColor: props.color }}
        className={cn(
          "relative h-[180px] w-[320px] overflow-hidden border-4 md:h-[360px] md:w-[640px]",
          "via-23% bg-gradient-to-t from-black via-black/90 to-transparent to-60%" // to-40% single line to-60% double line
        )}
      >
        {props.image ? (
          <Image
            className="relative -z-10 object-contain"
            width="1280"
            height="720"
            src={props.image}
            onLoad={(event) => {}}
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
          {/* width must sync with parent width. This is used to break the text
          line inside the frame */}
          <div className="w-[320px] whitespace-pre-wrap text-center md:w-[640px]">
            {tokens.map((token, i) => {
              if (token === "X" || token === "VS") {
                return (
                  <span key={i} style={{ color: props.color }}>
                    {withSpacing(i, token)}
                  </span>
                );
              } else if (token === "\\N") {
                return <br key={i} />;
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
    </div>
  );
});
