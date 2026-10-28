import React, { useState } from 'react';
import {
  BookOpen,
  Volume2,
  CheckCircle2,
  Sparkles,
  Download,
  Globe,
  Columns,
  FileText,
  HelpCircle,
} from 'lucide-react';
import { Language, speakIrishText } from '../data/i18n';
import {
  BITCOIN_WHITEPAPER_METADATA,
  BITCOIN_WHITEPAPER_SECTIONS,
} from '../data/bitcoinWhitepaper';

interface BitcoinWhitepaperReaderProps {
  lang: Language;
  externalModalOpen?: boolean;
  onCloseExternalModal?: () => void;
}

export const BitcoinWhitepaperReader: React.FC<BitcoinWhitepaperReaderProps> = ({
  lang,
}) => {
  // Reading mode: 'active_lang' (follows global EN/GA toggle), 'bilingual' (side-by-side EN & GA)
  const [readingMode, setReadingMode] = useState<'active_lang' | 'bilingual'>('active_lang');
  const [showPlainSummary, setShowPlainSummary] = useState<boolean>(true);
  const [selectedSectionId, setSelectedSectionId] = useState<string>('all');
  const [readSections, setReadSections] = useState<Record<string, boolean>>({
    'sec-1': true,
    'sec-6': true,
  });

  const toggleReadSection = (id: string) => {
    setReadSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const visibleSections =
    selectedSectionId === 'all'
      ? BITCOIN_WHITEPAPER_SECTIONS
      : BITCOIN_WHITEPAPER_SECTIONS.filter((s) => s.id === selectedSectionId);

  const handleDownloadBilingualTxt = () => {
    const lines: string[] = [
      `${BITCOIN_WHITEPAPER_METADATA.titleEn} / ${BITCOIN_WHITEPAPER_METADATA.titleGa}`,
      `By ${BITCOIN_WHITEPAPER_METADATA.author} (${BITCOIN_WHITEPAPER_METADATA.dateEn})`,
      '',
      '--- ABSTRACT (ENGLISH) ---',
      BITCOIN_WHITEPAPER_METADATA.abstractEn,
      '',
      '--- ACHOIMRE (GAEILGE) ---',
      BITCOIN_WHITEPAPER_METADATA.abstractGa,
      '',
    ];

    BITCOIN_WHITEPAPER_SECTIONS.forEach((sec) => {
      lines.push(`==================================================`);
      lines.push(`SECTION ${sec.sectionNumber}: ${sec.titleEn} | ${sec.titleGa}`);
      lines.push(`==================================================`);
      lines.push(`[EN] ${sec.originalTextEn}`);
      lines.push('');
      lines.push(`[GA] ${sec.originalTextGa}`);
      lines.push('');
      lines.push(`[Plain English] ${sec.plainSummaryEn}`);
      lines.push(`[Gaeilge Shimplí] ${sec.plainSummaryGa}`);
      lines.push('');
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bitcoin-whitepaper-english-gaeilge.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Whitepaper Header Banner */}
      <div className="bg-gradient-to-br from-[#0A192F] via-[#0F2342] to-[#0A192F] text-white rounded-3xl p-5 sm:p-8 border border-slate-800 shadow-lg space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#F7931A] font-semibold">
              <FileText className="w-4 h-4 shrink-0" />
              <span>
                {lang === 'ga'
                  ? 'AN PÁIPÉAR BÁN BITCOIN · SATOSHI NAKAMOTO (2008)'
                  : 'THE BITCOIN WHITEPAPER · SATOSHI NAKAMOTO (2008)'}
              </span>
            </div>
            <h3 className="text-xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
              {lang === 'ga'
                ? BITCOIN_WHITEPAPER_METADATA.titleGa
                : BITCOIN_WHITEPAPER_METADATA.titleEn}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-mono">
              {BITCOIN_WHITEPAPER_METADATA.author} ·{' '}
              {lang === 'ga'
                ? BITCOIN_WHITEPAPER_METADATA.dateGa
                : BITCOIN_WHITEPAPER_METADATA.dateEn}{' '}
              · {lang === 'ga' ? 'Eagrán Dátheangach (GA & EN)' : 'Bilingual Irish & English Edition'}
            </p>
          </div>

          {/* Interactive Reader Controls — Uniform Height & Aligned Inside Shapes */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-stretch sm:items-center gap-2 w-full lg:w-auto">
            <button
              type="button"
              onClick={() =>
                setReadingMode((prev) => (prev === 'active_lang' ? 'bilingual' : 'active_lang'))
              }
              className={`col-span-2 sm:col-span-1 min-h-[38px] inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold rounded-full border transition-all cursor-pointer ${
                readingMode === 'bilingual'
                  ? 'bg-[#F7931A] text-[#0A192F] border-[#F7931A]'
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/15'
              }`}
            >
              <Columns className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                {readingMode === 'bilingual'
                  ? lang === 'ga'
                    ? 'Modh Taobh le Taobh (GA + EN)'
                    : 'Side-by-Side (EN + GA) On'
                  : lang === 'ga'
                  ? 'Léigh Taobh le Taobh (GA + EN)'
                  : 'Side-by-Side (EN + GA)'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShowPlainSummary((prev) => !prev)}
              className={`min-h-[38px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-full border transition-all cursor-pointer ${
                showPlainSummary
                  ? 'bg-[#006B3F] text-white border-emerald-400/50'
                  : 'bg-white/10 text-slate-300 border-white/15'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F7931A] shrink-0" />
              <span className="truncate">
                {lang === 'ga' ? 'Míniú Simplí' : 'Beginner Summary'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleDownloadBilingualTxt}
              className="min-h-[38px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#F7931A] shrink-0" />
              <span className="truncate">{lang === 'ga' ? 'Íoslódáil' : 'Download'}</span>
            </button>
          </div>
        </div>

        {/* Abstract Card */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#F7931A] font-bold">
              {lang === 'ga' ? 'Achoimre Oifigiúil (Abstract)' : 'Official Abstract'}
            </span>
            <button
              type="button"
              onClick={() =>
                speakIrishText(
                  lang === 'ga'
                    ? BITCOIN_WHITEPAPER_METADATA.abstractGa
                    : BITCOIN_WHITEPAPER_METADATA.abstractEn,
                  lang
                )
              }
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-full transition-colors cursor-pointer shrink-0"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#F7931A] shrink-0" />
              <span>
                {lang === 'ga' ? 'Éist leis an Achoimre (GA)' : 'Listen to Abstract'}
              </span>
            </button>
          </div>

          {readingMode === 'bilingual' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/6 border border-white/15 space-y-1.5">
                <div className="text-[11px] font-mono text-emerald-300 font-bold">
                  GAEILGE (IRISH TRANSLATION)
                </div>
                <p className="text-xs sm:text-sm text-slate-100 leading-relaxed">
                  {BITCOIN_WHITEPAPER_METADATA.abstractGa}
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white/6 border border-white/15 space-y-1.5">
                <div className="text-[11px] font-mono text-[#F7931A] font-bold">
                  ENGLISH (ORIGINAL TEXT)
                </div>
                <p className="text-xs sm:text-sm text-slate-100 leading-relaxed">
                  {BITCOIN_WHITEPAPER_METADATA.abstractEn}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 sm:p-5 rounded-2xl bg-white/6 border border-white/15">
              <p className="text-sm sm:text-base text-slate-100 leading-relaxed">
                {lang === 'ga'
                  ? BITCOIN_WHITEPAPER_METADATA.abstractGa
                  : BITCOIN_WHITEPAPER_METADATA.abstractEn}
              </p>
            </div>
          )}

          {showPlainSummary && (
            <div className="p-4 rounded-2xl bg-[#006B3F]/30 border border-emerald-400/30 flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-emerald-50 leading-relaxed">
                <strong className="text-white">
                  {lang === 'ga' ? 'I bhFocail Shimplí: ' : 'In Plain Language: '}
                </strong>
                {lang === 'ga'
                  ? BITCOIN_WHITEPAPER_METADATA.plainAbstractGa
                  : BITCOIN_WHITEPAPER_METADATA.plainAbstractEn}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section Filter Pills */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-500">
            {lang === 'ga'
              ? 'Roghnaigh alt den Pháipéar Bán le léamh i nGaeilge nó i mBéarla:'
              : 'Jump to any section of the Bitcoin Whitepaper (Irish or English):'}
          </span>
          <span className="text-xs font-mono text-[#006B3F] font-semibold">
            {Object.values(readSections).filter(Boolean).length} / {BITCOIN_WHITEPAPER_SECTIONS.length}{' '}
            {lang === 'ga' ? 'léite' : 'sections read'}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setSelectedSectionId('all')}
            className={`min-h-[34px] inline-flex items-center justify-center px-3.5 py-1.5 text-xs font-bold rounded-full whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              selectedSectionId === 'all'
                ? 'bg-[#0A192F] text-white'
                : 'bg-slate-100 text-slate-600 hover:text-[#0A192F]'
            }`}
          >
            <span>{lang === 'ga' ? 'Gach Alt (1–12)' : 'All Sections (1–12)'}</span>
          </button>

          {BITCOIN_WHITEPAPER_SECTIONS.map((sec) => {
            const isSelected = selectedSectionId === sec.id;
            const isRead = Boolean(readSections[sec.id]);
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setSelectedSectionId(sec.id)}
                className={`min-h-[34px] px-3.5 py-1.5 text-xs font-bold rounded-full whitespace-nowrap shrink-0 inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#F7931A] text-[#0A192F]'
                    : isRead
                    ? 'bg-[#006B3F]/10 text-[#006B3F] border border-[#006B3F]/30'
                    : 'bg-slate-100 text-slate-600 hover:text-[#0A192F]'
                }`}
              >
                <span>§{sec.sectionNumber}</span>
                <span className="truncate max-w-[140px]">
                  {lang === 'ga' ? sec.titleGa : sec.titleEn}
                </span>
                {isRead && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Whitepaper Sections Reader List */}
      <div className="space-y-4">
        {visibleSections.map((sec) => {
          const isRead = Boolean(readSections[sec.id]);

          return (
            <article
              key={sec.id}
              className={`bg-white rounded-3xl border p-5 sm:p-6 transition-all space-y-4 ${
                isRead ? 'border-[#006B3F]/60' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-[#F7931A]/15 text-[#D97706] font-bold">
                      {lang === 'ga' ? `Alt ${sec.sectionNumber}` : `Section ${sec.sectionNumber}`}
                    </span>
                    <span className="text-slate-500">·</span>
                    <span className="text-[#006B3F] font-semibold">
                      {sec.keyTermGa} ({sec.keyTermEn})
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-[#0A192F] mt-1">
                    {lang === 'ga' ? sec.titleGa : sec.titleEn}
                    <span className="text-xs font-normal text-slate-500 ml-2">
                      ({lang === 'ga' ? sec.titleEn : sec.titleGa})
                    </span>
                  </h4>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                  <button
                    type="button"
                    onClick={() =>
                      speakIrishText(
                        lang === 'ga' ? sec.originalTextGa : sec.originalTextEn,
                        lang
                      )
                    }
                    className="btn-google-tonal !py-1.5 !px-3.5 !text-xs"
                  >
                    <Volume2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{lang === 'ga' ? 'Éist (GA)' : 'Listen'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleReadSection(sec.id)}
                    className={
                      isRead
                        ? 'btn-google-tonal !py-1.5 !px-3.5 !text-xs'
                        : 'btn-google-outlined !py-1.5 !px-3.5 !text-xs'
                    }
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {isRead
                        ? lang === 'ga'
                          ? 'Léite ✓'
                          : 'Read ✓'
                        : lang === 'ga'
                        ? 'Marcáil Léite'
                        : 'Mark Read'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Whitepaper Text Body (Single Active Language OR Side-by-Side Bilingual) */}
              {readingMode === 'bilingual' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-[#F4F6F9] border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between gap-2 text-[11px] font-mono font-bold text-[#006B3F]">
                      <span>GAEILGE (IRISH)</span>
                      <button
                        type="button"
                        onClick={() => speakIrishText(sec.originalTextGa, 'ga')}
                        className="inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-full bg-[#006B3F]/10 hover:bg-[#006B3F]/20 text-[#006B3F] transition-colors cursor-pointer"
                      >
                        <Volume2 className="w-3 h-3 shrink-0" />
                        <span>Fuaimniú</span>
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-[#0A192F] leading-relaxed font-serif">
                      “{sec.originalTextGa}”
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F4F6F9] border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between gap-2 text-[11px] font-mono font-bold text-slate-500">
                      <span>ENGLISH (ORIGINAL SATOSHI TEXT)</span>
                      <button
                        type="button"
                        onClick={() => speakIrishText(sec.originalTextEn, 'en')}
                        className="inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-full bg-slate-200/70 hover:bg-slate-300/70 text-[#0A192F] transition-colors cursor-pointer"
                      >
                        <Volume2 className="w-3 h-3 shrink-0" />
                        <span>Listen</span>
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-[#0A192F] leading-relaxed font-serif">
                      “{sec.originalTextEn}”
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 sm:p-5 rounded-2xl bg-[#F4F6F9] border border-slate-200/80">
                  <p className="text-sm sm:text-base text-[#0A192F] leading-relaxed font-serif">
                    “{lang === 'ga' ? sec.originalTextGa : sec.originalTextEn}”
                  </p>
                </div>
              )}

              {/* Beginner Plain-Language Takeaway */}
              {showPlainSummary && (
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-[#F7931A]/30 flex items-start gap-3">
                  <BookOpen className="w-4 h-4 text-[#F7931A] shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    <strong className="text-[#0A192F]">
                      {lang === 'ga'
                        ? 'Cad a chiallaíonn sé seo duitse: '
                        : 'What this means in plain English: '}
                    </strong>
                    {lang === 'ga' ? sec.plainSummaryGa : sec.plainSummaryEn}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};
