const MainPageLoadings = () => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-6">

        <div className="flex gap-3">
          <div className="h-4 w-4 animate-bounce rounded-full bg-indigo-500"></div>
          <div className="h-4 w-4 animate-bounce rounded-full bg-indigo-500 [animation-delay:0.15s]"></div>
          <div className="h-4 w-4 animate-bounce rounded-full bg-indigo-500 [animation-delay:0.3s]"></div>
        </div>

        <p className="text-sm font-medium text-gray-500 tracking-wide">
          Loading content...
        </p>

        <div className="w-72 rounded-2xl bg-white p-4 shadow-md">

          <div className="relative overflow-hidden rounded-xl bg-gray-200 h-36">
            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="relative overflow-hidden rounded bg-gray-200 h-4 w-3/4">
              <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>
            </div>

            <div className="relative overflow-hidden rounded bg-gray-200 h-4 w-1/2">
              <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>
            </div>
          </div>

        </div>

      </div>

      <style>
        {`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .animate-shimmer {
          animation: shimmer 1.6s infinite;
        }
        `}
      </style>
    </div>
  );
};

export default MainPageLoadings;