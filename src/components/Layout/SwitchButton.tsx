import React from "react";
import { Switch } from "../../libComponents/Switch";
import { useTheme } from "../../libComponents/ThemeProvider";

export function SwitchButton() {
  const { setTheme } = useTheme();

  return (
    <div className="flex items-center space-x-4 ml-3">
      <Switch
        id="airplane-mode"
        onClick={() => {
          if (localStorage.getItem("explorer-ui-theme") === "dark") {
            setTheme("light");
          } else {
            setTheme("dark");
          }
        }}
      />
    </div>
  );
}
