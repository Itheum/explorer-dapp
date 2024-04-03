import React from "react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import {
  AxiosInterceptorContext, // using this is optional
  DappProvider,
  Layout,
} from "components";
import { TransactionsToastList, NotificationModal, SignTransactionsModals } from "components";
import { apiTimeout, walletConnectV2ProjectId, sampleAuthenticatedDomains, ELROND_NETWORK } from "config";
import { MultiversxBubbles, MultiversxInfographics, MyWallet, PageNotFound, Unlock, GetBitz, Arcade } from "pages";
import { ItheumTrailblazer } from "pages/AppMarketplace/ItheumTrailblazer/ItheumTrailblazer";
import { NFTunes } from "pages/AppMarketplace/NFTunes";
import { TimeCapsule } from "pages/AppMarketplace/TimeCapsule/TimeCapsule";
import { routes, routeNames } from "routes";
import { ThemeProvider } from "./libComponents/ThemeProvider";
import { StoreProvider } from "./store/StoreProvider";

export const App = () => {
  return (
    <AxiosInterceptorContext.Provider>
      <AxiosInterceptorContext.Interceptor authenticatedDomains={sampleAuthenticatedDomains}>
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
                  <AxiosInterceptorContext.Listener />
                  <TransactionsToastList />
                  <NotificationModal />
                  <SignTransactionsModals className="custom-class-for-modals" />
                  <Routes>
                    <Route path={routeNames.unlock} element={<Unlock />} />
                    {routes.map((route, index) => (
                      <Route path={route.path} key={index} element={<route.component />} />
                    ))}

                    <Route path={`${routeNames.itheumtrailblazer}/:targetNonce/:targetMessageToBeSigned`} element={<ItheumTrailblazer />} />
                    <Route path={`${routeNames.multiversxbubbles}/:targetNonce/:targetMessageToBeSigned`} element={<MultiversxBubbles />} />
                    <Route path={`${routeNames.multiversxinfographics}/:targetNonce/:targetMessageToBeSigned`} element={<MultiversxInfographics />} />
                    <Route path={`${routeNames.nftunes}/:targetNonce/:targetMessageToBeSigned`} element={<NFTunes />} />
                    <Route path={`${routeNames.timecapsule}/:targetNonce/:targetMessageToBeSigned`} element={<TimeCapsule />} />
                    <Route path={`${routeNames.mywallet}/:targetNonce/:targetMessageToBeSigned`} element={<MyWallet />} />
                    <Route path={`${routeNames.getbitz}/:targetNonce/:targetMessageToBeSigned`} element={<GetBitz />} />
                    <Route path={`${routeNames.arcade}/:targetNonce/:targetMessageToBeSigned`} element={<Arcade />} />
                    <Route path="*" element={<PageNotFound />} />
                  </Routes>
                </Layout>
              </ThemeProvider>
            </StoreProvider>
          </DappProvider>
        </Router>
      </AxiosInterceptorContext.Interceptor>
    </AxiosInterceptorContext.Provider>
  );
};

export default App;
