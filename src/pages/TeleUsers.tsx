import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  addTeleUser,
  getTeleUsers,
} from "../features/teleUsers/teleUsersSlice";
import { semiFinalOptions } from "../utils/constants";
import type { SemiFinalType } from "../types/common";

const TeleUsers = () => {
  const dispatch = useAppDispatch();
  const { users, loading, createLoading } = useAppSelector(
    (state) => state.teleUsers
  );

  const [userName, setUserName] = useState("");
  const [semiFinal, setSemiFinal] = useState<SemiFinalType>("s1");

  useEffect(() => {
    dispatch(getTeleUsers());
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName.trim()) return;

    dispatch(
      addTeleUser({
        userName: userName.trim(),
        semiFinal,
      })
    );

    setUserName("");
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="mx-auto max-w-5xl space-y-6">

        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Tele User əlavə et</h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 md:grid-cols-3"
          >
            <input
              type="text"
              placeholder="User name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="h-11 rounded-2xl border px-4 text-sm outline-none focus:border-violet-400"
            />

            <select
              value={semiFinal}
              onChange={(e) =>
                setSemiFinal(e.target.value as SemiFinalType)
              }
              className="h-11 rounded-2xl border px-4 text-sm outline-none focus:border-violet-400"
            >
              {semiFinalOptions.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>

            <button
              disabled={createLoading}
              className="h-11 rounded-2xl bg-violet-600 text-sm font-medium text-white transition hover:bg-violet-700 disabled:opacity-60"
            >
              {createLoading ? "Yüklənir..." : "Əlavə et"}
            </button>
          </form>
        </div>

        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">İstifadəçilər</h2>

          {loading ? (
            <p className="text-sm text-slate-500">Yüklənir...</p>
          ) : (
            <div className="space-y-3">
              {users.map((user: any) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {user.userName}
                    </p>
                    <p className="text-xs text-slate-500">
                      Edition: {user.edition}
                    </p>
                  </div>

                  <span className="rounded-full bg-violet-100 px-3 py-1 text-xs text-violet-700">
                    {
                      semiFinalOptions.find(
                        (s) => s.value === user.semiFinal
                      )?.label
                    }
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeleUsers;