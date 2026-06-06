"use client";

import { useState } from 'react';

interface Props {
  startYear: number;
  endYear: number;
  onApply: (start: number, end: number) => void;
  disabled?: boolean;
}

export default function DateRangeFilter({ startYear, endYear, onApply, disabled = false }: Props) {
  const [start, setStart] = useState(startYear);
  const [end, setEnd] = useState(endYear);

  // Generate an array of years from 2000 to 2024 (latest available data)
  const startLimit = 2000;
  const endLimit = 2024;
  const years = Array.from(new Array(endLimit - startLimit + 1), (val, index) => startLimit + index).reverse();

  const handleApply = () => {
    if (start <= end) {
      onApply(start, end);
    } else {
      alert('Tahun awal harus lebih kecil atau sama dengan tahun akhir.');
    }
  };

  return (
    <div className="inline-flex flex-row items-center gap-1 sm:gap-2 p-1 bg-white border border-slate-200 rounded-full shadow-sm hover:border-slate-300 transition-all duration-200 max-w-full">
      {/* Start Year Dropdown */}
      <div className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 hover:bg-slate-50 rounded-full transition-all duration-150 group">
        <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-slate-400 uppercase select-none">Dari</span>
        <div className="relative w-fit">
          <select
            id="startYear"
            value={start}
            onChange={(e) => setStart(Number(e.target.value))}
            className="appearance-none bg-transparent pl-1 pr-5 py-0.5 text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer leading-tight w-fit min-w-[60px]"
            disabled={disabled}
          >
            {years.map(y => (
              <option key={`start-${y}`} value={y} className="bg-white text-slate-900">{y}</option>
            ))}
          </select>
          <div className="absolute right-0.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-slate-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Separator / Divider */}
      <div className="h-4 w-[1px] bg-slate-200"></div>

      {/* End Year Dropdown */}
      <div className="flex items-center gap-1.5 pl-2 pr-2 py-1.5 hover:bg-slate-50 rounded-full transition-all duration-150 group">
        <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-slate-400 uppercase select-none">Sampai</span>
        <div className="relative w-fit">
          <select
            id="endYear"
            value={end}
            onChange={(e) => setEnd(Number(e.target.value))}
            className="appearance-none bg-transparent pl-1 pr-5 py-0.5 text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer leading-tight w-fit min-w-[60px]"
            disabled={disabled}
          >
            {years.map(y => (
              <option key={`end-${y}`} value={y} className="bg-white text-slate-900">{y}</option>
            ))}
          </select>
          <div className="absolute right-0.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-slate-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
      </div>

      {/* Apply Button */}
      <button 
        onClick={handleApply} 
        className="px-4 sm:px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-full shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 whitespace-nowrap"
        disabled={disabled || start > end}
      >
        Terapkan
      </button>
    </div>
  );
}
