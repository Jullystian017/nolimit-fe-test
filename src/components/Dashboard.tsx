"use client";

import { useEffect, useState } from 'react';
import DateRangeFilter from './DateRangeFilter';
import PopulationLineChart from './PopulationLineChart';
import PopulationPieChart from './PopulationPieChart';
import { fetchPopulationData, PopulationData } from '@/lib/api';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const [startYear, setStartYear] = useState(2012);
  const [endYear, setEndYear] = useState(2016);
  const [data, setData] = useState<PopulationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async (start: number, end: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchPopulationData(start, end);
      if (result.length === 0) {
        setError('No data found for the selected range.');
      }
      setData(result);
    } catch (err) {
      setError('Failed to fetch data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(startYear, endYear);
  }, []);

  const handleApplyFilter = (start: number, end: number) => {
    setStartYear(start);
    setEndYear(end);
    loadData(start, end);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className="title-gradient">US Population Dashboard</h1>
        <p>Interactive visualization of United States population data based on the World Bank API.</p>
      </div>

      <DateRangeFilter 
        startYear={startYear} 
        endYear={endYear} 
        onApply={handleApplyFilter}
        disabled={isLoading}
      />

      {error && <div className={styles.error}>{error}</div>}

      {isLoading ? (
        <div className={styles.loading}>Loading data...</div>
      ) : (
        <div className={styles.chartsGrid}>
          <div className={`${styles.chartCard} glass-panel`}>
            <div className={styles.chartContainer}>
              <PopulationLineChart data={data} />
            </div>
          </div>
          <div className={`${styles.chartCard} glass-panel`}>
            <div className={styles.chartContainer}>
              <PopulationPieChart data={data} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
