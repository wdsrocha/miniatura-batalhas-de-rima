import Image from 'next/image'
import thumb from '../../public/images/sample_thumb.jpg'
import cn from "classnames"
import localFont from 'next/font/local'

const higher = localFont({
  src: "../../public/fonts/Higher.ttf",
  variable: '--font-higher'
})

export default function Home() {
  return (
    <div className={cn("mt-16 flex w-full items-center justify-center font-sans", higher.variable)}>
      <div className="relative h-[360px] w-[640px] overflow-hidden border-2 border-red-500 bg-gradient-to-t from-black via-15% via-black">
        <Image className='relative -z-10 object-contain' width="640" height="360" src={thumb} alt='' />
        <div className="font-higher absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-7xl font-normal uppercase text-white">
          <span>BIG XANG</span>
          <span className="text-red-500">{" X "}</span>
          <span>HOPE</span>
        </div>
      </div>
    </ div>
  )
}
