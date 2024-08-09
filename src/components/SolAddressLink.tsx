import React, { FC } from "react";
import { ExternalLink } from "lucide-react";
import { cn } from "libs/utils";

interface SolAddressLinkPropsType {
  explorerAddress: string;
  address: string;
  textStyle?: string;
  precision?: number;
}

export const SolAddressLink: FC<SolAddressLinkPropsType> = ({ explorerAddress, address, textStyle, precision = 6 }) => {
  return (
    <a
      className={cn("text-decoration-none flex flex-row items-center !text-blue-500 hover:!text-blue-500/80", textStyle)}
      href={`${explorerAddress}/address/${address}`}
      target="_blank">
      {precision > 0 ? address.slice(0, precision) + " ... " + address.slice(-precision) : address}
      <ExternalLink strokeWidth={2.5} size={16} className="ml-1" />
    </a>
  );
};
