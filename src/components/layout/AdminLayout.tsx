import { NavLink, Outlet } from "react-router-dom";

export default function AdminLayout() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-xl px-4 py-3 font-medium transition ${
      isActive
        ? "bg-violet-600 text-white"
        : "bg-white text-slate-700 hover:bg-slate-100"
    }`;

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto grid min-h-screen w-[96%] max-w-7xl gap-4 py-4 md:grid-cols-[240px_1fr]">
        <aside className="rounded-3xl bg-slate-900 p-4 text-white shadow-lg">
          <h2 className="mb-6 text-xl font-bold">Admin Panel</h2>

          <div className="flex flex-col gap-3">
            <NavLink to="/admin/countries" className={linkClass}>
              Countries
            </NavLink>
            <NavLink to="/admin/participants" className={linkClass}>
              Participants
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