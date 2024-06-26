import React from "react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import { DappProvider, Layout } from "components";
import { TransactionsToastList, NotificationModal, SignTransactionsModals } from "components";
import { ELROND_NETWORK, apiTimeout, walletConnectV2ProjectId } from "config";
import { MultiversxInfographics, MyWallet, PageNotFound, Unlock, GetBitz, BoberGameRoom } from "pages";
import { ItheumTrailblazer } from "pages/AppMarketplace/ItheumTrailblazer/ItheumTrailblazer";
import { NFTunes } from "pages/AppMarketplace/NFTunes";
import { TimeCapsule } from "pages/AppMarketplace/TimeCapsule/TimeCapsule";
import { routes, routeNames } from "routes";
import { ThemeProvider } from "./libComponents/ThemeProvider";
import { StoreProvider } from "./store/StoreProvider";
import { DeepForestMusic } from "pages/AppMarketplace/DeepForestMusic/DeepForestMusic";

export const App = () => {
  return (
    <Router>
      <DappProvider
        environment={ELROND_NETWORK}
        customNetworkConfig={{
          name: "itheum-explorer",
          apiTimeout,
          walletConnectV2ProjectId,
        }}
        dappConfig={{
          shouldUseWebViewProvider: true,
        }}>
        <StoreProvider>
          <ThemeProvider defaultTheme="system" storageKey="explorer-ui-theme">
            <Layout>
              <TransactionsToastList />
              <NotificationModal />
              <SignTransactionsModals className="custom-class-for-modals" />
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
      </DappProvider>
    </Router>
  );
};

export default App;
