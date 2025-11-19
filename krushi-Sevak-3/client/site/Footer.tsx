export default function Footer() {
  return (
    <footer className="border-t border-emerald-100/60 bg-gradient-to-r from-white via-emerald-50/50 to-white">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 text-sm text-muted-foreground md:flex-row">
        <div className="text-center md:text-left">
          <p className="font-semibold text-emerald-800">© {new Date().getFullYear()} Krushi-Sevak.</p>
          <p className="text-xs text-muted-foreground">Built for community engagement and farmer empowerment.</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="rounded-full border border-emerald-100/70 bg-white/80 px-3 py-1 font-medium text-emerald-700 shadow-sm">Clean design</span>
          <span className="rounded-full border border-emerald-100/70 bg-white/80 px-3 py-1 font-medium text-emerald-700 shadow-sm">Modern motions</span>
        </div>
      </div>
    </footer>
  );
}
