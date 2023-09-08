/* eslint-disable @next/next/no-img-element */
import { Navbar } from "@/components/Navbar";

export default function NewsPage() {
  return (
    <>
      <Navbar path="novidades"></Navbar>
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <article className="prose prose-invert md:prose-lg prose-img:mx-auto">
          <h1>Notas de atualização do site</h1>
          <p>Setembro de 2023:</p>
          <ul>
            <li>
              Agora o site se lembrará da última fonte e cor que você usou 🧠
            </li>
            <li>Adição da página de novidades (esta página!) 📄</li>
          </ul>
          <p>Julho de 2023:</p>
          <ul>
            <li>Mais cores pré-definidas e cor customizada 🎨</li>
            <li>
              Adição de <i>landing page</i> e página de contato 📄
            </li>
            <li>Correção de bugs 🐞</li>
            <li>Melhorias de usabilidade</li>
          </ul>
          <p>Junho de 2023:</p>
          <ul>
            <li>Agora você pode escolher entre 7 tipos de fontes ✍️</li>
            <li>
              Agora você pode usar asteriscos no título para colorir qualquer
              palavra. Ex: Grande *final*
            </li>
            <li>Melhorias de usabilidade</li>
          </ul>
          <p>Maio de 2023</p>
          <ul>
            <li>Agora as imagens podem ser recortadas e ajustadas ✂️</li>
            <li>Diversas melhorias de usabilidade</li>
          </ul>
          <p>Abril de 2023</p>
          <ul>
            <li>Lançamento do site 🎉</li>
          </ul>
        </article>
      </main>
    </>
  );
}
