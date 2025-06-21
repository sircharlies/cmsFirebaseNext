export function PublicFooter() {
  return (
    <footer className="bg-slate-800 border-t border-slate-700 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-slate-400">
          <p>&copy; {new Date().getFullYear()} Modern CMS. Construído com Next.js e Firebase.</p>
        </div>
      </div>
    </footer>
  )
}
