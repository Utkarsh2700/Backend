import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Routes from "./routes/Routes.tsx";
import Login from "./pages/Login.tsx";
import SignUp from "./pages/SignUp.tsx";
import Videos from "./pages/Videos.tsx";
import VideoUpload from "./pages/VideoUpload.tsx";
// import { SidebarProvider } from "./contexts/SidebarContext.tsx";
import { ThemeContext } from "./contexts/ThemeContext.tsx";
import UserProfile from "./pages/UserProfile.tsx";
import EditProfile from "./pages/EditProfile.tsx";
import VideoWatch from "./pages/VideoWatch.tsx";
import SearchPage from "./pages/SearchPage.tsx";
import AuthRoute from "./routes/AuthRoute.tsx";
import ProtectedRoute from "./routes/ProtectedRoute.tsx";
const router = createBrowserRouter(
  createRoutesFromElements([
    <Route path="/" element={<Routes />}>
      <Route
        path="/videos"
        element={
          <ProtectedRoute>
            <Videos />
          </ProtectedRoute>
        }
      />
      <Route
        path="/videos/upload"
        element={
          <ProtectedRoute>
            <VideoUpload />
          </ProtectedRoute>
        }
      />
      <Route
        path="/@/:username"
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/channel/:userId/editing/profile"
        element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="video/watch/:videoId/:username"
        element={
          <ProtectedRoute>
            <VideoWatch />
          </ProtectedRoute>
        }
      />

      {/* Public Routes */}

      <Route
        path="/signup"
        element={
          <AuthRoute>
            <SignUp />
          </AuthRoute>
        }
      />
      <Route
        path="/login"
        element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        }
      />
      <Route path="/search" element={<SearchPage />} />
    </Route>,
  ])
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <SidebarProvider> */}
    {/* <AuthProvider> */}
    <ThemeContext defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router}>{/* <App /> */}</RouterProvider>
    </ThemeContext>
    {/* </AuthProvider> */}
    {/* </SidebarProvider> */}
  </React.StrictMode>
);
