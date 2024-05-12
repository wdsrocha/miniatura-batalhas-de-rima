import cn from "classnames";
import localFont from "next/font/local";

export type Font = {
  label: string;
  baseTokens: string;
  sizeTokens: string;
  // Used in the font picker
  // Sometimes the defaults are unreadable, so extra tokens are needed
  presentationTokens?: string;
};

const pineforestFont = localFont({
  src: "../../public/fonts/pineforest.ttf",
  variable: "--font-pineforest",
});

const yulongFont = localFont({
  src: "../../public/fonts/yulong.ttf",
  variable: "--font-yulong",
});

const blockyFont = localFont({
  src: "../../public/fonts/blocky.ttf",
  variable: "--font-blocky",
});

const brooklineFont = localFont({
  src: "../../public/fonts/brookline.ttf",
  variable: "--font-brookline",
});

const deliriumFont = localFont({
  src: "../../public/fonts/delirium.ttf",
  variable: "--font-delirium",
});

const headlinerFont = localFont({
  src: "../../public/fonts/headliner.ttf",
  variable: "--font-headliner",
});

const humaneFont = localFont({
  src: "../../public/fonts/humane.ttf",
  variable: "--font-humane",
});

export const fonts: Record<string, Font> = {
  delirium: {
    label: "delirium",
    baseTokens: cn(deliriumFont.className, deliriumFont.variable),
    sizeTokens: "text-4xl md:text-7xl md:mb-2",
    presentationTokens: "mt-1.5",
  },

  headliner: {
    label: "headliner",
    baseTokens: cn(headlinerFont.className, headlinerFont.variable),
    sizeTokens: "text-4xl md:text-7xl md:mb-2",
    presentationTokens: "mt-1.5",
  },
  yulong: {
    label: "Yulong",
    baseTokens: cn(yulongFont.className, yulongFont.variable),
    sizeTokens: "mb-1 text-4xl md:text-7xl md:mb-4 tracking-tight",
  },
  blocky: {
    label: "Blocky",
    baseTokens: cn(blockyFont.className, blockyFont.variable),
    sizeTokens: "text-4xl mb-0.5 md:text-7xl md:mb-4",
    presentationTokens: "mt-0.5",
  },
  brookline: {
    label: "brookline",
    baseTokens: cn(brooklineFont.className, brooklineFont.variable),
    sizeTokens: "text-3xl md:text-6xl md:mb-3 tracking-tight",
    presentationTokens: "text-sm mt-1.5",
  },
  pineforest: {
    label: "Pineforest",
    baseTokens: cn(pineforestFont.className, pineforestFont.variable),
    sizeTokens: "text-4xl mb-1 md:text-7xl md:mb-4",
  },
  humane: {
    label: "Humane",
    baseTokens: cn(humaneFont.className, humaneFont.variable),
    sizeTokens: "text-4xl md:text-7xl md:mb-2 tracking-wide ",
    presentationTokens: "text-xl mt-0.5 tracking-widest font-normal  ",
  },
};
