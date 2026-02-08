import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { BRAND } from "../landing/constants";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 py-8 mt-16">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span className="font-semibold text-neutral-900 dark:text-white">{BRAND.name}</span>
        </Link>
        <div className="flex items-center gap-6 text-sm text-neutral-500 dark:text-neutral-400">
          <Link to="/" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
            Home
          </Link>
          <Link to="/about" className="hover:text-neutral-900 dark:hover:text-white transition-colors">
            About
          </Link>
        </div>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">{BRAND.copyright}</p>
      </div>
    </footer>
  );
}
