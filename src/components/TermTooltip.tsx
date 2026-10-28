import React, { useState, useRef, useEffect } from 'react';
import { Volume2, BookOpen, X } from 'lucide-react';
import { IRISH_TERMS, Language, speakIrishText } from '../data/i18n';

interface TermTooltipProps {
  termKey: keyof typeof IRISH_TERMS;
  lang: Language;
  children?: React.ReactNode;
}

export const TermTooltip: React.FC<TermTooltipProps> = ({ termKey, lang, children }) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const term = IRISH_TERMS[termKey];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  if (!term) return <>{children}</>;

  const displayLabel = children || (lang === 'ga' ? term.ga : term.en);

  return (
    <span
      ref={wrapperRef}
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-1 font-medium text-[#006B3F] underline decoration-[#006B3F]/50 decoration-dotted underline-offset-4 hover:decoration-[#006B3F] focus-visible:outline-2 focus-visible:outline-[#006B3F] rounded-sm transition-colors cursor-pointer"
        aria-expanded={open}
      >
        <span>{displayLabel}</span>
      </button>

      {open && (
        <span
          role="tooltip"
          className="fixed sm:absolute z-50 bottom-20 sm:bottom-full left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:mb-2 sm:w-96 p-4 bg-[#0A192F] text-white rounded-2xl shadow-2xl border border-slate-700 text-left block"
        >
          <span className="flex items-start justify-between gap-2 pb-2 mb-2 border-b border-slate-700/80">
            <span className="block">
              <span className="block text-xs font-mono text-[#F7931A] tracking-wide">
                {term.ga}
              </span>
              <span className="block text-sm font-semibold text-white mt-0.5">
                {term.en}
              </span>
              <span className="block text-[11px] font-mono text-slate-300 mt-0.5">
                /{term.phonetic}/
              </span>
            </span>
            <span className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  speakIrishText(term.ga, 'ga');
                }}
                className="h-7 inline-flex items-center justify-center gap-1 px-2.5 text-xs font-medium bg-[#006B3F] hover:bg-[#005632] text-white rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                title={lang === 'ga' ? 'Éist leis an bhfuaimniú' : 'Listen to Gaeilge pronunciation'}
              >
                <Volume2 className="w-3.5 h-3.5 shrink-0" />
                <span>Gaeilge</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                }}
                className="w-7 h-7 inline-flex items-center justify-center text-slate-400 hover:text-white rounded-full md:hidden shrink-0"
                aria-label="Close definition"
              >
                <X className="w-3.5 h-3.5 shrink-0" />
              </button>
            </span>
          </span>

          <span className="block text-xs leading-relaxed text-slate-200">
            {lang === 'ga' ? term.definitionGa : term.definitionEn}
          </span>
          {lang === 'ga' && (
            <span className="block text-[11px] leading-relaxed text-slate-400 mt-2 pt-2 border-t border-slate-800">
              EN: {term.definitionEn}
            </span>
          )}
        </span>
      )}
    </span>
  );
};

interface GlossaryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const GlossaryDrawer: React.FC<GlossaryDrawerProps> = ({ isOpen, onClose, lang }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const termsList = Object.values(IRISH_TERMS).filter((t) => {
    const matchesCat = selectedCategory === 'all' || t.category === selectedCategory;
    const q = search.toLowerCase();
    const matchesSearch =
      t.ga.toLowerCase().includes(q) ||
      t.en.toLowerCase().includes(q) ||
      t.definitionEn.toLowerCase().includes(q) ||
      t.definitionGa.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#0A192F]/60 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white h-full flex flex-col shadow-2xl border-l border-slate-200">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-[#0A192F] text-white">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-[#F7931A] shrink-0" />
            <div>
              <h2 className="text-lg font-bold tracking-tight">
                {lang === 'ga'
                  ? 'Foclóir Airgeadais & Bitcoine'
                  : 'Bilingual Financial & Bitcoin Glossary'}
              </h2>
              <p className="text-xs text-slate-300">
                {lang === 'ga'
                  ? 'Téarmaíocht shoiléir i nGaeilge agus i mBéarla le fuaimniú'
                  : 'Plain-language Irish & English terms with audio pronunciation'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 inline-flex items-center justify-center text-slate-300 hover:text-white rounded-full hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            aria-label="Close glossary"
          >
            <X className="w-5 h-5 shrink-0" />
          </button>
        </div>

        <div className="p-4 border-b border-slate-200 bg-[#F4F6F9] space-y-3">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              lang === 'ga'
                ? 'Cuardaigh téarma (m.sh. Ciste Éigeandála, Ús Iolraithe, Féin-Choinneáil)...'
                : 'Search money term (e.g. Emergency Fund, Compounding, Purchasing Power)...'
            }
            className="w-full h-10 px-4 text-sm bg-white border border-slate-300 rounded-full focus:outline-2 focus:outline-[#006B3F]"
          />
          <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-full overflow-x-auto">
            {[
              { id: 'all', en: 'All Terms', ga: 'Gach Téarma' },
              { id: 'budget', en: 'Everyday Money', ga: 'Airgead Laethúil' },
              { id: 'tax', en: 'Growing Wealth & Rebates', ga: 'Fás Saibhris' },
              { id: 'bitcoin', en: 'Bitcoin', ga: 'Bitcoin' },
              { id: 'security', en: 'Scam Safety', ga: 'Slándáil' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`min-h-[32px] inline-flex items-center justify-center px-3.5 py-1 text-xs font-semibold rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-white text-[#0A192F] shadow-xs'
                    : 'text-slate-600 hover:text-[#0A192F]'
                }`}
              >
                {lang === 'ga' ? cat.ga : cat.en}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {termsList.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-[#006B3F]/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-[#006B3F]">{item.ga}</div>
                  <div className="text-base font-semibold text-[#0A192F] mt-0.5">{item.en}</div>
                  <div className="text-xs font-mono text-slate-500 mt-0.5">
                    Pronunciation: /{item.phonetic}/
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => speakIrishText(item.ga, 'ga')}
                  className="min-h-[32px] inline-flex items-center justify-center gap-1.5 px-3 py-1 text-xs font-semibold text-[#006B3F] bg-[#006B3F]/10 hover:bg-[#006B3F]/20 rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{lang === 'ga' ? 'Fuaimniú' : 'Listen (GA)'}</span>
                </button>
              </div>
              <p className="text-sm text-slate-700 mt-3 leading-relaxed">
                {lang === 'ga' ? item.definitionGa : item.definitionEn}
              </p>
              {lang === 'ga' && (
                <p className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
                  <span className="font-semibold">English:</span> {item.definitionEn}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
