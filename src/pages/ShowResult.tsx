import type { Participant } from "../types/participant";

type MyResultProps = {
  submitVotes: () => Promise<void>;
  clearData: () => void;
  selectedVotes: Record<string, number>;
  participants: Participant[];
};

export const ShowResult = ({
  submitVotes,
  clearData,
  selectedVotes,
  participants,
}: MyResultProps) => {
  const filteredParticipants = participants
    .filter((item) => selectedVotes[item._id] !== undefined)
    .sort((a, b) => selectedVotes[b._id] - selectedVotes[a._id]);

  if (!filteredParticipants.length) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-3 backdrop-blur-sm sm:p-4">
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:rounded-3xl">
        <div className="bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-4 text-white sm:px-6 sm:py-5">
          <h2 className="text-lg font-bold sm:text-xl md:text-2xl">
            Səsvermə Nəticəsi
          </h2>
          <p className="mt-1 text-xs text-white/90 sm:text-sm">
            Seçilmiş ballar aşağıdakı kimi görünür.
          </p>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-3 py-4 sm:px-5 sm:py-5">
          <div className="grid gap-3 sm:gap-4">
            {filteredParticipants.map((item) => {
              const countryObj =
                typeof item.country === "string" ? null : item.country;

              const point = selectedVotes[item._id];

              return (
                <div
                  key={item._id}
                  className="flex flex-row gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 items-center justify-between shadow-sm md:flex-row md:items-center md:p-4"
                >
                  <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                    {countryObj?.countryImageUrl ? (
                      <img
                        src={countryObj.countryImageUrl}
                        alt={countryObj.countryName}
                        className="h-12 w-16 shrink-0 rounded-lg object-cover shadow-sm sm:h-14 sm:w-20 sm:rounded-xl"
                      />
                    ) : (
                      <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-[10px] text-slate-500 sm:h-14 sm:w-20 sm:rounded-xl sm:text-xs">
                        No image
                      </div>
                    )}

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-slate-800 sm:text-base">
                        {countryObj?.countryName || "Country"}
                      </h3>
                      <p className="truncate text-xs text-slate-600 sm:text-sm">
                        {item.participantName}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-start sm:justify-end">
                    <div className="flex h-10 min-w-[50px] items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-4 text-base font-bold text-white shadow-md sm:h-14 sm:min-w-[60px] sm:rounded-xl sm:px-3 sm:text-lg">
                      {point}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 bg-white px-3 py-4 sm:px-6 sm:py-5 md:flex-row md:justify-end">
          <button
            type="button"
            onClick={clearData}
            className="w-full rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:text-base md:w-auto"
          >
            Təmizlə
          </button>

          <button
            type="button"
            onClick={submitVotes}
            className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90 sm:text-base md:w-auto"
          >
            Göndər
          </button>
        </div>
      </div>
    </div>
  );
};