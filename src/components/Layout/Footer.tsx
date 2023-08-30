import React from "react";
import { ELROND_NETWORK } from "config";
import { ReactComponent as HeartIcon } from "../../assets/img/heart.svg";

export const Footer = () => {
  const appVersion = process.env.REACT_APP_VERSION ? `v${process.env.REACT_APP_VERSION}` : "version number unknown";

  return (
    <footer className="text-center mt-2 mb-3">
      <div>
        <a
          {...{
            target: "_blank",
          }}
          className="flex items-center dark:text-white text-black"
          href="https://itheum.com">
          Made with <HeartIcon className="mx-1" /> by Itheum
        </a>
        <div>
          <small>{appVersion}</small>
          <small className="ml-1">{ELROND_NETWORK.toUpperCase()}</small>
        </div>
      </div>
    </footer>
  );
};
