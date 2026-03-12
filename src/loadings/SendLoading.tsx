const SendLoading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 backdrop-blur-sm">
      <div className="w-[320px] rounded-3xl border border-white/10 bg-white p-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="relative flex h-14 w-14 items-center justify-center">
            <div className="absolute h-14 w-14 animate-ping rounded-full bg-violet-200/70"></div>
            <div className="absolute h-14 w-14 animate-pulse rounded-full bg-cyan-100"></div>
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 text-white shadow-lg">
              <svg
                className="h-6 w-6 animate-[sendFly_1.6s_ease-in-out_infinite]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M3.4 20.4 20.85 12 3.4 3.6v6.52l12.48 1.88-12.48 1.88v6.52Z" />
              </svg>
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold text-slate-800">Sending...</h3>
            <p className="mt-1 text-sm text-slate-500">
              Məlumat göndərilir, zəhmət olmasa gözləyin
            </p>
          </div>
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full w-1/2 animate-[loadingBar_1.4s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-violet-600 to-cyan-500"></div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
          Serverə bağlantı qurulur
        </div>
      </div>

      <style>
        {`
          @keyframes loadingBar {
            0% {
              transform: translateX(-100%);
              width: 35%;
            }
            50% {
              width: 55%;
            }
            100% {
              transform: translateX(280%);
              width: 35%;
            }
          }

          @keyframes sendFly {
            0%, 100% {
              transform: translateX(0) translateY(0) rotate(0deg);
            }
            25% {
              transform: translateX(2px) translateY(-2px) rotate(-8deg);
            }
            50% {
              transform: translateX(5px) translateY(-1px) rotate(0deg);
            }
            75% {
              transform: translateX(2px) translateY(2px) rotate(8deg);
            }
          }
        `}
      </style>
    </div>
  );
};

export default SendLoading;