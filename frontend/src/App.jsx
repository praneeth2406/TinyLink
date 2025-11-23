import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import StatsPage from './pages/StatsPage.jsx';
import Layout from './components/Layout.jsx';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/code/:code" element={<StatsPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
