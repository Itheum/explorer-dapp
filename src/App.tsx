import React from "react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import { Layout } from "components";
import { MvxContextProvider } from "contexts/mvx/MvxContextProvider";
import { SolContextProvider } from "contexts/sol/SolContextProvider";
import { MultiversxInfographics, MyWallet, PageNotFound, Unlock, BoberGameRoom } from "pages";
import { DeepForestMusic } from "pages/AppMarketplace/DeepForestMusic/DeepForestMusic";
import GetBitz from "pages/AppMarketplace/GetBitz";
import { ItheumTrailblazer } from "pages/AppMarketplace/ItheumTrailblazer/ItheumTrailblazer";
import { NFTunes } from "pages/AppMarketplace/NFTunes";
import { TimeCapsule } from "pages/AppMarketplace/TimeCapsule/TimeCapsule";
import { routes, routeNames } from "routes";
import { ThemeProvider } from "./contexts/ThemeProvider";
import { StoreProvider } from "./store/StoreProvider";

export const App = () => {
  return (
    <Router>
      <SolContextProvider>
        <MvxContextProvider>
          <StoreProvider>
            <ThemeProvider defaultTheme="system" storageKey="explorer-ui-theme">
              <Layout>
                <Routes>
                  <Route path={routeNames.unlock} element={<Unlock />} />
                  {routes.map((route, index) => (
                    <Route path={route.path} key={index} element={<route.component />} />
                  ))}
                  <Route path={`${routeNames.itheumtrailblazer}/:targetNonce/:targetMessageToBeSigned`} element={<ItheumTrailblazer />} />
                  <Route path={`${routeNames.multiversxinfographics}/:targetNonce/:targetMessageToBeSigned`} element={<MultiversxInfographics />} />
                  <Route path={`${routeNames.nftunes}/:targetNonce/:targetMessageToBeSigned`} element={<NFTunes />} />
                  <Route path={`${routeNames.deepforestmusic}/:targetNonce/:targetMessageToBeSigned`} element={<DeepForestMusic />} />
                  <Route path={`${routeNames.timecapsule}/:targetNonce/:targetMessageToBeSigned`} element={<TimeCapsule />} />
                  <Route path={`${routeNames.mywallet}/:targetNonce/:targetMessageToBeSigned`} element={<MyWallet />} />
                  <Route path={`${routeNames.getbitz}/:targetNonce/:targetMessageToBeSigned`} element={<GetBitz />} />
                  <Route path={`${routeNames.bobergameroom}/:targetNonce/:targetMessageToBeSigned`} element={<BoberGameRoom />} />
                  <Route path="*" element={<PageNotFound />} />
                </Routes>
              </Layout>
            </ThemeProvider>
          </StoreProvider>
        </MvxContextProvider>
      </SolContextProvider>
    </Router>
  );
};

export default App;
