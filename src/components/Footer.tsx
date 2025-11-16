export default function Footer() {
  return (
    <footer className="bg-white border-t mt-8">
      <div className="container mx-auto px-4 py-6 text-sm text-gray-600 flex justify-between">
        <div>© {new Date().getFullYear()} Guilherme Sotti</div>
        <div className="flex gap-4">
          <a href="https://github.com/GuilhermeSotti" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}
