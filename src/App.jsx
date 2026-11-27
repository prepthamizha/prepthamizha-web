import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell';
import Home from './pages/Home';
import Quick5 from './pages/Quick5';
import Qotd from './pages/Qotd';
import Progress from './pages/Progress';
import Leaderboard from './pages/Leaderboard';

// HashRouter: GitHub Pages has no SPA fallback, so /#/quick5 survives a refresh.
const App = () => (
  <HashRouter>
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Home />} />
        <Route path="quick5" element={<Quick5 />} />
        <Route path="qotd" element={<Qotd />} />
        <Route path="progress" element={<Progress />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  </HashRouter>
);

export default App;
