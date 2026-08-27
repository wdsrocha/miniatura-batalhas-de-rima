export const getUnseenReleaseNotes = (lastVisited: string) => {
  const lastVisitedDate = new Date(lastVisited);
  return releaseNotes.filter(
    (releaseNote) => new Date(releaseNote.date) > lastVisitedDate
  );
};

export const formatDate = (date: string) => {
  const d = new Date(date);
  return d.toLocaleDateString("pt-BR", {
    timeZone: "UTC",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

interface ReleaseNote {
  date: string;
  notes: string[];
}

export const releaseNotes: ReleaseNote[] = [
  {
    date: "2026-08-27",
    notes: [
      "Agora é possível usar fotos tiradas no iPhone (formato HEIC) direto no editor, sem precisar converter antes. 📱",
    ],
  },
  {
    date: "2025-05-28",
    notes: [
      "Corrigido o bug que não permitia adicionar emojis no título. Use quantos quiser! 🎉😃🔥✨",
    ],
  },
  {
    date: "2024-05-12",
    notes: [
      "Opção de adicionar bordas diferentes e texturas granuladas. Experimente as combinações! 🖼️",
      "Melhorias na forma de inserir destaques com asteriscos. Não é mais limitado por uma única palavra por vez e nem requer espaço antes e depois do asterisco. Exemplo que funciona agora: <i>Desafiou o *Big Mike*?</i>",
      'Às vezes é interessante adicionar uma punch da batalha como título. Agora é possível inserir aspas duplas no início e no final do título para enfatizar esse tipo de citação! Exemplo: <i>"Quem é o maior campeão mesmo?"</i>',
      'Redução no tamanho das fontes e adição de uma nova fonte ("humane")',
    ],
  },
  {
    date: "2024-03-01",
    notes: ["Agora é possível adicionar um logo para sua miniatura! 👺"],
  },
  {
    date: "2023-09-08",
    notes: ["Adição da página de novidades (esta página!) 📄"],
  },
  {
    date: "2023-09-07",
    notes: ["Agora o site se lembrará da última fonte e cor que você usou 🧠"],
  },
  {
    date: "2023-07-21",
    notes: [
      "Mais cores pré-definidas e cor customizada 🎨",
      "Adição de página inicial e página de contato 📄",
      "Correção de bugs 🐞",
      "Melhorias de usabilidade",
    ],
  },
  {
    date: "2023-06-20",
    notes: [
      "Agora você pode escolher entre 7 tipos de fontes ✍️",
      "Agora você pode usar asteriscos no título para colorir qualquer palavra. Ex: Grande *final*",
      "Melhorias de usabilidade",
    ],
  },
  {
    date: "2023-05-02",
    notes: [
      "Agora as imagens podem ser recortadas e ajustadas ✂️",
      "Diversas melhorias de usabilidade",
    ],
  },
  {
    date: "2023-04-27",
    notes: ["Lançamento do site 🎉"],
  },
];
