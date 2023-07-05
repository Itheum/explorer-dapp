import * as React from "react";
import { Link } from "react-router-dom";
import { AuthRedirectWrapper } from "components";
// import { dAppName } from "config";
import { routeNames } from "routes";

import appIconBubbles from "assets/img/expl-app-esdt-bubbles-icon.png";

const HomePage = () => {
  return (
    <div className="d-flex flex-fill justify-content-center container-fluid">
      <div className="row w-100">
        <div className="col-12 mx-auto">
          <h3 className="mt-5 text-left">App Marketplace</h3>

          <div className="row mt-3">
            <div className="col-12 col-md-6 col-lg-4 mb-3 d-flex justify-content-center c-app-tile">
              <div className="card shadow-sm border">
                <div className="card-body p-3">
                  <div className="mb-4">
                    <img
                      className="data-nft-image"
                      src="https://itheum-static.s3.ap-southeast-2.amazonaws.com/expl-app-trailblazer-icon.png"
                    />
                  </div>
                  <h5 className="card-title">TrailBlazer</h5>
                  <p className="card-text">
                    Hardcore community members unlock Project Alpha by owning
                    their favorite project's TrailBlazer Data NFTs. Unlock and
                    visualize these TrailBlazer Data NFTs by using this app.
                  </p>
                  <Link
                    to={routeNames.itheumtrailblazer}
                    className="btn btn-primary"
                  >
                    Launch App
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4 mb-3 d-flex justify-content-center c-app-tile">
              <div className="card shadow-sm border">
                <div className="card-body p-3">
                  <div className="mb-4">
                    <img className="data-nft-image" src={appIconBubbles} />
                  </div>
                  <h5 className="card-title">MultiversX ESDT Bubbles</h5>
                  <p className="card-text">
                    ESDT is the native token standard of the MultiversX
                    blockchain. This app visualizes the dynamic data stream of
                    various ESDT token insights as bubble graphs.
                  </p>
                  <Link to={routeNames.esdtBubble} className="btn btn-primary">
                    Launch App
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4 mb-3 d-flex justify-content-center c-app-tile">
              <div className="card shadow-sm border">
                <div className="card-body p-3">
                  <div className="mb-4">
                    <img
                      className="data-nft-image"
                      src="https://itheum-static.s3.ap-southeast-2.amazonaws.com/expl-app-playstation-icon.png"
                    />
                  </div>
                  <h5 className="card-title">PlayStation Gamer Passport</h5>
                  <p className="card-text">
                    There are over 110 million active Sony Playstation gamers
                    today, and now, they can own some of their data. Unlock
                    these Platstation gamers' Data NFTs by using this app.
                  </p>
                  <Link
                    to={routeNames.playstationgamerpassport}
                    className="btn btn-primary"
                  >
                    Launch App
                  </Link>
                </div>
              </div>
            </div>

            {/* <div className="col-12 col-md-6 col-lg-4 mb-3 d-flex justify-content-center c-app-tile">
              <div className="card shadow-sm border">
                <div className="card-body p-3">
                  <div className="mb-4">
                    <img
                      className="data-nft-image"
                      src="https://itheum-static.s3.ap-southeast-2.amazonaws.com/expl-app-gamer-passport-icon.png"
                    />
                  </div>
                  <h5 className="card-title">Web3 Gamer Passport</h5>
                  <p className="card-text">
                    Engage and activate your web3 gaming community by allowing
                    them to own some of their own web3 gaming data. Unlock and
                    visualize these web3 gamers' Data NFTs by using this app.
                  </p>
                  <Link
                    to={routeNames.gamerpassportgamer}
                    className="btn btn-primary"
                  >
                    Launch App
                  </Link>
                </div>
              </div>
            </div> */}
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
