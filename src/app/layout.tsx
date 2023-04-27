import './globals.css'

export const metadata = {
  title: 'Miniatura de Vídeo | Batalha de Rima',
  description: 'Gere uma miniatura de vídeo para sua Batalha de Rima no YouTube',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
