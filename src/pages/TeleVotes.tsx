import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { showResponse } from "../features/ui/uiSlice";
import {
  addTeleVote,
  getAllCountries,
  getTeleUsersForVotes,
} from "../features/teleVotes/teleVotesSlice";
import { semiFinalOptions } from "../utils/constants";
import type { SemiFinalType } from "../types/common";

type VoteRow = {
  teleCountry: string;
  voteCount: number;
};

const TOTAL_POINTS = 20;

const TeleVotes = () => {
  const dispatch = useAppDispatch();
  const { countries, teleUsers, loadingCountries, loadingTeleUsers, createLoading } =
    useAppSelector((state) => state.teleVotes);

  const [teleUser, setTeleUser] = useState("");
  const [semiFinal, setSemiFinal] = useState<SemiFinalType>("s1");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [voteCount, setVoteCount] = useState<number | "">(1);
  const [teleVotes, setTeleVotes] = useState<VoteRow[]>([]);

  useEffect(() => {
    dispatch(getAllCountries());
    dispatch(getTeleUsersForVotes());
  }, [dispatch]);

  const usedPoints = useMemo(
    () => teleVotes.reduce((acc, item) => acc + item.voteCount, 0),
    [teleVotes]
  );

  const remainingPoints = TOTAL_POINTS - usedPoints;

  const handleAddVoteRow = () => {
    if (!teleUser) {
      dispatch(
        showResponse({
          open: true,
          type: "error",
          title: "Xəta",
          message: "Tele user seçilməlidir",
        })
      );
      return;
    }

    if (!selectedCountry) {
      dispatch(
        showResponse({
          open: true,
          type: "error",
          title: "Xəta",
          message: "Ölkə seçilməlidir",
        })
      );
      return;
    }

    if (voteCount === "" || Number(voteCount) <= 0) {
      dispatch(
        showResponse({
          open: true,
          type: "error",
          title: "Xəta",
          message: "Bal 1-dən böyük olmalıdır",
        })
      );
      return;
    }

    const pointValue = Number(voteCount);

    const existing = teleVotes.find((item) => item.teleCountry === selectedCountry);
    const alreadyUsedForSameCountry = existing ? existing.voteCount : 0;
    const recalculatedUsed = usedPoints - alreadyUsedForSameCountry + pointValue;

    if (recalculatedUsed > TOTAL_POINTS) {
      dispatch(
        showResponse({
          open: true,
          type: "error",
          title: "Xəta",
          message: `Maksimum ${TOTAL_POINTS} bal istifadə edə bilərsən`,
        })
      );
      return;
    }

    if (existing) {
      setTeleVotes((prev) =>
        prev.map((item) =>
          item.teleCountry === selectedCountry
            ? { ...item, voteCount: pointValue }
            : item
        )
      );
    } else {
      setTeleVotes((prev) => [
        ...prev,
        { teleCountry: selectedCountry, voteCount: pointValue },
      ]);
    }

    setSelectedCountry("");
    setVoteCount(1);
  };

  const handleRemoveVoteRow = (countryId: string) => {
    setTeleVotes((prev) => prev.filter((item) => item.teleCountry !== countryId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!teleUser) {
      dispatch(
        showResponse({
          open: true,
          type: "error",
          title: "Xəta",
          message: "Tele user seçilməlidir",
        })
      );
      return;
    }

    if (teleVotes.length === 0) {
      dispatch(
        showResponse({
          open: true,
          type: "error",
          title: "Xəta",
          message: "Ən azı bir ölkə əlavə edilməlidir",
        })
      );
      return;
    }

    if (usedPoints > TOTAL_POINTS) {
      dispatch(
        showResponse({
          open: true,
          type: "error",
          title: "Xəta",
          message: `Toplam bal ${TOTAL_POINTS}-dən çox ola bilməz`,
        })
      );
      return;
    }

    const resultAction = await dispatch(
      addTeleVote({
        teleUser,
        teleVotes,
        edition: 11,
        semiFinal,
      })
    );

    if (addTeleVote.fulfilled.match(resultAction)) {
      setTeleUser("");
      setSemiFinal("s1");
      setSelectedCountry("");
      setVoteCount(1);
      setTeleVotes([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-900 md:text-2xl">
                Tele Vote əlavə et
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                User seç, ölkələrə bal ver və siyahını göndər
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-violet-50 px-4 py-2 text-sm text-violet-700">
                Toplam: {usedPoints} / {TOTAL_POINTS}
              </div>
              <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm text-slate-700">
                Qalan: {remainingPoints}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Tele user
                </label>
                <select
                  value={teleUser}
                  onChange={(e) => setTeleUser(e.target.value)}
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-violet-400"
                >
                  <option value="">
                    {loadingTeleUsers ? "Yüklənir..." : "Tele user seç"}
                  </option>
                  {teleUsers.map((item) => (
                    <option key={item._id} value={item.userName}>
                      {item.userName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Edition
                </label>
                <input
                  type="number"
                  value={11}
                  disabled
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 text-sm text-slate-500 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Semi final
                </label>
                <select
                  value={semiFinal}
                  onChange={(e) => setSemiFinal(e.target.value as SemiFinalType)}
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-violet-400"
                >
                  {semiFinalOptions.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-slate-900">
                  Ölkə əlavə et
                </h2>
                <span className="text-xs text-slate-500">
                  İstədiyin kimi bölüşdür, toplam 20-ni keçmə
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_160px_140px]">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Country
                  </label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-violet-400"
                  >
                    <option value="">
                      {loadingCountries ? "Yüklənir..." : "Ölkə seç"}
                    </option>
                    {countries.map((country) => (
                      <option key={country._id} value={country._id}>
                        {country.countryName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Bal
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={voteCount}
                    onChange={(e) =>
                      setVoteCount(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-violet-400"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleAddVoteRow}
                    className="h-11 w-full rounded-2xl bg-violet-600 text-sm font-medium text-white transition hover:bg-violet-700"
                  >
                    Siyahıya əlavə et
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white">
              <div className="border-b border-slate-200 px-4 py-4">
                <h2 className="text-base font-semibold text-slate-900">
                  Seçilən ölkələr
                </h2>
              </div>

              {teleVotes.length === 0 ? (
                <div className="px-4 py-10 text-center text-sm text-slate-500">
                  Hələ ölkə əlavə edilməyib
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {teleVotes.map((item) => {
                    const countryName =
                      countries.find((country) => country._id === item.teleCountry)?.countryName ||
                      item.teleCountry;

                    return (
                      <div
                        key={item.teleCountry}
                        className="flex items-center justify-between gap-3 px-4 py-4"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-800">
                            {countryName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {item.voteCount} bal
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveVoteRow(item.teleCountry)}
                          className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600 transition hover:bg-rose-100"
                        >
                          Sil
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={createLoading}
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-slate-900 px-6 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {createLoading ? "Göndərilir..." : "Tele vote göndər"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeleVotes;