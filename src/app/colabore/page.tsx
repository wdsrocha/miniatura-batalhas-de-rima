import { Main } from "@/components/Main";
import { Navbar } from "@/components/Navbar";
import { contacts } from "@/lib/contact";

export default function AboutPage() {
  return (
    <>
      <Navbar path="colabore" />
      <Main>
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Fala comigo
        </h2>
        <p className="mt-6 text-lg leading-8 text-gray-300">
          Este é um projeto pequeno, cuidado por apenas uma pessoa. Fique à
          vontade para deixar comentários, sugerir melhorias, reprotar bugs ou
          qualquer outra coisa diratamente comigo:
        </p>
        <dl className="mt-10 space-y-4 text-base leading-7 text-gray-300">
          {contacts.map((contact, i) => (
            <div key={i} className="flex gap-x-4">
              <dt className="flex-none">
                <span className="sr-only">{contact.name}</span>
                <contact.icon
                  className="h-7 w-6 text-gray-400"
                  aria-hidden="true"
                />
              </dt>
              <dd>
                <a className="hover:text-white" href={contact.href}>
                  {contact.description}
                </a>
              </dd>
            </div>
          ))}
        </dl>
      </Main>
    </>
  );
}
