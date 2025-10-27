import '@/index.css';
import React, { useEffect, useState, lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { router } from "@/router";
import { ToastContainer } from "react-toastify";
import NotFound from "@/components/pages/NotFound";
import Home from "@/components/pages/Home";
import Write from "@/components/pages/Write";
import Settings from "@/components/pages/Settings";
import Profile from "@/components/pages/Profile";
import Bookmarks from "@/components/pages/Bookmarks";
import TagDetail from "@/components/pages/TagDetail";
import Analytics from "@/components/pages/Analytics";
import Search from "@/components/pages/Search";
import StoryDetail from "@/components/pages/StoryDetail";
import Layout from "@/components/organisms/Layout";

// Pages

const Explore = lazy(() => import('@/components/pages/Explore'));

// Components

// Store (placeholder - will be created if Redux is implemented)
// Configure Redux store
const store = configureStore({
  reducer: {
    // Add reducers here as needed
  }
});

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
      <Route path="explore" element={
        <Suspense fallback={<div>Loading.....</div>}>
          <Explore />
        </Suspense>
      } />
      <Route path="404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Route>
  </Routes>
);

// Main App Component
const App = () => (
  <React.StrictMode>
<Provider store={store}>
      <ThemeProvider>
        <RouterProvider router={router} />
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
    </Provider>
  </React.StrictMode>
);

// Render app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);