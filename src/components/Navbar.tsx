import logo from "../../public/images/logo.png";
import cn from "classnames";
import Image from "next/image";
import Link from "next/link";

const navigation = [
  { name: "Editor", href: "/editor" },
  { name: "Sobre", href: "/sobre" },
];

export const Navbar = (props: { path: string }) => (
  <nav className="bg-gray-800">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="relative flex h-16 items-center justify-start gap-x-6">
        <Image className="h-8 w-auto" src={logo} alt='Emoji "Rolo de Filmes"' />
        <div className="flex space-x-4">
          {navigation.map((item) => {
            const current = props.path === item.href.substring(1);
            return (
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
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  </nav>
);
