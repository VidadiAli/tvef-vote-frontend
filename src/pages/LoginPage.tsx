import { useState } from "react";
import { useAppDispatch } from "../hooks/redux";
import { showResponse } from "../features/ui/uiSlice";
import { api } from "../services/axios";

const LoginPage = () => {
  const dispatch = useAppDispatch();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userName.trim() || !password.trim()) {
      dispatch(
        showResponse({
          open: true,
          type: "error",
          title: "Xəta",
          message: "Bütün xanaları doldur",
        })
      );
      return;
    }

    try {
      setLoading(true);

      await api.post("/loginAsAdmin", {
        username: userName.trim(),
        password: password.trim(),
      });

      dispatch(
        showResponse({
          open: true,
          type: "success",
          title: "Uğurlu",
          message: "Giriş edildi",
        })
      );

      window.location.href = "/admin/countries";
    } catch (error: any) {
      dispatch(
        showResponse({
          open: true,
          type: "error",
          title: "Xəta",
          message: error?.response?.data?.message || "Giriş alınmadı",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-lg md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Admin Login</h1>
          <p className="mt-2 text-sm text-slate-500">
            Panelə daxil olmaq üçün məlumatlarını yaz
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              User name
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="User name"
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-violet-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-violet-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center rounded-2xl bg-violet-600 text-sm font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Yüklənir..." : "Daxil ol"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;