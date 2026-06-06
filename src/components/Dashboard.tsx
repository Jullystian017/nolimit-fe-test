"use client";

import { useEffect, useState } from 'react';
import DateRangeFilter from './DateRangeFilter';
import PopulationLineChart from './PopulationLineChart';
import PopulationPieChart from './PopulationPieChart';
import { fetchPopulationData, PopulationData } from '@/lib/api';

export default function Dashboard() {
  const [startYear, setStartYear] = useState(2012);
  const [endYear, setEndYear] = useState(2016);
  const [data, setData] = useState<PopulationData[]>([]);
  const [allData, setAllData] = useState<PopulationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async (start: number, end: number) => {
    setIsLoading(true);
    setError(null);

    // If we already have all data prefetched, filter it instantly!
    if (allData.length > 0) {
      const filtered = allData.filter(item => {
        const year = parseInt(item.date);
        return year >= start && year <= end;
      });
      if (filtered.length === 0) {
        setError('Tidak ada data yang ditemukan untuk rentang yang dipilih.');
      }
      setData(filtered);
      setIsLoading(false);
      return;
    }

    // Otherwise, fetch just the requested range so it's fast
    try {
      const result = await fetchPopulationData(start, end);
      if (result.length === 0) {
        setError('Tidak ada data yang ditemukan untuk rentang yang dipilih.');
      }
      setData(result);
    } catch (err) {
      setError('Gagal mengambil data.');
    } finally {
      setIsLoading(false);
    }
  };

  // Prefetch all data in the background
  const prefetchAllData = async () => {
    try {
      const currentYear = new Date().getFullYear();
      const result = await fetchPopulationData(1960, currentYear);
      if (result.length > 0) {
        setAllData(result);
      }
    } catch (err) {
      console.error("Gagal prefetch data:", err);
    }
  };

  useEffect(() => {
    // 1. Load initial small range fast
    loadData(startYear, endYear).then(() => {
      // 2. Prefetch all data silently in the background
      prefetchAllData();
    });
  }, []);

  const handleApplyFilter = (start: number, end: number) => {
    setStartYear(start);
    setEndYear(end);
    loadData(start, end);
  };

  const latestPop = data.length > 0 ? data[data.length - 1] : null;
  const oldestPop = data.length > 0 ? data[0] : null;
  const totalGrowth = latestPop && oldestPop ? latestPop.value - oldestPop.value : 0;
  const growthPercentage = latestPop && oldestPop ? (totalGrowth / oldestPop.value) * 100 : 0;
  const avgGrowth = data.length > 1 ? totalGrowth / (data.length - 1) : 0;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-50/50">
      {/* Aurora Background Deco */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] rounded-full bg-blue-400/10 blur-[100px] sm:blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute top-[20%] right-[-10%] w-[45vw] h-[45vw] max-w-[500px] rounded-full bg-indigo-400/10 blur-[100px] sm:blur-[130px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[40vw] h-[40vw] max-w-[450px] rounded-full bg-sky-300/10 blur-[80px] sm:blur-[100px] pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex flex-col gap-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto flex flex-col items-center">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Dashboard Populasi Amerika Serikat
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
            Analisis komparatif dan visualisasi interaktif data pertumbuhan populasi tahunan bersumber langsung dari database World Bank.
          </p>
        </div>

        {/* Date Filter */}
        <div className="flex justify-center w-full">
          <DateRangeFilter 
            startYear={startYear} 
            endYear={endYear} 
            onApply={handleApplyFilter}
            disabled={isLoading}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-xl bg-red-50 p-4 border border-red-200">
            <div className="text-sm text-red-700 text-center font-medium">{error}</div>
          </div>
        )}

        {/* Stats Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex items-center justify-between animate-pulse">
                <div className="space-y-3 w-full">
                  <div className="h-3 bg-slate-100 rounded w-1/3"></div>
                  <div className="h-8 bg-slate-200 rounded w-2/3"></div>
                  <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                </div>
                <div className="w-12 h-12 bg-slate-100 rounded-lg"></div>
              </div>
            ))
          ) : (
            <>
              {/* Stat 1: Latest Population */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex items-center justify-between hover:shadow-md hover:border-slate-300 transition-all duration-200">
                <div>
                  <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Populasi Terbaru ({latestPop?.date || ''})</p>
                  <h3 className="mt-2 text-2xl font-bold text-slate-900">
                    {latestPop ? new Intl.NumberFormat('id-ID').format(latestPop.value) : '-'}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">Jiwa penduduk terdaftar</p>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                  </svg>
                </div>
              </div>

              {/* Stat 2: Total Growth */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex items-center justify-between hover:shadow-md hover:border-slate-300 transition-all duration-200">
                <div>
                  <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Pertumbuhan Total</p>
                  <h3 className="mt-2 text-2xl font-bold text-slate-900">
                    +{new Intl.NumberFormat('id-ID').format(totalGrowth)}
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                      <polyline points="16 7 22 7 22 13" />
                    </svg>
                    {growthPercentage.toFixed(2)}% peningkatan
                  </p>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                    <polyline points="16 7 22 7 22 13" />
                  </svg>
                </div>
              </div>

              {/* Stat 3: Avg Annual Growth */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex items-center justify-between hover:shadow-md hover:border-slate-300 transition-all duration-200">
                <div>
                  <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Rata-rata Pertumbuhan</p>
                  <h3 className="mt-2 text-2xl font-bold text-slate-900">
                    +{new Intl.NumberFormat('id-ID').format(Math.round(avgGrowth))}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">Jiwa penduduk per tahun</p>
                </div>
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Main Charts Section */}
        {isLoading ? (
          <div className="flex flex-col justify-center items-center min-h-[400px] bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
            <div className="relative flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
            </div>
            <span className="mt-4 text-sm font-semibold text-slate-500">Menghubungkan ke API World Bank...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Line Chart Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-[420px] sm:h-[500px] flex flex-col hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4 flex-shrink-0">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Pertumbuhan Populasi AS</h3>
                  <p className="text-xs text-slate-500">Tren grafik garis pertumbuhan tahun-ke-tahun</p>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                    <polyline points="16 7 22 7 22 13" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-h-0 w-full relative">
                <PopulationLineChart data={data} />
              </div>
            </div>

            {/* Pie Chart Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 h-[420px] sm:h-[500px] flex flex-col hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4 flex-shrink-0">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Proporsi Distribusi Populasi</h3>
                  <p className="text-xs text-slate-500">Perbandingan kontribusi nilai populasi per tahun</p>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-h-0 w-full relative">
                <PopulationPieChart data={data} />
              </div>
            </div>
          </div>
        )}

        {/* Footer / Meta Data Source */}
        <div className="text-center pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-400 font-medium">
            Sumber Data: <a href="https://data.worldbank.org/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 transition-colors underline">World Bank Open Data</a> • © Jullystian Pratama 2026
          </p>
        </div>
      </div>
    </div>
  );
}
