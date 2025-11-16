export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-lg p-8 mb-8">
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold">Guilherme Sotti</h1>
          <p className="mt-2 max-w-xl">Desenvolvedor Front-end e arquiteto de aplicações web — TypeScript, React/Next.js. Portfólio com integração automática do GitHub e painéis de ganhos por projeto.</p>
          <div className="mt-4">
            <a href="#projects" className="inline-block bg-white text-indigo-700 px-4 py-2 rounded shadow hover:opacity-90">Ver Projetos</a>
          </div>
        </div>
        <div className="w-40 h-40 relative">
          <img src="/avatar.jpg" alt="Foto do autor" className="rounded-full w-full h-full object-cover shadow-lg" />
        </div>
      </div>
    </section>
  );
}
