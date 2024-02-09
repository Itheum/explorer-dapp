import React from "react";
import { ELROND_NETWORK } from "config";
import { ExternalLink } from "lucide-react";

export const Footer = () => {
  const appVersion = import.meta.env.VITE_APP_VERSION ? `v${import.meta.env.VITE_APP_VERSION}` : "version number unknown";

  return (
    <footer className="w-full flex justify-center py-2">
      <div>
        <a
          {...{
            target: "_blank",
          }}
          className="flex items-center dark:text-white text-black"
          href="https://itheum.com">
          Made with ♥ by Itheum
        </a>
        <div className="flex justify-center items-center gap-2">
          <small>
            {appVersion + " "}
            {ELROND_NETWORK.toUpperCase()} |{" "}
          </small>
          <a href="https://stats.uptimerobot.com/D8JBwIo983" target="_blank" className="flex justify-center items-center gap-0.5 hover:underline">
            <small>Status</small>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <div className=""></div>
      </div>
    </footer>
  );
};
