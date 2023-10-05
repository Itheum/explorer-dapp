import * as React from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation } from "react-router-dom";

export const PageNotFound = () => {
  const { pathname } = useLocation();

  return (
    <div className="flex flex-fill items-center container">
      <div className="col-12 col-md-8 col-lg-5 mx-auto">
        <div className="card shadow-accent-foreground/40 shadow-md rounded p-4 border-0 bg-background">
          <div className="card-body text-center flex flex-col justify-center">
            <FontAwesomeIcon icon={faSearch} className="mx-auto fa-3x mb-2" />
            <span className=" mt-3">Page not found</span>
            <span className="empty-details">{pathname}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
