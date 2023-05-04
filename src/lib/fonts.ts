import cn from "classnames";
import localFont from "next/font/local";

export type Font = {
  label: string;
  baseTokens: string;
  sizeTokens: string;
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

export const fonts: Record<string, Font> = {
  pineforest: {
    label: "Pineforest",
    baseTokens: cn(pineforestFont.className, pineforestFont.variable),
    sizeTokens: "text-8xl",
  },
  yulong: {
    label: "Yulong",
    baseTokens: cn(yulongFont.className, yulongFont.variable),
    sizeTokens: "text-8xl tracking-tighter",
  },
  blocky: {
    label: "Blocky",
    baseTokens: cn(blockyFont.className, blockyFont.variable),
    sizeTokens: "text-8xl",
  },
  brookline: {
    label: "brookline",
    baseTokens: cn(brooklineFont.className, brooklineFont.variable),
    sizeTokens: "text-7xl tracking-tighter",
  },
  delirium: {
    label: "delirium",
    baseTokens: cn(deliriumFont.className, deliriumFont.variable),
    sizeTokens: "text-8xl",
  },
  headliner: {
    label: "headliner",
    baseTokens: cn(headlinerFont.className, headlinerFont.variable),
    sizeTokens: "text-8xl",
  },
};
