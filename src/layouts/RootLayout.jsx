import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../pages/Navbar';
import Footer from '../pages/Home/Footer';

const RootLayout = () => {
    return (
        <div>
            <Navbar/>
            <Outlet></Outlet>
            <Footer/>
        </div>
    );
};

export default RootLayout;