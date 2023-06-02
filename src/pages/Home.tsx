import * as React from "react";
import { Link } from "react-router-dom";
import { AuthRedirectWrapper } from "components";
import { dAppName } from "config";
import { routeNames } from "routes";

const HomePage = () => {
  return (
    <div className="d-flex flex-fill justify-content-center container-fluid">
      <div className="row w-100">
        <div className="col-12 mx-auto">
          <h2 className="mt-5 text-left">App Marketplace</h2>

          <div className="row mt-3">
            <div className="col-12 col-md-6 col-lg-4 mb-3 d-flex justify-content-center">
              <div className="card shadow-sm border">
                <div className="card-body p-3">
                  <div className="mb-4">
                    <img
                      className="data-nft-image"
                      src="https://elements-video-cover-images-0.imgix.net/files/08bc1ced-a01d-4760-83fc-a09d05f108d0/inline_image_preview.jpg?auto=compress%2Cformat&fit=min&h=394&w=700&s=ce16b6b7ec1dbcdbc76081d363b892dd"
                    />
                  </div>
                  <h5 className="card-title">Itheum Trailblazer</h5>
                  <p className="card-text">
                    Some quick example text to build on the card title and make
                    up the bulk of the card's content.
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

            <div className="col-12 col-md-6 col-lg-4 mb-3 d-flex justify-content-center">
              <div className="card shadow-sm border">
                <div className="card-body p-3">
                  <div className="mb-4">
                    <img
                      className="data-nft-image"
                      src="https://itheum-static.s3-ap-southeast-2.amazonaws.com/dex-gamer-passport-data.png"
                    />
                  </div>
                  <h5 className="card-title">Web3 Gamer Passport</h5>
                  <p className="card-text">
                    Some quick example text to build on the card title and make
                    up the bulk of the card's content.
                  </p>
                  <Link
                    to={routeNames.gamerpassportgamer}
                    className="btn btn-primary"
                  >
                    Launch App
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4 mb-3 d-flex justify-content-center">
              <div className="card shadow-sm border">
                <div className="card-body p-3">
                  <div className="mb-4">
                    <img
                      className="data-nft-image"
                      src="https://itheum-static.s3-ap-southeast-2.amazonaws.com/dex-sony-playstation-data-passport.png"
                    />
                  </div>
                  <h5 className="card-title">
                    Sony Playstation Gamer Passport
                  </h5>
                  <p className="card-text">
                    Some quick example text to build on the card title and make
                    up the bulk of the card's content.
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
          </div>
        </div>
      </div>

      {/* <div className="row w-10" style={{ backgroundColor: "green" }}>
        <div
          className="col-12 col-md-8 col-lg-5"
          style={{ backgroundColor: "blue" }}
        >
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

      <div className="row w-100" style={{ backgroundColor: "green" }}>
        <div
          className="col-12 col-md-8 col-lg-5 mx-auto"
          style={{ backgroundColor: "red" }}
        >
          <div className="card" style={{ width: "18rem" }}>
            <img src="..." className="card-img-top" alt="..." />
            <div className="card-body">
              <h5 className="card-title">Itheum Trailblazer</h5>
              <p className="card-text">
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </p>
              <Link
                to={routeNames.itheumtrailblazer}
                className="btn btn-primary"
              >
                Launch App
              </Link>
            </div>
          </div>
          <div className="card" style={{ width: "18rem" }}>
            <img src="..." className="card-img-top" alt="..." />
            <div className="card-body">
              <h5 className="card-title">Web3 Gamer Passport</h5>
              <p className="card-text">
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </p>
              <Link
                to={routeNames.gamerpassportgamer}
                className="btn btn-primary"
              >
                Launch App
              </Link>
            </div>
          </div>
          <div className="card" style={{ width: "18rem" }}>
            <img src="..." className="card-img-top" alt="..." />
            <div className="card-body">
              <h5 className="card-title">Sony Playstation Gamer Passport</h5>
              <p className="card-text">
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
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
      </div> */}
    </div>
  );
};

export const Home = () => (
  <AuthRedirectWrapper>
    <HomePage />
  </AuthRedirectWrapper>
);
