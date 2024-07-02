import React from "react";

export function MvxSolSwitch({  toggleState, setToggleState}: { toggleState: boolean, setToggleState: any }) {
  console.log(toggleState);
    return (
        <label className="inline-flex items-center cursor-pointer m-3">
            <span className="me-3 text-sm font-medium text-gray-900 dark:text-gray-300">MultiversX</span>
            <input type="checkbox" value="" className="sr-only peer" onChange={setToggleState}/>
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Solana</span>
        </label>
  );
}
