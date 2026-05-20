import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import MixSearchPage from "../pages/MixSearch";
import MediaInsightPage from "../pages/MediaInsight";
import MyBookmarksPage from "../pages/MixSearch/MyBookmarks";
import MmmCreatePage from "../pages/MarketingMixModel/MmmCreatePage";
import MmmMyModelsPage from "../pages/MarketingMixModel/MmmMyModelsPage";
import MmmDetailPage from "../pages/MarketingMixModel/MmmDetailPage";
import LoginPage from "../pages/Login/LoginPage";
import PrivateRoute from "./PrivateRoute";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/mix-search" replace />} />
            <Route path="/mix-search" element={<MixSearchPage />} />
            <Route path="/my-bookmarks" element={<MyBookmarksPage />} />
            <Route path="/media-insight" element={<MediaInsightPage />} />
            <Route path="/mmm/create" element={<MmmCreatePage />} />
            <Route path="/mmm/my-mmm" element={<MmmMyModelsPage />} />
            <Route path="/mmm/my-mmm/:model_id" element={<MmmDetailPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
