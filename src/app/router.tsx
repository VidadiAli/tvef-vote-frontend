import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import ParticipantsPage from "../features/participants/ParticipantsPage";
import AdminCountriesPage from "../pages/AdminCountriesPage";
import AdminParticipantsPage from "../pages/AdminParticipantsPage";
import AdminLayout from "../components/layout/AdminLayout";
import TeleUsers from "../pages/TeleUsers";
import TeleVotes from "../pages/TeleVotes";
import LoginPage from "../pages/LoginPage";

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
      {
        path: "teleusers",
        element: <TeleUsers />,
      },
    ],
  },
  {
    path: "televotes",
    element: <TeleVotes />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
],
  {
    basename: "/",
  }
);