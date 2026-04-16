import React from 'react';
import Banner from './Banner';
import WhyChooseUs from './WhyChooseUs';
import HowItWorks from './HowItWorks';
import LatestReviews from './LatestReviews';
import AdvertisementSection from './AdvertisementSection';
import PlatformHighlights from './PlatformHighlights';

const Home = () => {
    return (
        <div>
            <Banner />
            <PlatformHighlights />
            <AdvertisementSection />
            <LatestReviews />
            <WhyChooseUs />
            <HowItWorks />
        </div>
    );
};

export default Home;