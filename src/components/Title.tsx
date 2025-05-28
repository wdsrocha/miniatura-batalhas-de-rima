import { HTMLAttributes } from "react";

const LEFT_DOUBLE_QUOTE = "\u201c"; // “
const RIGHT_DOUBLE_QUOTE = "\u201d"; // ”

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

  if (text.startsWith(LEFT_DOUBLE_QUOTE) && text.endsWith(RIGHT_DOUBLE_QUOTE)) {
    for (let i = 0; i < text.length; i++) {
      attributes[i] = {
        ...attributes[i],
        style: { ...attributes[i].style, fontStyle: "italic" },
      };
    }
  }

  return attributes;
}

function groupAttributesByChunks(
  text: string,
  attributes: HTMLAttributes<HTMLSpanElement>[]
) {
  const chunks: { text: string; attributes: HTMLAttributes<HTMLSpanElement> }[] = [];

  if (text.length === 0) return chunks;

  let currentChunk = {
    text: text[0],
    attributes: attributes[0]
  };

  for (let i = 1; i < text.length; i++) {
    const isSameAttributes = JSON.stringify(attributes[i]) === JSON.stringify(currentChunk.attributes);

    if (isSameAttributes) {
      currentChunk.text += text[i];
    } else {
      chunks.push(currentChunk);
      currentChunk = {
        text: text[i],
        attributes: attributes[i]
      };
    }
  }

  chunks.push(currentChunk);

  return chunks;
}

export const Title = (props: Props) => {
  const text = props.text
    .toLocaleUpperCase()
    .replace(/ (VS|X) /g, " *$1* ")
    .replace(/^"/g, LEFT_DOUBLE_QUOTE)
    .replace(/"$/g, RIGHT_DOUBLE_QUOTE);

  let attributes: HTMLAttributes<HTMLSpanElement>[] = text
    .split("")
    .map((c) => ({}));

  attributes = addAttributesBetweenAsterisks(text, props.color, attributes);
  attributes = addAttributesBetweenQuotationMarks(text, attributes);

  const chunks = groupAttributesByChunks(text, attributes);

  return (
    <>
      {chunks.map((chunk, i) => (
        <span key={i} {...chunk.attributes}>
          {chunk.text}
        </span>
      ))}
    </>
  );
};
