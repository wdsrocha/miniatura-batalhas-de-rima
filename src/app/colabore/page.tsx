import { Navbar } from "@/components/Navbar";
import { contacts } from "@/lib/contact";

export default function AboutPage() {
  return (
    <>
      <Navbar path="colabore" />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <article className="prose prose-invert md:prose-lg">
          <h1 className="">Fala comigo</h1>
          <p className="">
            Este é um projeto pequeno, cuidado por apenas uma pessoa. Fique à
            vontade para deixar comentários, sugerir melhorias, reprotar bugs ou
            qualquer outra coisa diratamente comigo:
          </p>
        </article>
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
      </main>
    </>
  );
}
