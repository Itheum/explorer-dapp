import React, { FC } from "react";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ElrondAddressLinkPropsType {
  explorerAddress: string;
  address: string;
  precision?: number;
}

export const ElrondAddressLink: FC<ElrondAddressLinkPropsType> = ({
  explorerAddress,
  address,
  precision = 6,
}) => {
  return (
    <a
      className="text-decoration-none"
      href={`${explorerAddress}/accounts/${address}`}
      target="blank"
    >
      {precision > 0 ? address.slice(0, precision) + " ... " + address.slice(-precision) : address}
      <FontAwesomeIcon icon={faLink} className="ml-2" />
    </a>
  );
};
