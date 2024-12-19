export function getBestBuyCtaLink({ ctaBuy, dripSet }: { ctaBuy?: string; dripSet?: string }) {
  let bestLinkToReturn;

  if (ctaBuy && ctaBuy.trim() !== "") {
    bestLinkToReturn = ctaBuy.trim();
  } else if (dripSet && dripSet.trim() !== "") {
    bestLinkToReturn = dripSet.trim();
  }

  return bestLinkToReturn;
}
