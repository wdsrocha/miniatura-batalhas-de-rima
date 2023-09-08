/* eslint-disable @next/next/no-img-element */
import { Navbar } from "@/components/Navbar";

export default function AboutPage() {
  return (
    <>
      <Navbar path="sobre"></Navbar>
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <article className="prose prose-invert md:prose-lg prose-img:mx-auto">
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
            A motivação deste site é tornar a criação de miniaturas de vídeo
            mais acessíveis para organizações de batalhas, pois nem todas
            possuem tempo ou recursos para elaborar um bom design. Além disso, o
            site também ajuda a agilizar o processo para organizações que já
            publicam os vídeos com suas própias miniaturas.
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
            Após carregar a miniatura original do vídeo da Batalha da Glória no
            site, um resultado melhor é obtido com pouco esforço.
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
            Apesar de funcional, muitas melhorias podem ser integradas ao site,
            como adição de múltiplos estilos, cores diferentes, alteração de
            fontes, entre outros. Dependendo do interesse da comunidade, posso
            evoluir as funcionalidades.
          </p>
          <p>
            Confira a <a href="/colabore">página de colaboração</a> para saber
            como entrar em contato.
          </p>
          <h2>Batalhas Parceiras</h2>
          <p>
            Canais que estão utilizando este site. Caso esteja usando e queira
            entrar na lista, é só me avisar.
          </p>
          <ul>
            <li>
              <a href="https://www.youtube.com/@batalhadalaprata">
                Batalha da La Prata - Manaus AM
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com/@batalhadanova">
                Batalha da Nova - Manaus AM
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com/@batalhadas_minaam">
                Batalha das Minas - Manaus AM
              </a>
            </li>
          </ul>
        </article>
      </main>
    </>
  );
}
