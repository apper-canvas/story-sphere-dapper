import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "@/components/organisms/Layout";

// Lazy load all page components
const Home = lazy(() => import("@/components/pages/Home"));
const Explore = lazy(() => import("@/components/pages/Explore"));
const Search = lazy(() => import("@/components/pages/Search"));
const Write = lazy(() => import("@/components/pages/Write"));
const Bookmarks = lazy(() => import("@/components/pages/Bookmarks"));
const Analytics = lazy(() => import("@/components/pages/Analytics"));
const Settings = lazy(() => import("@/components/pages/Settings"));
const Profile = lazy(() => import("@/components/pages/Profile"));
const StoryDetail = lazy(() => import("@/components/pages/StoryDetail"));
const TagDetail = lazy(() => import("@/components/pages/TagDetail"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

// Suspense wrapper component
const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading.....</div>}>
    {children}
  </Suspense>
);

// Define main routes
const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <SuspenseWrapper>
        <Home />
      </SuspenseWrapper>
    )
  },
  {
    path: "explore",
    element: (
      <SuspenseWrapper>
        <Explore />
      </SuspenseWrapper>
    )
  },
  {
    path: "search",
    element: (
      <SuspenseWrapper>
        <Search />
      </SuspenseWrapper>
    )
  },
  {
    path: "write",
    element: (
      <SuspenseWrapper>
        <Write />
      </SuspenseWrapper>
    )
  },
  {
    path: "bookmarks",
    element: (
      <SuspenseWrapper>
        <Bookmarks />
      </SuspenseWrapper>
    )
  },
  {
    path: "analytics",
    element: (
      <SuspenseWrapper>
        <Analytics />
      </SuspenseWrapper>
    )
  },
  {
    path: "settings",
    element: (
      <SuspenseWrapper>
        <Settings />
      </SuspenseWrapper>
    )
  },
  {
    path: "profile/:username",
    element: (
      <SuspenseWrapper>
        <Profile />
      </SuspenseWrapper>
    )
  },
  {
    path: "story/:id",
    element: (
      <SuspenseWrapper>
        <StoryDetail />
      </SuspenseWrapper>
    )
  },
  {
    path: "tag/:tagName",
    element: (
      <SuspenseWrapper>
        <TagDetail />
      </SuspenseWrapper>
    )
  },
  {
    path: "*",
    element: (
      <SuspenseWrapper>
        <NotFound />
      </SuspenseWrapper>
    )
  }
];

// Create router with Layout wrapper
const routes = [
  {
    path: "/",
    element: <Layout />,
    children: mainRoutes
  }
];

export const router = createBrowserRouter(routes);