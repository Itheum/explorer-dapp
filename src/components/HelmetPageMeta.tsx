import React from "react";
import { Helmet } from "react-helmet";

type NoDataFoundProps = {
  title: string;
  shortTitle: string;
  desc: string;
  shareImgUrl?: string;
};

const HelmetPageMeta: React.FC<NoDataFoundProps> = ({
  title,
  shortTitle,
  desc,
  shareImgUrl = "https://explorer.itheum.io/socialshare/itheum_explorer_social_promo_hero.png",
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={desc} />
      <meta content={shortTitle} property="og:title" />
      <meta content={desc} property="og:description" />
      <meta content={shareImgUrl} property="og:image" />
      <meta content={shortTitle} property="twitter:title" />
      <meta content={desc} property="twitter:description" />
      <meta content={shareImgUrl} property="twitter:image" />
    </Helmet>
  );
};

export default HelmetPageMeta;
