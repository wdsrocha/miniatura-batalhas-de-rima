import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const image = fetch(
  new URL("../../../public/images/sample_thumb.jpg", import.meta.url)
).then((res) => res.arrayBuffer());

const font = fetch(new URL("../../assets/Higher.ttf", import.meta.url)).then(
  (res) => res.arrayBuffer()
);

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (request: NextRequest) {
  const imageData = (await image) as unknown as string;
  const fontData = await font;

  const { searchParams } = new URL(request.url);

  const title = searchParams.get("title") || "";
  const tokens = title.toLocaleUpperCase().split(" X ");

  return new ImageResponse(
    (
      <div
        style={{
          overflow: "hidden",
          width: "100%",
          height: "100%",
          display: "flex",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img
          style={{ position: "relative", objectFit: "cover" }}
          width={1280}
          height={720}
          src={imageData}
        />
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundImage:
              "linear-gradient(to top, #000, #000 15%, rgb(0 0 0 / 0))",
          }}
        />
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: "25%",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            fontSize: "256px",
            fontFamily: "Higher",
            lineHeight: "1",
            color: "white",
          }}
        >
          {tokens.map((token, i) => {
            const key = `${i}`;
            if (i) {
              return (
                <>
                  <span
                    style={{
                      color: "red",
                      marginLeft: "32px",
                      marginRight: "32px",
                    }}
                  >
                    X
                  </span>
                  <span>{token}</span>
                </>
              );
            } else {
              return <span key={key}>{token}</span>;
            }
          })}
        </div>
      </div>
    ),
    {
      width: 1280,
      height: 720,
      fonts: [
        {
          name: "Higher",
          data: fontData,
          style: "normal",
        },
      ],
    }
  );
}
