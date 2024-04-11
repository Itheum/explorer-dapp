import React from "react";
import { toastSuccess } from "libs/utils";
import { CopyPlusIcon } from "lucide-react";

export function CopyAddress({ address, precision = 6 }: { address: string; precision?: number }) {
  return (
    <a
      className="line-clamp-2 text-sm leading-snug !text-sky-300 flex gap-2"
      style={{
        cursor: "pointer",
      }}
      onClick={() => {
        navigator.clipboard.writeText(address);
        toastSuccess("Address is copied to clipboard");
      }}>
      {precision > 0 ? address.slice(0, precision) + " ... " + address.slice(-precision) : address}
      <CopyPlusIcon className="text-sky-300 w-4 h-4" />
    </a>
  );
}
