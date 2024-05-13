/* eslint-disable @next/next/no-img-element */
import { Navbar } from "@/components/Navbar";
import { formatDate, releaseNotes } from "@/lib/releaseNotes";

export default function ReleaseNotesPage() {
  return (
    <>
      <Navbar path="novidades"></Navbar>
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <article className="prose prose-invert md:prose-lg prose-img:mx-auto">
          <h1>Notas de atualização</h1>
          {releaseNotes.map((item, i) => (
            <div key={i}>
              <h3>{formatDate(item.date)}</h3>
              <ul>
                {item.notes.map((note, j) => (
                  <li key={j}>{note}</li>
                ))}
              </ul>
            </div>
          ))}
        </article>
      </main>
    </>
  );
}
