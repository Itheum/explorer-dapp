import toast from "react-hot-toast";

export const toastClosableError = (msg: string) => {
  toast.error(
    (t) => (
      <div className="w-[260px] overflow-auto p-2">
        <p className="text-sm">{msg}</p>
        <button className="block p-1 border text-xs rounded-sm mt-1" onClick={() => toast.dismiss(t.id)}>
          Dismiss
        </button>
      </div>
    ),
    {
      position: "top-right",
    }
  );
};
