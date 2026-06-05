"use client";

import { useState } from 'react';
import styles from './Dashboard.module.css';

interface Props {
  startYear: number;
  endYear: number;
  onApply: (start: number, end: number) => void;
  disabled?: boolean;
}

export default function DateRangeFilter({ startYear, endYear, onApply, disabled = false }: Props) {
  const [start, setStart] = useState(startYear);
  const [end, setEnd] = useState(endYear);

  // Generate an array of years from 1960 to current year
  const currentYear = new Date().getFullYear();
  const years = Array.from(new Array(currentYear - 1960 + 1), (val, index) => 1960 + index).reverse();

  const handleApply = () => {
    if (start <= end) {
      onApply(start, end);
    } else {
      alert('Start year must be less than or equal to End year.');
    }
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterGroup}>
        <label htmlFor="startYear">Start Year:</label>
        <select
          id="startYear"
          value={start}
          onChange={(e) => setStart(Number(e.target.value))}
          className={styles.select}
          disabled={disabled}
        >
          {years.map(y => (
            <option key={`start-${y}`} value={y}>{y}</option>
          ))}
        </select>
      </div>
      
      <div className={styles.filterGroup}>
        <label htmlFor="endYear">End Year:</label>
        <select
          id="endYear"
          value={end}
          onChange={(e) => setEnd(Number(e.target.value))}
          className={styles.select}
          disabled={disabled}
        >
          {years.map(y => (
            <option key={`end-${y}`} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <button 
        onClick={handleApply} 
        className={styles.applyButton}
        disabled={disabled || start > end}
      >
        Apply Filter
      </button>
    </div>
  );
}
