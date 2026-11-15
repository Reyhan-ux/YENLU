import { Component, useEffect } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';

/** Global error boundary to prevent blank white screens */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('YENLU Caught Error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-[#EEF5F0] text-[#0F2A1D]">
          <div className="max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-red-600 mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-600 mb-4">
              {this.state.error?.message || 'An unexpected rendering error occurred.'}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  try { localStorage.clear(); } catch (e) { }
                  window.location.href = '/';
                }}
                className="rounded-full bg-[#0F2A1D] px-4 py-2 text-xs font-semibold text-white hover:opacity-90"
              >
                Clear Storage & Reload
              </button>
              <button
                onClick={() => window.location.reload()}
                className="rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/** Scroll to top whenever the route changes. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    try {
      window.scrollTo(0, 0);
    } catch (e) {
      // ignore
    }
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="about" element={<About />} />
          {/* Legacy route redirects to simplify to MVP */}
          <Route path="insights" element={<Navigate to="/" replace />} />
          <Route path="alerts" element={<Navigate to="/about" replace />} />
          <Route path="settings" element={<Navigate to="/about" replace />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}
