import { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { getMyProfile } from "../../features/admin/adminSlice";
import MainPageLoadings from "../../loadings/MainPageLoadings";

export default function AdminLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { profile, loading, checked } = useAppSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getMyProfile());
  }, [dispatch]);

  useEffect(() => {
    if (checked && !profile) {
      navigate("/login", { replace: true });
    }
  }, [checked, profile, navigate]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-xl px-4 py-3 font-medium transition ${isActive
      ? "bg-violet-600 text-white"
      : "bg-white text-slate-700 hover:bg-slate-100"
    }`;

  if (loading || !checked) {
    return (
      <MainPageLoadings />
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto grid min-h-screen w-[96%] max-w-7xl gap-4 py-4 md:grid-cols-[240px_1fr]">
        <aside className="rounded-3xl bg-slate-900 p-4 text-white shadow-lg">
          <h2 className="mb-6 text-xl font-bold">Admin Panel</h2>

          <div className="flex flex-col gap-3">
            <NavLink to="/" className={linkClass}>
              Back main page
            </NavLink>
            <NavLink to="/admin/countries" className={linkClass}>
              Countries
            </NavLink>
            <NavLink to="/admin/participants" className={linkClass}>
              Participants
            </NavLink>
            <NavLink to="/admin/teleusers" className={linkClass}>
              Tele Users
            </NavLink>
          </div>
        </aside>

        <main className="rounded-3xl bg-white p-5 shadow-lg">
          <Outlet />
        </main>
      </div>
    </div>
  );
}