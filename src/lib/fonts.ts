import cn from "classnames";
import localFont from "next/font/local";

const higherFont = localFont({
  src: "../../public/fonts/Higher.ttf",
  variable: "--font-higher",
});

const droneRangerFont = localFont({
  src: "../../public/fonts/drone-ranger-pro-bold.ttf",
  variable: "--font-drone-ranger",
});

const freezerBtnFont = localFont({
  src: "../../public/fonts/freezer-btn-regular.ttf",
  variable: "--font-freezer-btn",
});

export type Font = {
  label: string;
  baseTokens: string;
  sizeTokens: string;
};

export const fonts: Record<string, Font> = {
  higher: {
    label: "Higher",
    baseTokens: cn(higherFont.className, higherFont.variable, "tracking-wide"),
    sizeTokens: "text-5xl md:text-8xl -mb-4",
  },
  droneRanger: {
    label: "Drone Ranger",
    baseTokens: cn(
      droneRangerFont.className,
      droneRangerFont.variable,
      "tracking-tight"
    ),
    sizeTokens: "text-2xl md:text-5xl",
  },
  freezerBtn: {
    label: "Freezer BTN",
    baseTokens: cn(
      freezerBtnFont.className,
      freezerBtnFont.variable,
      "tracking-tight"
    ),
    sizeTokens: "text-5xl",
  },
};
