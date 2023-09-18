import React from "react";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import {
  AxiosInterceptorContext, // using this is optional
  DappProvider,
  Layout,
} from "components";
import { TransactionsToastList, NotificationModal, SignTransactionsModals } from "components";
import { apiTimeout, walletConnectV2ProjectId, sampleAuthenticatedDomains, ELROND_NETWORK } from "config";
import { MultiversxBubbles, MultiversxInfographics, MyWallet, PageNotFound, Unlock } from "pages";
import { ItheumTrailblazer } from "pages/ItheumTrailblazer";
import { routes, routeNames } from "routes";
import { ThemeProvider } from "./libComponents/ThemeProvider";
import { MusicX } from "pages/AppMarketplace/MusicX";

export const App = () => {
  return (
    <AxiosInterceptorContext.Provider>
      <AxiosInterceptorContext.Interceptor authenticatedDomanis={sampleAuthenticatedDomains}>
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
            <ThemeProvider defaultTheme="dark" storageKey="explorer-ui-theme">
              <Layout>
                <AxiosInterceptorContext.Listener />
                <TransactionsToastList />
                <NotificationModal />
                <SignTransactionsModals className="custom-class-for-modals" />
                <Routes>
                  <Route path={routeNames.unlock} element={<Unlock />} />
                  {routes.map((route, index) => (
                    <Route path={route.path} key={"route-key-" + index} element={<route.component />} />
                  ))}

                  <Route path={`${routeNames.itheumtrailblazer}/:targetNonce/:targetMessageToBeSigned`} element={<ItheumTrailblazer />} />
                  <Route path={`${routeNames.multiversxbubbles}/:targetNonce/:targetMessageToBeSigned`} element={<MultiversxBubbles />} />
                  <Route path={`${routeNames.multiversxinfographics}/:targetNonce/:targetMessageToBeSigned`} element={<MultiversxInfographics />} />
                  <Route path={`${routeNames.musicx}/:targetNonce/:targetMessageToBeSigned`} element={<MusicX />} />

                  <Route path={`${routeNames.mywallet}/:targetNonce/:targetMessageToBeSigned`} element={<MyWallet />} />
                  <Route path="*" element={<PageNotFound />} />
                </Routes>
              </Layout>
            </ThemeProvider>
          </DappProvider>
        </Router>
      </AxiosInterceptorContext.Interceptor>
    </AxiosInterceptorContext.Provider>
  );
};
