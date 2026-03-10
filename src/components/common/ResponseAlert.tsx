import { hideResponse } from "../../features/ui/uiSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";

const styles = {
  success: "border-emerald-300 bg-emerald-50 text-emerald-700",
  error: "border-rose-300 bg-rose-50 text-rose-700",
  info: "border-sky-300 bg-sky-50 text-sky-700",
};

export default function ResponseAlert() {
  const dispatch = useAppDispatch();
  const response = useAppSelector((state) => state.ui);

  if (!response.open) return null;

  return (
    <div className="fixed right-4 top-4 z-50 w-[340px] max-w-[92%]">
      <div className={`rounded-2xl border p-4 shadow-lg ${styles[response.type]}`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="font-semibold">{response.title}</h4>
            <p className="mt-1 text-sm">{response.message}</p>
          </div>
          <button
            className="cursor-pointer text-sm font-semibold"
            onClick={() => dispatch(hideResponse())}
          >
            Bağla
          </button>
        </div>
      </div>
    </div>
  );
}