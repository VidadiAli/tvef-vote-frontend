import { useEffect } from "react";
import { fetchCountries, setSelectedCountryId } from "../features/countries/countriesSlice";
import { setSelectedSemiFinal } from "../features/voting/votingSlice";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { semiFinalOptions } from "../utils/constants";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { items, loading, selectedCountryId } = useAppSelector((state) => state.countries);
  const { selectedSemiFinal, edition } = useAppSelector((state) => state.voting);

  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-[94%] max-w-6xl flex-col gap-6 py-8">
        <div className="rounded-3xl bg-gradient-to-r from-violet-600 to-cyan-500 p-6 text-white shadow-lg">
          <h1 className="text-2xl font-bold md:text-4xl">Eurofans Vote</h1>
          <p className="mt-2 text-sm text-white/90 md:text-base">
            Ölkəni seç, semifinalı təyin et və balları paylaş.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-5 shadow">
            <h2 className="text-lg font-semibold text-slate-800">1. Ölkəni seç</h2>
            <p className="mt-1 text-sm text-slate-500">
              Öz ölkəni seçmədən səsvermə hissəsi açılmır.
            </p>

            <select
              className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-400"
              value={selectedCountryId}
              onChange={(e) => dispatch(setSelectedCountryId(e.target.value))}
            >
              <option value="">Ölkə seç</option>
              {items.map((country) => (
                <option key={country._id} value={country._id}>
                  {country.countryName}
                </option>
              ))}
            </select>

            {loading && (
              <p className="mt-3 text-sm text-slate-500">Ölkələr yüklənir...</p>
            )}
          </div>

          <div className="rounded-2xl bg-white p-5 shadow">
            <h2 className="text-lg font-semibold text-slate-800">2. Semi Final seç</h2>
            <p className="mt-1 text-sm text-slate-500">
              Edition avtomatik {edition} olaraq gedəcək.
            </p>

            <select
              className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-400"
              value={selectedSemiFinal}
              onChange={(e) => dispatch(setSelectedSemiFinal(e.target.value))}
            >
              {semiFinalOptions.map((semi) => (
                <option key={semi.value} value={semi.value}>
                  {semi.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow">
          <h2 className="text-lg font-semibold text-slate-800">3. Səsvermə</h2>
          <p className="mt-2 text-sm text-slate-500">
            Növbəti addımda seçilən ölkə və semifinala görə iştirakçılar gələcək.
          </p>
        </div>
      </div>
    </div>
  );
}