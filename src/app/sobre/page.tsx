/* eslint-disable @next/next/no-img-element */

/* eslint-disable react/no-unescaped-entities */
import { Main } from "@/components/Main";
import { Navbar } from "@/components/Navbar";
import Image from "next/image";

export default function AboutPage() {
  return (
    <>
      <Navbar path="sobre"></Navbar>
      <Main>
        <article className="prose prose-lg md:prose-xl dark:prose-invert prose-img:mx-auto">
          <h1>Miniatura de Vídeo para Batalhas de Rima</h1>
          <p>
            Todas as semanas centenas de batalhas de rima acontecem no Brasil e
            uma parte consideravel destas batalhas são postadas no YouTube. Como
            membro da organização de uma batalha (
            <a href="https://instagram.com/bdlaprata/">@bdlaprata</a>), sei que
            é trabalhoso gerar boas miniaturas/thumbnails para aumentar o
            alcance das publicações. Subimos em média 15 vídeos por semana, isto
            é, em média 15 edições de imagem para contemplar todas as
            miniaturas.
          </p>
          <p>
            A motivação desta aplicação é tornar a criação de miniaturas de
            vídeo mais acessíveis para organizações de batalhas, pois nem todas
            possuem tempo ou recursos para elaborar um bom design. Além disso, a
            aplicação também ajuda a agilizar o processo para organizações que
            já publicam os vídeos com suas própias miniaturas.
          </p>
          <p>
            Por exemplo, com uma breve busca no YouTube é possível notar o
            contraste de miniaturas entre uma batalha de menor visibilidade (
            <a href="https://www.youtube.com/@batalhadagloria/">
              Batalha da Glória
            </a>
            ) e uma batalha profissional (
            <a href="https://www.youtube.com/@batalhadaaldeia">
              Batalha da Aldeia
            </a>
            ).
          </p>
          <p>
            <img
              src="https://raw.githubusercontent.com/wdsrocha/miniatura-batalhas-de-rima/main/docs/images/miniaturas-do-youtube.png"
              alt="Miniaturas encontradas no YouTube"
            />
          </p>
          <p>
            Após carregar a miniatura original do vídeo da Batalha da Glória na
            aplicação, um resultado melhor é obtido com pouco esforço.
          </p>
          <p>
            <img
              width={400}
              height={400}
              src="https://raw.githubusercontent.com/wdsrocha/miniatura-batalhas-de-rima/main/docs/images/miniatura-gerada.jpeg"
              alt="Miniatura gerada pela aplicação"
            />
          </p>
          <p>
            Ao salvar a imagem, um arquivo PNG de resolução 1280 × 720 (16:9) é
            exportado para o computador.{" "}
            <a href="https://support.google.com/youtube/answer/72431?hl=en#zippy=%2Cimage-size-resolution">
              Esta já é a resolução ideal para o YouTube
            </a>
            .
          </p>
          <p>
            Apesar de funcional, muitas melhorias podem ser integradas à
            aplicação, como adição de múltiplos estilos, cores diferentes,
            alteração de fontes, entre outros. Dependendo do interesse da
            comunidade, posso evoluir as funcionalidades.
          </p>
        </article>
      </Main>
    </>
  );
}
