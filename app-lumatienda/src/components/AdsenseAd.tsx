"use client";

import { useEffect } from 'react';

type AdsenseAdProps = {
  adClient: string;
  adSlot: string;
  style?: React.CSSProperties;
  adFormat?: string;
  fullWidthResponsive?: boolean;
};

const AdsenseAd = ({
  adClient,
  adSlot,
  style = { display: 'block' },
  adFormat = 'auto',
  fullWidthResponsive = true,
}: AdsenseAdProps) => {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (err) {
      console.error(`[AdSense] Error pushing ad for slot ${adSlot}:`, err);
    }
  }, [adSlot]);

  // The 'key' prop helps React re-mount the component if the adSlot changes,
  // which is necessary to trigger a new ad load.
  return (
    <ins
      key={adSlot}
      className="adsbygoogle"
      style={style}
      data-ad-client={adClient}
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive={fullWidthResponsive}
    ></ins>
  );
};

export default AdsenseAd;
