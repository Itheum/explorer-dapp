import * as React from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation } from "react-router-dom";

export const PageNotFound = () => {
  const { pathname } = useLocation();

  return (
    <div className="d-flex flex-fill align-items-center container">
      <div className="row w-100">
        <div className="col-12 col-md-8 col-lg-5 mx-auto">
          <div className="card shadow-sm rounded p-4 border-0">
            <div className="card-body text-center d-flex flex-column justify-content-center">
              <div className="dapp-icon icon-medium">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="mx-auto text-muted fa-3x mb-2"
                />
              </div>
              <span className="h4 empty-heading mt-3">Page not found</span>
              <span className="empty-details">{pathname}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
