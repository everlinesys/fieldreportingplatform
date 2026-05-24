import { Routes, Route } from "react-router-dom";

import Admin from "./pages/Admin";
import UploadPage from "./pages/UploadPage";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        }
      />

      <Route
        path="/upload/:token"
        element={<UploadPage />}
      />

      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
}