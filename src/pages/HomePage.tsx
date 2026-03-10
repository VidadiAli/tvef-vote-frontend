import { useEffect, useMemo, useState } from "react";
import { fetchCountries, setSelectedCountryId } from "../features/countries/countriesSlice";
import { setSelectedSemiFinal } from "../features/voting/votingSlice";
import { showResponse } from "../features/ui/uiSlice";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { semiFinalOptions, votingPoints } from "../utils/constants";
import { api } from "../services/axios";
import type { Country } from "../types/country";
import type { Participant } from "../types/participant";
import { MyResult } from "./myResult";

const getYoutubeEmbedUrl = (url?: string) => {
  if (!url) return "";

  try {
    const normalMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/
    );

    if (normalMatch?.[1]) {
      return `https://www.youtube.com/embed/${normalMatch[1]}`;
    }

    return url;
  } catch {
    return "";
  }
};

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { items, loading, selectedCountryId } = useAppSelector(
    (state) => state.countries
  );
  const { selectedSemiFinal, edition } = useAppSelector(
    (state) => state.voting
  );

  const [started, setStarted] = useState(false);
  const [loadingVoteData, setLoadingVoteData] = useState(false);
  const [submittingVotes, setSubmittingVotes] = useState(false);
  const [myCountry, setMyCountry] = useState<Participant | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedVotes, setSelectedVotes] = useState<Record<string, number>>({});
  const [showMyResult, setShowMyResult] = useState<boolean>(false)

  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  const startVoting = async () => {
    if (!selectedCountryId || !selectedSemiFinal) {
      dispatch(
        showResponse({
          open: true,
          type: "error",
          title: "Seçim tamam deyil",
          message: "Ölkə və semifinal seçilməlidir",
        })
      );
      return;
    }

    try {
      setLoadingVoteData(true);

      const payload = {
        edition,
        semiFinal: selectedSemiFinal,
      };

      const [myRes, otherRes] = await Promise.all([
        api.post(`/participant/getMyCountry/${selectedCountryId}`, payload),
        api.post(`/participant/getOtherParticipant/${selectedCountryId}`, payload),
      ]);

      setMyCountry(myRes?.data || null);
      setParticipants(otherRes?.data || []);
      setSelectedVotes({});
      setStarted(true);
    } catch (error: any) {
      dispatch(
        showResponse({
          open: true,
          type: "error",
          title: "Xəta",
          message:
            error?.response?.data?.message ||
            "Səsvermə məlumatları gətirilə bilmədi",
        })
      );
    } finally {
      setLoadingVoteData(false);
    }
  };

  const usedPoints = useMemo(() => {
    return Object.values(selectedVotes);
  }, [selectedVotes]);

  const getAvailablePoints = (participantId: string) => {
    const currentValue = selectedVotes[participantId];

    return votingPoints.filter((point) => {
      if (point === currentValue) return true;
      return !usedPoints.includes(point);
    });
  };

  const changePoint = (participantId: string, pointValue: string) => {
    const numericPoint = Number(pointValue);

    setSelectedVotes((prev) => ({
      ...prev,
      [participantId]: numericPoint,
    }));
  };

  const selectedCountryName =
    items.find((c: Country) => c._id === selectedCountryId)?.countryName || "";

  const allParticipantsScored =
    participants.length > 0 &&
    participants.every((item) => Boolean(selectedVotes[item._id]));

  const submitVotes = async () => {
    if (!allParticipantsScored) {
      dispatch(
        showResponse({
          open: true,
          type: "error",
          title: "Tam deyil",
          message: "Bütün iştirakçılara bal verilməlidir",
        })
      );
      return;
    }

    try {
      setSubmittingVotes(true);

      const receivedCountries = participants.map((item) => {
        const countryId =
          typeof item.country === "string" ? item.country : item.country._id;

        return {
          country: countryId,
          point: selectedVotes[item._id],
        };
      });

      await api.post("/juryVotes/addJuryVotes", {
        juryCountry: selectedCountryId,
        receivedCountries,
        edition,
        semiFinal: selectedSemiFinal,
      });

      dispatch(
        showResponse({
          open: true,
          type: "success",
          title: "Uğurlu",
          message: "Səsvermə uğurla göndərildi",
        })
      );

      setSelectedVotes({});
      setStarted(false);
      setParticipants([]);
      setMyCountry(null);
    } catch (error: any) {
      dispatch(
        showResponse({
          open: true,
          type: "error",
          title: "Xəta",
          message: error?.response?.data?.message || "Səsvermə göndərilmədi",
        })
      );
    } finally {
      setSubmittingVotes(false);
      setShowMyResult(false)
    }
  };

  const clearData = () => {
    setSelectedVotes({});
    setShowMyResult(false)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-[94%] max-w-7xl flex-col gap-6 py-8">
        <div className="rounded-3xl bg-gradient-to-r from-violet-600 to-cyan-500 p-6 text-white shadow-lg">
          <h1 className="text-2xl font-bold md:text-4xl">Eurofans Vote</h1>
          <p className="mt-2 text-sm text-white/90 md:text-base">
            Ölkəni seç, semifinalı təyin et və balları paylaş.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-5 shadow">
            <h2 className="text-lg font-semibold text-slate-800">1. Ölkəni seç</h2>
            <p className="mt-1 text-sm text-slate-500">
              Öz ölkəni seçmədən səsvermə hissəsi açılmır.
            </p>

            <select
              className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-400"
              value={selectedCountryId}
              onChange={(e) => { dispatch(setSelectedCountryId(e.target.value)), setStarted(false) }}
            >
              <option value="">Ölkə seç</option>
              {items.map((country: Country) => (
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
            <h2 className="text-lg font-semibold text-slate-800">2. Heat seç</h2>

            <p className="mt-1 text-sm text-slate-500">
              İştirak etdiyin contesti seç
            </p>
            <select
              className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-400"
              value={selectedSemiFinal}
              onChange={(e) => { dispatch(setSelectedSemiFinal(e.target.value)), setStarted(false) }}
            >
              <option value="">
                Heat
              </option>
              {semiFinalOptions.map((semi) => (
                semi.value == 's2' && (
                  <option key={semi.value} value={semi.value}>
                    {semi.label}
                  </option>
                )
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">3. Səsvermə</h2>
              <p className="mt-2 text-sm text-slate-500">
                Ölkə və semifinal seçildikdən sonra "Başla" düyməsi ilə iştirakçılar yüklənəcək.
              </p>
            </div>

            <button
              onClick={startVoting}
              disabled={loadingVoteData}
              className="rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:opacity-60"
            >
              {loadingVoteData ? "Yüklənir..." : "Başla"}
            </button>
          </div>
        </div>

        {started && (
          <div className="grid gap-4 xl:grid-cols-[320px_1fr]">
            <div className="rounded-2xl bg-white p-5 shadow">
              <h3 className="text-lg font-semibold text-slate-800">
                Seçilmiş məlumat
              </h3>

              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="rounded-xl bg-slate-50 p-3">
                  <span className="font-semibold text-slate-800">Ölkə:</span>{" "}
                  {selectedCountryName}
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  <span className="font-semibold text-slate-800">Semi Final:</span>{" "}
                  {selectedSemiFinal}
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  <span className="font-semibold text-slate-800">Edition:</span>{" "}
                  {edition}
                </div>
              </div>

              {myCountry && typeof myCountry.country !== "string" && (
                <div className="mt-5 rounded-2xl border border-slate-200 p-4">
                  <img
                    src={myCountry.country.countryImageUrl}
                    alt={myCountry.country.countryName}
                    className="h-28 w-full rounded-xl object-cover"
                  />
                  <h4 className="mt-3 text-base font-semibold text-slate-800">
                    {myCountry.country.countryName}
                  </h4>
                  <p className="mt-1 text-sm text-slate-600">
                    {myCountry.participantName}
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-2xl bg-white p-5 shadow">
              <h3 className="text-lg font-semibold text-slate-800">
                İştirakçılar
              </h3>

              {participants.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">
                  Bu seçim üçün iştirakçı tapılmadı.
                </p>
              ) : (
                <div>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {participants.map((item) => {
                      const countryObj = item.country;

                      const embedUrl = getYoutubeEmbedUrl(item.youtubeLink);

                      return (
                        <div
                          key={item._id}
                          className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                        >
                          <div className="flex items-center gap-3">
                            {countryObj?.countryImageUrl && (
                              <img
                                src={countryObj.countryImageUrl}
                                alt={countryObj.countryName}
                                className="h-12 w-16 rounded-lg object-cover"
                              />
                            )}

                            <div>
                              <p className="text-sm font-semibold text-slate-800">
                                {countryObj?.countryName || "Country"}
                              </p>
                              <p className="text-sm text-slate-600">
                                {item.participantName}
                              </p>
                            </div>
                          </div>

                          {item.hasYoutubeLink && embedUrl && (
                            <div className="mt-4 overflow-hidden rounded-xl">
                              <iframe
                                className="h-52 w-full"
                                src={embedUrl}
                                title={item.participantName}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          )}

                          <div className="mt-4">
                            <label className="mb-3 block text-sm font-medium text-slate-700">
                              Bal seç
                            </label>

                            <div className="flex flex-wrap gap-2">
                              {getAvailablePoints(item._id).map((point) => {
                                const isActive = selectedVotes[item._id] === point;

                                return (
                                  <button
                                    key={point}
                                    type="button"
                                    onClick={() => changePoint(item._id, String(point))}
                                    className={`min-w-[52px] rounded-full px-4 py-2 text-sm font-semibold transition duration-200 ${isActive
                                      ? "scale-105 bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-lg"
                                      : "bg-white text-slate-700 ring-1 ring-slate-200 hover:-translate-y-0.5 hover:bg-slate-100"
                                      }`}
                                  >
                                    {point}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-slate-500">
                      {allParticipantsScored
                        ? "Bütün ballar təyin olunub, səsverməni göndərə bilərsən."
                        : "Düymənin aktiv olması üçün bütün iştirakçılara bal verilməlidir."}
                    </p>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={clearData}
                        className="rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Təmizlə
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowMyResult(true)}
                        disabled={!allParticipantsScored || submittingVotes}
                        className="rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {submittingVotes ? "Göndərilir..." : "Göndər"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {
        showMyResult && (
          <MyResult submitVotes={submitVotes} clearData={clearData} selectedVotes={selectedVotes} participants={participants} />
        )
      }
    </div>
  );
}