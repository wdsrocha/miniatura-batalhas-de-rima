"use client";

import demo from "../../public/images/demo.png";
import { contacts } from "@/lib/contact";
import Image from "next/image";
import Balancer, { Provider } from "react-wrap-balancer";

export default function Home() {
  return (
    <div className="flex h-[calc(100dvh)] flex-col bg-gray-900">
      <main className="isolate mb-auto">
        {/* Hero section */}
        <div className="relative">
          <div
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
          <div className="pt-24 sm:pt-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center">
                <Provider>
                  <Balancer
                    as="h1"
                    className="text-4xl font-bold tracking-tight text-white sm:text-6xl"
                  >
                    Miniaturas de Batalha
                  </Balancer>
                  <Balancer
                    as="p"
                    className="mt-6 text-lg leading-8 text-gray-300"
                  >
                    Crie miniaturas para os vídeos de forma simples.
                  </Balancer>
                </Provider>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <a
                    href="/editor"
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Comece a editar
                  </a>
                  <a
                    href="/sobre"
                    className="text-sm font-semibold leading-6 text-white"
                  >
                    Saiba mais <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
              <div className="mt-8 flex items-center justify-center sm:mt-12">
                <div className="bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:p-4">
                  <Image src={demo} alt="" priority={true} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900" aria-labelledby="footer-heading">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
          <div className="border-t border-white/10 pt-8">
            <div className="flex items-center justify-center space-x-6 md:order-2">
              {contacts.map((contact) => (
                <a
                  key={contact.name}
                  href={contact.href}
                  className="text-gray-500 hover:text-gray-400"
                >
                  <span className="sr-only">{contact.name}</span>
                  <contact.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
