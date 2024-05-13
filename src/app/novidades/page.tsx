/* eslint-disable @next/next/no-img-element */
import { Navbar } from "@/components/Navbar";
import { releaseNotes } from "@/lib/releaseNotes";

const formatDate = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString("pt-BR", {
    timeZone: "UTC",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function ReleaseNotesPage() {
  return (
    <>
      <Navbar path="novidades"></Navbar>
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <article className="prose prose-invert md:prose-lg prose-img:mx-auto">
          <h1>Notas de atualização do site</h1>
          {releaseNotes.map((n, i) => (
            <div key={i}>
              <h3>{formatDate(n.date)}</h3>
              <ul>
                {n.notes.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </article>
      </main>
    </>
  );
}
