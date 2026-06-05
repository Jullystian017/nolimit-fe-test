export interface PopulationData {
  date: string;
  value: number;
}

export async function fetchPopulationData(startYear: number, endYear: number): Promise<PopulationData[]> {
  try {
    const res = await fetch(
      `https://api.worldbank.org/v2/country/US/indicator/SP.POP.TOTL?date=${startYear}:${endYear}&format=json`
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch population data: ${res.status}`);
    }
    const data = await res.json();
    
    // World Bank API returns an array where the second element is the actual data array
    if (Array.isArray(data) && data.length > 1 && Array.isArray(data[1])) {
      // The API returns data in descending order of year, let's reverse it to ascending for charts
      const rawData = data[1];
      const parsedData: PopulationData[] = rawData
        .filter((item: any) => item.value !== null)
        .map((item: any) => ({
          date: item.date,
          value: item.value,
        }))
        .sort((a: PopulationData, b: PopulationData) => parseInt(a.date) - parseInt(b.date));
        
      return parsedData;
    }
    return [];
  } catch (error) {
    console.error("Error fetching population data:", error);
    return [];
  }
}
