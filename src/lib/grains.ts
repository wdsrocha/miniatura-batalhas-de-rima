import grain1 from "../../public/images/grain1.png";
import grain2 from "../../public/images/grain2.png";
import { StaticImageData } from "next/image";

export type Grain = {
  type: "none" | "grain1" | "grain2" | "grain3" | "grain4";
  label: string;
  image?: StaticImageData;
  tokens?: string;
};

export const grains: Record<string, Grain> = {
  none: {
    type: "none",
    label: "Sem textura",
  },
  grain1: {
    type: "grain1",
    label: "Tipo 1",
    image: grain1,
    tokens: "opacity-[30%]",
  },
  grain2: {
    type: "grain2",
    label: "Tipo 2",
    image: grain2,
    tokens: "opacity-[20%]",
  },
};
