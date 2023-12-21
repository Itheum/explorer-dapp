import React from "react";
import { ELROND_NETWORK } from "config";

export const Footer = () => {
  const appVersion = process.env.REACT_APP_VERSION ? `v${process.env.REACT_APP_VERSION}` : "version number unknown";

  return (
    <footer className="w-full flex justify-center mt-2 mb-3">
      <div>
        <a
          {...{
            target: "_blank",
          }}
          className="flex items-center dark:text-white text-black"
          href="https://itheum.com">
          Made with ♥ by Itheum
        </a>
        <div className="text-center">
          <small>{appVersion}</small>
          <small className="">{ELROND_NETWORK.toUpperCase()}</small>
        </div>
      </div>
    </footer>
  );
};
