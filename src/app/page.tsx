'use client'
import Image from 'next/image'
import thumb from '../../public/images/sample_thumb.jpg'
import cn from "classnames"
import localFont from 'next/font/local'

import { toPng } from 'html-to-image'
import { forwardRef, useRef } from 'react'

const higher = localFont({
  src: "../../public/fonts/Higher.ttf",
  variable: '--font-higher'
})

const Thumbnail = forwardRef<HTMLDivElement>(function Thumbnail(_props, ref) {
  return (
    <div className={cn(higher.variable)} ref={ref}>
      <div className={cn(
        higher.variable,
        "relative h-[360px] w-[640px] overflow-hidden border-2 border-red-500",
        "bg-gradient-to-t from-black via-15% via-black"
      )}>
        <Image className='relative -z-10 object-contain' width="640" height="360" src={thumb} alt='' />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-7xl font-normal uppercase text-white">
          <span>BIG XANG</span>
          <span className="text-red-500">{" X "}</span>
          <span>HOPE</span>
        </div>
      </div>
    </ div>
  )
})

export default function Home() {
  const thumbnailRef = useRef<HTMLDivElement>(null)

  const exportImage = async () => {
    if (thumbnailRef.current) {
      console.log("Exporting image...")

      // Why the hell it exports in the intended size? In the code, the image is
      // 640x360, but after exporting, it changes to 1280x720. This is intended,
      // but not expected. TODO: verify if I can trust this magic behavior
      const base64image = await toPng(thumbnailRef.current)

      const link = document.createElement('a')
      link.download = 'image.png'
      link.href = base64image
      link.click()
    }
  }

  return (
    <div className='flex flex-col mx-auto max-w-5xl space-y-8 items-center mt-16'>
      <Thumbnail ref={thumbnailRef} />
      <button className='border rounded bg-slate-200 text-slate-800 w-fit px-2' onClick={exportImage}>Exportar imagem</button>
    </div>
  )
}
