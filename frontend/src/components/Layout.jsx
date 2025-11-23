function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-sky-400">
            TinyLink
          </h1>
          <span className="text-xs text-slate-400">
            Simple URL shortener
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        {children}
      </main>

      <footer className="border-t border-slate-800 text-center text-xs text-slate-500 py-3">
        TinyLink &middot; Demo assignment
      </footer>
    </div>
  );
}

export default Layout;
