export type Border = {
  type: "default" | "inner" | "none";
  label: string;
  tokens: string;
};

export const borders: Record<string, Border> = {
  default: {
    type: "default",
    label: "Normal",
    tokens: "border border-2 -border-offset-2 md:border-4 md:-border-offset-4",
  },
  inner: {
    type: "inner",
    label: "Interna",
    tokens:
      "outline outline-2 -outline-offset-[7px] md:outline-[4px] md:-outline-offset-[14px]",
  },
  none: {
    type: "none",
    label: "Sem borda",
    tokens: "",
  },
};
