import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import RequireAuth from './auth/RequireAuth';
import AppShell from './components/AppShell';
import Login from './pages/Login';
import Home from './pages/Home';
import Quick5 from './pages/Quick5';
import Qotd from './pages/Qotd';
import Progress from './pages/Progress';
import Leaderboard from './pages/Leaderboard';
import Practice from './pages/Practice';
import PracticeSession from './pages/PracticeSession';

// HashRouter: GitHub Pages has no SPA fallback, so /#/quick5 survives a refresh.
// Everything except /login sits behind RequireAuth (sign-in → reactivate → exam choice).
const App = () => (
  <AuthProvider>
    <HashRouter>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route element={<RequireAuth />}>
          <Route element={<AppShell />}>
            <Route index element={<Home />} />
            <Route path="quick5" element={<Quick5 />} />
            <Route path="qotd" element={<Qotd />} />
            <Route path="practice" element={<Practice />} />
            <Route path="practice/:subject" element={<PracticeSession />} />
            <Route path="progress" element={<Progress />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>
      </Routes>
    </HashRouter>
  </AuthProvider>
);

export default App;
