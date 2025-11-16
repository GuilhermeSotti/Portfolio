import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" aria-label="Home">
          <div className="flex items-center gap-3">
            <Image src="/avatar.jpg" alt="avatar" width={36} height={36} className="rounded-full" />
            <span className="font-semibold">Guilherme Sotti</span>
          </div>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="#projects"><a className="text-sm hover:underline">Projetos</a></Link>
          <Link href="#metrics"><a className="text-sm hover:underline">Métricas</a></Link>
          <a href="https://github.com/GuilhermeSotti" target="_blank" rel="noopener noreferrer" className="text-sm">GitHub</a>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-sm">LinkedIn</a>
        </nav>
      </div>
    </header>
  );
}
