import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import '@/index.css';

// Pages
import Home from '@/components/pages/Home';
import Write from '@/components/pages/Write';
import StoryDetail from '@/components/pages/StoryDetail';
import Profile from '@/components/pages/Profile';
import Settings from '@/components/pages/Settings';
import Search from '@/components/pages/Search';
import TagDetail from '@/components/pages/TagDetail';
import Bookmarks from '@/components/pages/Bookmarks';
import Analytics from '@/components/pages/Analytics';
import NotFound from '@/components/pages/NotFound';

// Components
import Layout from '@/components/organisms/Layout';

// Store (placeholder - will be created if Redux is implemented)
const store = {
  getState: () => ({}),
  dispatch: () => {},
  subscribe: () => () => {},
  replaceReducer: () => {}
};

// Theme Provider Component
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = React.useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  return children;
};

// App Routes
const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="write" element={<Write />} />
      <Route path="story/:id" element={<StoryDetail />} />
      <Route path="profile/:username" element={<Profile />} />
      <Route path="settings" element={<Settings />} />
      <Route path="search" element={<Search />} />
      <Route path="tag/:tag" element={<TagDetail />} />
      <Route path="bookmarks" element={<Bookmarks />} />
      <Route path="analytics" element={<Analytics />} />
      <Route path="404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Route>
  </Routes>
);

// Main App Component
const App = () => (
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <AppRoutes />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// Render app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);