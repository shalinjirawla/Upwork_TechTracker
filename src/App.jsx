import React, { useState, useEffect } from 'react';
import { AppNavbar } from './components/Navbar.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { LoginModal } from './components/LoginModal.jsx';
import { api } from './api/client.js';

export const App = () => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('techpulse_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [connection, setConnection] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncTrigger, setSyncTrigger] = useState(0);

  const loadConnection = async () => {
    try {
      const res = await api.getUpworkStatus();
      setConnection(res.connection);
    } catch (e) {
      console.error('Failed to load Upwork connection:', e);
    }
  };

  const checkAuthSession = async () => {
    // Check if returning from live Upwork OAuth redirect
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      try {
        const res = await api.loginWithUpwork({ code });
        setUser(res.user);
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      } catch (e) {
        console.error('Failed to exchange Upwork OAuth code:', e);
      }
    }

    // Verify token with backend
    const token = localStorage.getItem('techpulse_token');
    if (token) {
      try {
        const me = await api.getMe();
        if (me.authenticated && me.user) {
          setUser(me.user);
          localStorage.setItem('techpulse_user', JSON.stringify(me.user));
        }
      } catch {
        console.warn('Session expired or offline.');
      }
    }
  };

  useEffect(() => {
    loadConnection();
    checkAuthSession();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await api.syncUpworkJobs();
      setSyncTrigger(prev => prev + 1);
      await loadConnection();
    } catch (e) {
      console.error('Sync error:', e);
    } finally {
      setSyncing(false);
    }
  };

  const handleLoginSuccess = async (loggedInUser) => {
    setUser(loggedInUser);
    localStorage.setItem('techpulse_user', JSON.stringify(loggedInUser));
    await loadConnection();
    setSyncTrigger(prev => prev + 1);
  };

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
    localStorage.removeItem('techpulse_user');
    await loadConnection();
    setSyncTrigger(prev => prev + 1);
  };

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: '#f8fafc' }}>
      <AppNavbar
        connection={connection}
        user={user}
        syncing={syncing}
        onSync={handleSync}
        onOpenLoginModal={() => setShowLoginModal(true)}
        onLogout={handleLogout}
      />

      <main className="flex-grow-1">
        <DashboardPage
          onOpenLoginModal={() => setShowLoginModal(true)}
          user={user}
          syncTrigger={syncTrigger}
        />
      </main>

      <footer className="py-3 border-top bg-white text-center text-muted" style={{ fontSize: '0.8rem' }}>
        <div className="container">
          <span>NCoreSoft TechTracker &copy; 2026 NCoreSoft · Real-time market demand tracking from official Upwork syndication and client job postings.</span>
        </div>
      </footer>

      {/* User Login Modal */}
      <LoginModal
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default App;
