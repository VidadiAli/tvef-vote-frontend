const DeleteElement = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6 rounded-2xl bg-white px-10 py-8 shadow-xl">

        {/* Spinner */}
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-red-200"></div>
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-red-600"></div>
        </div>

        {/* Text */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800">
            Deleting...
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Element silinir, zəhmət olmasa gözləyin
          </p>
        </div>

        {/* Progress bar */}
        <div className="h-1 w-48 overflow-hidden rounded bg-red-100">
          <div className="h-full animate-[loading_1.5s_linear_infinite] bg-red-500"></div>
        </div>

      </div>

      <style>
        {`
        @keyframes loading {
          0% { transform: translateX(-100%); width: 30%; }
          50% { width: 60%; }
          100% { transform: translateX(100%); width: 30%; }
        }
        `}
      </style>
    </div>
  );
};

export default DeleteElement;