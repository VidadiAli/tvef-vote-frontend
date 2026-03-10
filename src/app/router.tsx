import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import ParticipantsPage from "../features/participants/ParticipantsPage";
import AdminCountriesPage from "../pages/AdminCountriesPage";
import AdminParticipantsPage from "../pages/AdminParticipantsPage";
import AdminLayout from "../components/layout/AdminLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/participants",
    element: <ParticipantsPage />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "countries",
        element: <AdminCountriesPage />,
      },
      {
        path: "participants",
        element: <AdminParticipantsPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
],
  {
    basename: "/tvef-vote-frontend",
  }
);