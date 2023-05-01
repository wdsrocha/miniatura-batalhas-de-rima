"use client";

import { Main } from "@/components/Main";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar path="" />
      <Main>
        <h1 className="text-white">Exemplo</h1>
      </Main>
    </>
  );
}
