import Dashboard from '@/components/Dashboard';

export const metadata = {
  title: 'US Population Dashboard - Frontend Test',
  description: 'Interactive visualization of United States population data based on the World Bank API.',
};

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Dashboard />
    </main>
  );
}
