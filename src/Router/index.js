import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import React, { lazy, Suspense, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Constatnt from '../config/constant';
import { PATHS } from './Paths.js';

export const Loadable = (Component) => (props) => {
    return (
        <Suspense>
            <Component {...props} />
        </Suspense>
    );
};

const Spinner = Loadable(lazy(() => import("../component/Spinner")));
const Login = Loadable(lazy(() => import("../pages/auth/Login")));
const PageNotFound = Loadable(lazy(() => import("./PageNotFound")));

const MyProfile = Loadable(lazy(() => import("../pages_astro/MyProfile/index.js")));
const ChangePassword = Loadable(lazy(() => import("../pages_astro/MyProfile/ChangePassword.js")));

const DashboardLayout = Loadable(lazy(() => import("../layout/DashbordLayout")));
const Dashboard = Loadable(lazy(() => import("../pages_astro/Dashbord/Index.js")));

const MangeCustomer = Loadable(lazy(() => import("../pages_astro/ManageUser/index.js")));
const AddCustomer = Loadable(lazy(() => import("../pages_astro/ManageUser/AddUser.js")));
const ViewCustomerDetials = Loadable(lazy(() => import("../pages_astro/ManageUser/ViewCustomer.js")));

const ManageCity = Loadable(lazy(() => import("../pages_astro/ManageCity/index.js")));

const ManageGame = Loadable(lazy(() => import("../pages_astro/ManageGame/index.js")));

const ManageVenue = Loadable(lazy(() => import("../pages_astro/ManageVenue")));
const AddVenue = Loadable(lazy(() => import("../pages_astro/ManageVenue/AddVenue.js")));
const ViewVenue = Loadable(lazy(() => import("../pages_astro/ManageVenue/ViewVenue.js")));

const ManageBanner = Loadable(lazy(() => import("../pages_astro/ManageBanner/index.js")));
const AddBanner = Loadable(lazy(() => import("../pages_astro/ManageBanner/AddBanner.js")));
const ViewBanner = Loadable(lazy(() => import("../pages_astro/ManageBanner/ViewBanner.js")));

const ManageContectUs = Loadable(lazy(() => import("../pages_astro/ContectUs/index.js")));
const ContectUsDetails = Loadable(lazy(() => import("../pages_astro/ContectUs/ContectDetials.js")));
const ManageFAQ = Loadable(lazy(() => import("../pages_astro/ManageFaq/index.js")));

const ManageBooking = Loadable(lazy(() => import("../pages_astro/ManageBooking/index.js")));
const ViewBooking = Loadable(lazy(() => import("../pages_astro/ManageBooking/ViewBooking.js")));

// const ManageAppContent = Loadable(lazy(() => import("../pages_astro/AppContent")));



// const ManageAppContent = Loadable(lazy(() => import("../pages_astro/StaticContent")));
const ManageAppContent = Loadable(lazy(() => import("../pages_astro/ApplicationContent")));

const Router = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { isLoading } = useSelector((state) => state.masterslice);
    let islogin = localStorage.getItem(Constatnt.LOGIN_KEY);
    const token = localStorage.getItem(Constatnt.ACCESS_TOKEN_KEY);

    useEffect(() => {
        if (!islogin) {
            navigate('/');
        } else if (islogin && (location?.pathname == '/dashboard' || location?.pathname == '/')) {
            navigate('/');
        }
    }, [islogin, token]);

    if (!islogin) {
        return (
            <>
                {/* <Spinner isActive={isLoading} message={'Please Wait...'} /> */}
                <Routes>
                    <Route path={PATHS?.DASHBOARD} element={<Login />} />
                    <Route path={PATHS?.LOGIN} element={<Login />} />
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </>)
    } else {
        return (
            <>
                {isLoading && <Spinner isActive={isLoading} message={'Please Wait...'} />}
                <Routes>
                    <Route element={<DashboardLayout />}>
                        <Route path="/" element={<Dashboard />} />
                        <Route path={PATHS?.DASHBOARD} element={<Dashboard />} />

                        <Route path={PATHS?.USER_LIST} element={<MangeCustomer />} />
                        <Route path={PATHS?.ADD_USER} element={<AddCustomer />} />
                        <Route path={PATHS?.EDIT_USER} element={<AddCustomer />} />
                        <Route path={PATHS?.DETAILS_USER} element={<ViewCustomerDetials />} />

                        <Route path={PATHS?.CITY_LIST} element={<ManageCity />} />
                        <Route path={PATHS?.GAME_LIST} element={<ManageGame />} />

                        <Route path={PATHS?.VENUE_LIST} element={<ManageVenue />} />
                        <Route path={PATHS?.VENUE_ADD} element={<AddVenue />} />
                        <Route path={PATHS?.VENUE_EDIT} element={<AddVenue />} />
                        <Route path={PATHS?.VENUE_DETAILS} element={<ViewVenue />} />

                        <Route path={PATHS?.BANNER_LIST} element={<ManageBanner />} />
                        <Route path={PATHS?.BANNER_ADD} element={<AddBanner />} />
                        <Route path={PATHS?.BANNER_EDIT} element={<AddBanner />} />
                        <Route path={PATHS?.BANNER_DETAILS} element={<ViewBanner />} />

                        <Route path={PATHS?.CONTACT_US_LIST} element={<ManageContectUs />} />
                        <Route path={PATHS?.CONTACT_US_DETAILS} element={<ContectUsDetails />} />
                        <Route path={PATHS?.FAQ_LIST} element={<ManageFAQ />} />

                        <Route path={PATHS?.BOOKING_LIST} element={<ManageBooking />} />
                        <Route path={PATHS?.BOOKING_DETAILS} element={<ViewBooking />} />

                        <Route path={PATHS?.APP_CONTENT} element={<ManageAppContent />} />


                        <Route path="/my_profile" element={<MyProfile />} />
                        <Route path="/change_password" element={<ChangePassword />} />
                        <Route path="*" element={<PageNotFound />} />
                    </Route>
                </Routes>
            </>
        )
    }

}

export default Router;
