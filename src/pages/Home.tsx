import * as React from "react";
import { Link } from "react-router-dom";
import { AuthRedirectWrapper } from "components";
import { APP_MAPPINGS } from "libs/utils/constant";
import { SUPPORTED_APPS } from "config";
import { routeNames } from "routes";

export function returnRoute(routeKey: string) {
  return (routeNames as any)[routeKey];
}

const HomePage = () => {
  return (
    <div className="d-flex flex-fill justify-content-center container-fluid">
      <div className="row w-100">
        <div className="col-12 mx-auto">
          <h3 className="mt-5 text-left">App Marketplace</h3>

          <div className="row mt-3">
            {APP_MAPPINGS.filter((app) =>
              SUPPORTED_APPS.includes(app.routeKey)
            ).map((item) => (
              <div
                key={item.routeKey}
                className="col-12 col-md-6 col-lg-4 mb-3 d-flex justify-content-center c-app-tile"
              >
                <div className="card shadow-sm border">
                  <div className="card-body p-3">
                    <div className="mb-4">
                      <img className="data-nft-image" src={item.img} />
                    </div>
                    <h5 className="card-title">{item.appName}</h5>
                    <p className="card-text">{item.desc}</p>
                    <Link
                      to={returnRoute(item.routeKey)}
                      className="btn btn-primary"
                    >
                      Launch App
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Home = () => (
  <AuthRedirectWrapper>
    <HomePage />
  </AuthRedirectWrapper>
);
