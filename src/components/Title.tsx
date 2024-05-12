import { HTMLAttributes } from "react";

interface Props {
  text: string;
  color: string;
}

function addAttributesBetweenAsterisks(
  text: string,
  color: string,
  attributes?: HTMLAttributes<HTMLSpanElement>[]
) {
  if (!attributes) {
    attributes = text.split("").map((c) => ({}));
  }

  for (let i = 0; i < text.length; i++) {
    if (text[i] === "*") {
      let j = i + 1;
      while (j < text.length && text[j] !== "*") {
        j++;
      }
      if (j === text.length) {
        break;
      }
      const match = text.slice(i, j + 1);

      attributes[i] = { ...attributes[i], hidden: true };
      attributes[j] = { ...attributes[j], hidden: true };
      for (let k = i + 1; k < j; k++) {
        attributes[k] = {
          ...attributes[k],
          style: { ...attributes[k].style, color },
        };
      }
      console.log(match);
      i = j;
    }
  }

  return attributes;
}

function addAttributesBetweenQuotationMarks(
  text: string,
  attributes?: HTMLAttributes<HTMLSpanElement>[]
) {
  if (!attributes) {
    attributes = text.split("").map((c) => ({}));
  }

  if (text.startsWith("“") && text.endsWith("”")) {
    for (let i = 0; i < text.length; i++) {
      attributes[i] = {
        ...attributes[i],
        style: { ...attributes[i].style, fontStyle: "italic" },
      };
    }
  }

  return attributes;
}

export const Title = (props: Props) => {
  const text = props.text
    .toLocaleUpperCase()
    .replace(/ (VS|X) /g, " *$1* ")
    .replace(/^"/g, "“")
    .replace(/"$/g, "”");

  let attributes: HTMLAttributes<HTMLSpanElement>[] = text
    .split("")
    .map((c) => ({}));

  attributes = addAttributesBetweenAsterisks(text, props.color, attributes);
  attributes = addAttributesBetweenQuotationMarks(text, attributes);

  return (
    <>
      {text.split("").map((c, i) => (
        <span key={i} {...attributes[i]}>
          {c}
        </span>
      ))}
    </>
  );
};
