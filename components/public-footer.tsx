export function PublicFooter() {
  return (
    <footer className="bg-slate-800/50 backdrop-blur-sm border-t border-slate-700/50 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Modern CMS
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Sistema de gerenciamento de conteúdo moderno e escalável construído com Next.js e Firebase.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Recursos</h4>
            <ul className="space-y-2 text-slate-400">
              <li>Gerenciamento de Páginas</li>
              <li>Layouts Flexíveis</li>
              <li>SEO Otimizado</li>
              <li>Responsivo</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Tecnologias</h4>
            <ul className="space-y-2 text-slate-400">
              <li>Next.js 15</li>
              <li>Firebase</li>
              <li>TypeScript</li>
              <li>Tailwind CSS</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-700/50 mt-8 pt-8 text-center">
          <p className="text-slate-400">
            &copy; {new Date().getFullYear()} Modern CMS. Construído com ❤️ usando Next.js e Firebase.
          </p>
        </div>
      </div>
    </footer>
  )
}
