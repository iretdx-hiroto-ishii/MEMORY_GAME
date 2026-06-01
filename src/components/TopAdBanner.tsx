import './top-ad-banner.css';

const TopAdBanner = () => {
  return (
    <div className="top-ad-banner" role="complementary" aria-label="広告バナー枠">
      <div id="ad-banner-slot" className="top-ad-banner__slot">
        AD BANNER SLOT
      </div>
    </div>
  );
};

export default TopAdBanner;