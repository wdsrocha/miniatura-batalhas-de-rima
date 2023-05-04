"use client";

const getThumbnail = async (title: string) =>
  fetch(`http://localhost:3000/api/og?title${title}`, {
    cache: "no-store",
  }).then((res) => res.arrayBuffer());

export default async function Lab() {
  // const thumbnail = await getThumbnail("foobar");
  // const image = thumbnail ? Buffer.from(thumbnail).toString("base64") : "";

  console.log("render");

  return (
    <div className="mx-auto mt-8 flex max-w-5xl flex-col items-center justify-around gap-y-8 px-8 sm:mt-16 lg:flex-row-reverse lg:items-start lg:gap-x-8">
      <h1 className="text-sm leading-6 text-white">oi</h1>
      {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
      <img src={`data:image/png;base64,${image}`} />
    </div>
  );
}
