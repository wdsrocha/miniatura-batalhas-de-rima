export type Border = {
  type: "default" | "inner" | "none";
  label: string;
  tokens: string;
};

export const borders: Record<string, Border> = {
  default: {
    type: "default",
    label: "Normal",
    tokens: "outline outline-2 md:outline-4",
  },
  inner: {
    type: "inner",
    label: "Interna",
    tokens:
      "outline outline-2 -outline-offset-4 md:outline-[3px] md:-outline-offset-[10px]",
  },
  none: {
    type: "none",
    label: "Sem borda",
    tokens: "",
  },
};
