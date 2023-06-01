import * as React from "react";
import { Link } from "react-router-dom";
import { AuthRedirectWrapper } from "components";
import { dAppName } from "config";
import { routeNames } from "routes";

const HomePage = () => {
  return (
    <div className="d-flex flex-fill align-items-center justify-content-center container">
      <div className="row w-100">
        <div className="col-12 col-md-8 col-lg-5 mx-auto">
          <div className="card shadow-sm rounded p-4 border-0">
            <div className="card-body text-center">
              <h2 className="mb-3 font-title">{dAppName}</h2>

              <p className="mb-3">
                You can seamlessly use Itheum Data-DEX SDK in every dApp!
                <br />
                <br />
                Unlock personalized experiences in your dApp by unlocking data
                streams from Data NFTs in your user's wallets!
              </p>

              <Link
                to={routeNames.unlock}
                className="btn btn-primary mt-3 text-white"
                data-testid="loginBtn"
              >
                Login
              </Link>
            </div>
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
