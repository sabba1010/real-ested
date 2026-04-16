import React from 'react';
import Banner from './Banner';
import WhyChooseUs from './WhyChooseUs';
import HowItWorks from './HowItWorks';
import LatestReviews from './LatestReviews';
import AdvertisementSection from './AdvertisementSection';
import PlatformHighlights from './PlatformHighlights';

const Home = () => {
    return (
        <div className="space-y-16 px-4 sm:px-6 lg:px-8">
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