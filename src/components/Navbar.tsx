import logo from "../../public/images/logo.png";
import cn from "classnames";
import Image from "next/image";
import Link from "next/link";

const navigation = [
  { name: "Editor", href: "/editor" },
  { name: "Sobre", href: "/sobre" },
  { name: "Colabore", href: "/colabore" },
  // { name: "Novidades", href: "/novidades" },
];

export const Navbar = (props: { path: string }) => (
  <nav className="bg-gray-800">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="relative flex h-16 items-center justify-start gap-x-6">
        <Link href="/">
          <Image
            className="h-8 w-auto"
            src={logo}
            alt='Emoji "Rolo de Filmes"'
          />
        </Link>
        <div className="flex space-x-4">
          {navigation.map((item) => {
            const current = props.path === item.href.substring(1);
            return (
              <div key={item.name} className="relative flex">
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "rounded-md px-3 py-2 text-sm font-medium",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  )}
                  aria-current={current ? "page" : undefined}
                >
                  <span>{item.name}</span>
                </Link>
                {/* {item.href === "/novidades" && (
                  <span className="relative -ml-2 flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-sky-500"></span>
                  </span>
                )} */}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </nav>
);
