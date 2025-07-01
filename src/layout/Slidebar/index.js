import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { TOAST_ERROR, TOAST_WARNING, TOAST_INFO, TOAST_SUCCESS, SWIT_SUCCESS, SWIT_DELETE, SWIT_DELETE_SUCCESS, SWIT_LOGOUT, logoutRedirection, Language } from '../../config/commonFunction';
import Constatnt, { PUBLIC_URL } from '../../config/constant';
import * as API from '../../utils/api.services';
import Header from '../Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';
import { GiKnightBanner } from "react-icons/gi";
import { FaRegCalendarAlt, FaRegNewspaper, FaStackExchange, FaUsers } from "react-icons/fa";
import { TbDashboardFilled } from "react-icons/tb";
import { GrBlog, GrSettingsOption } from "react-icons/gr";
import { RiCoupon3Line } from "react-icons/ri";
import { FiUsers } from "react-icons/fi";
import { TfiDashboard } from "react-icons/tfi";
import { FaNimblr } from "react-icons/fa";
import { BiCategory } from "react-icons/bi";
import { RiSecurePaymentLine } from "react-icons/ri";
import { MdOutlineContactMail, MdOutlineContacts, MdOutlineContentPaste } from "react-icons/md";
import { BsCardHeading, BsCart4 } from "react-icons/bs";
import { CiWallet } from "react-icons/ci";
import { GoIssueOpened, GoQuestion } from "react-icons/go";
import { PATHS } from '../../Router/Paths';
import { CgGames } from "react-icons/cg";

import { PiCity } from "react-icons/pi";
import { FaVenus } from "react-icons/fa";
import { PiFlagBannerFoldThin } from "react-icons/pi";

const Slidebar = () => {

    let navigate = useNavigate();
    let location = useLocation();

    let path = '/' + location?.pathname?.split('/')?.[1]

    // const logouthandle = async () => {
    //     SWIT_LOGOUT().then(async (result) => {
    //         if (result.isConfirmed) {
    //             let { code, message } = await API.logout();
    //             if (code === '1') {
    //                 TOAST_SUCCESS(message);
    //                 logoutRedirection();
    //                 navigate('/login');
    //             }
    //         }
    //     });
    // }

    const [hideSpans, setHideSpans] = useState(true);
    var AdminData = JSON.parse(localStorage.getItem(Constatnt.AUTH_KEY));
    console.log('AdminData', AdminData?.role);
    const [isActive, setIsActive] = useState(false);
    const handleClick = () => {
        setIsActive(!isActive);
    }

    const [expanded, setExpanded] = useState(false);

    const toggleMenu = (menuName) => {
        setExpanded((prev) => ({
            ...prev,
            [menuName]: !prev[menuName],
        }));
    };

    // useEffect(() => {
    //     if (location.pathname !== '/category_list' && location.pathname !== '/filter_category_list') {
    //         setExpanded(false);
    //     } else {
    //         setExpanded(true);
    //     }
    // }, [location.pathname]);
    // const { userPermition: { data: adminPermitions }, } = useSelector((state) => state.userPermition);

    return (
        <>
            {/* <div className="page-wrapper" id="main-wrapper" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full" data-sidebar-position="fixed" data-header-position="fixed"> */}
            {/* Sidebar Start */}
            <aside className="left-sidebar">
                {/* Sidebar scroll*/}
                <div>

                    <div className="brand-logo d-flex align-items-center justify-content-between mb-2">
                        <Link to={'/'} className="text-nowrap logo-img text-center d-flex m-2 ms-5">
                            <img src={Constatnt?.SPORT_LOGO} className="dark-logo ms-0 m-2 ms-4" width={125} alt />
                        </Link>

                        {/* <img src={PUBLIC_URL + "/dist/images/Group 25.png"} className="dark-logo p-2 m-2 " width={200} alt /> */}
                        {/* <img src={PUBLIC_URL + "/dist/images/logos/light-logo.svg"} className="light-logo" width={180} alt /> */}
                        {/* </Link> */}

                        {/* <Link to={'/'} className="text-nowrap logo-img text-center d-flex header_logo">
                            <img src={PUBLIC_URL + "/dist/images/logo.svg"} className="dark-logo p-2 m-2 " width={60} alt />
                        </Link> */}

                        <div className="close-btn d-lg-none d-block sidebartoggler cursor-pointer" id="sidebarCollapse">
                            <i className="ti ti-x fs-8 text-muted" />
                        </div>

                    </div>
                    {/* Sidebar navigation*/}
                    <nav className="sidebar-nav scroll-sidebar" data-simplebar>
                        <ul id="sidebarnav">

                            {/* =================== */}
                            {/* Dashboard */}
                            {/* =================== */}

                            <li className={`sidebar-item ${path === PATHS?.DASHBOARD || path === "/" ? "selected" : ""}`}>
                                <Link to={PATHS?.DASHBOARD} className={`sidebar-link ${path === PATHS?.DASHBOARD || path === "/" ? "active" : ""}`} aria-expanded="false">
                                    <span>
                                        <TfiDashboard style={{ fontSize: '1.2rem' }} />
                                    </span>
                                    <span className="hide-menu">Dashboard</span>
                                </Link>
                            </li>

                            <li className={`sidebar-item ${path === PATHS?.USER_LIST ? "selected" : ""}`}>
                                <Link to={PATHS?.USER_LIST} className={`sidebar-link ${path === PATHS?.USER_LIST ? "active" : ""}`} aria-expanded="false">
                                    <span>
                                        <FiUsers style={{ fontSize: '1.2rem' }} />
                                    </span>
                                    <span className="hide-menu">Users</span>
                                </Link>
                            </li>

                            <li className={`sidebar-item ${path === PATHS?.CITY_LIST ? "selected" : ""}`}>
                                <Link to={PATHS?.CITY_LIST} className={`sidebar-link ${path === PATHS?.CITY_LIST ? "active" : ""}`} aria-expanded="false">
                                    <span>
                                        <PiCity style={{ fontSize: '1.2rem' }} />
                                    </span>
                                    <span className="hide-menu">City</span>
                                </Link>
                            </li>

                            <li className={`sidebar-item ${path === PATHS?.GAME_LIST ? "selected" : ""}`}>
                                <Link to={PATHS?.GAME_LIST} className={`sidebar-link ${path === PATHS?.GAME_LIST ? "active" : ""}`} aria-expanded="false">
                                    <span>
                                        <CgGames style={{ fontSize: '1.2rem' }} />
                                    </span>
                                    <span className="hide-menu">Games</span>
                                </Link>
                            </li>

                            <li className={`sidebar-item ${path === PATHS?.VENUE_LIST ? "selected" : ""}`}>
                                <Link to={PATHS?.VENUE_LIST} className={`sidebar-link ${path === PATHS?.VENUE_LIST ? "active" : ""}`} aria-expanded="false">
                                    <span>
                                        <FaVenus style={{ fontSize: '1.2rem' }} />
                                    </span>
                                    <span className="hide-menu">Venues</span>
                                </Link>
                            </li>

                            <li className={`sidebar-item ${path === PATHS?.BANNER_LIST ? "selected" : ""}`}>
                                <Link to={PATHS?.BANNER_LIST} className={`sidebar-link ${path === PATHS?.BANNER_LIST ? "active" : ""}`} aria-expanded="false">
                                    <span>
                                        <PiFlagBannerFoldThin style={{ fontSize: '1.2rem' }} />
                                    </span>
                                    <span className="hide-menu">Banner</span>
                                </Link>
                            </li>

                            <li className={`sidebar-item ${path === PATHS?.BOOKING_LIST ? "selected" : ""}`}>
                                <Link to={PATHS?.BOOKING_LIST} className={`sidebar-link ${path === PATHS?.BOOKING_LIST ? "active" : ""}`} aria-expanded="false">
                                    <span>
                                        <FaRegCalendarAlt style={{ fontSize: '1.2rem' }} />
                                    </span>
                                    <span className="hide-menu">Booking List</span>
                                </Link>
                            </li>


                            <li className="nav-small-cap">
                                <i className="ti ti-dots nav-small-cap-icon fs-3" />
                                <span className="">Cms Pages</span>
                            </li>

                            <li className={`sidebar-item ${path === PATHS?.CONTACT_US_LIST ? "selected" : ""}`}>
                                <Link to={'/contact_us_list'} className={`sidebar-link ${path === PATHS?.CONTACT_US_LIST ? "active" : ""}`} aria-expanded="false">
                                    <span>
                                        <MdOutlineContacts style={{ fontSize: '1.2rem' }} />

                                    </span>
                                    <span className="hide-menu">Contact Us</span>
                                </Link>
                            </li>

                            <li className={`sidebar-item ${path === PATHS?.APP_CONTENT ? "selected" : ""}`}>
                                <Link to={PATHS?.APP_CONTENT} className={`sidebar-link ${path === PATHS?.APP_CONTENT ? "active" : ""}`} aria-expanded="false">
                                    <span>
                                        <BsCardHeading style={{ fontSize: '1.2rem' }} />
                                    </span>
                                    <span className="hide-menu">App Content</span>
                                </Link>
                            </li>

                            {/* <li className={`sidebar-item ${path === "/news_latter_list" ? "selected" : ""}`}>
                                <Link to={'/news_latter_list'} className={`sidebar-link ${path === "/news_latter_list" ? "active" : ""}`} aria-expanded="false">
                                    <span>
                                        <MdOutlineContactMail style={{ fontSize: '1.2rem' }} />
                                    </span>
                                    <span className="hide-menu">News Letter</span>
                                </Link>
                            </li>

                            <li className={`sidebar-item ${path === "/chat_setting_list" ? "selected" : ""}`}>
                                <Link to={'/chat_setting_list'} className={`sidebar-link ${path === "/chat_setting_list" ? "active" : ""}`} aria-expanded="false">
                                    <span>
                                        <GrSettingsOption style={{ fontSize: '1.2rem' }} />
                                    </span>
                                    <span className="hide-menu">Chat Setting</span>
                                </Link>
                            </li>

                            <li className={`sidebar-item ${path === "/application_content" ? "selected" : ""}`}>
                                <Link to={'/application_content'} className={`sidebar-link ${path === "/application_content" ? "active" : ""}`} aria-expanded="false">
                                    <span>
                                        <BsCardHeading style={{ fontSize: '1.2rem' }} />
                                    </span>
                                    <span className="hide-menu">App Content</span>
                                </Link>
                            </li>


                            <li className={`sidebar-item ${path === "/contact_us_list" ? "selected" : ""}`}>
                                <Link to={'/contact_us_list'} className={`sidebar-link ${path === "/contact_us_list" ? "active" : ""}`} aria-expanded="false">
                                    <span>
                                        <i className="ti ti-phone me-1 fs-6" />
                                    </span>
                                    <span className="hide-menu">Contact Us</span>
                                </Link>
                            </li>

                            <li className={`sidebar-item ${path === "/astrologer_inquiry_list" ? "selected" : ""}`}>
                                <Link to={'/astrologer_inquiry_list'} className={`sidebar-link ${path === "/astrologer_inquiry_list" ? "active" : ""}`} aria-expanded="false">
                                    <span>
                                        <i className="ti ti-phone me-1 fs-6" />
                                    </span>
                                    <span className="hide-menu">Astrologer Inquiry</span>
                                </Link>
                            </li> */}
                            {/* <li className={`sidebar-item ${path === "/about-us" ? "selected" : ""}`}>
                                <Link to={'/about-us'} className={`sidebar-link ${path === "/about-us" ? "active" : ""}`} aria-expanded="false">
                                    <span>
                                        <i className="ti ti-help me-1 fs-6" />
                                    </span>
                                    <span className="hide-menu">About Us</span>
                                </Link>
                            </li> */}

                            {/* <li className={`sidebar-item ${path === "/privacy-policy" ? "selected" : ""}`}>
                                <Link to={'/privacy-policy'} className={`sidebar-link ${path === "/privacy-policy" ? "active" : ""}`} aria-expanded="false">
                                    <span>
                                        <i class="ti ti-shield-check me-1 fs-6"></i>

                                    </span>
                                    <span className="hide-menu">Privacy Policy</span>
                                </Link>
                            </li> */}

                            {/* <li className={`sidebar-item ${path === "/terms-condition" ? "selected" : ""}`}>
                                <Link to={'/terms-condition'} className={`sidebar-link ${path === "/terms-condition" ? "active" : ""}`} aria-expanded="false">
                                    <span>
                                        <i class="ti ti-info-circle me-1 fs-6"></i>
                                    </span>
                                    <span className="hide-menu">Terms & Condition</span>
                                </Link>
                            </li> */}

                            <li className={`sidebar-item ${path === PATHS?.FAQ_LIST ? "selected" : ""}`}>
                                <Link to={PATHS?.FAQ_LIST} className={`sidebar-link ${path === PATHS?.FAQ_LIST ? "active" : ""}`} aria-expanded="false">
                                    <span>
                                        <GoQuestion style={{ fontSize: '1.2rem' }} />
                                    </span>
                                    <span className="hide-menu">FAQ</span>
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    <div className="fixed-profile p-3 bg-light-secondary rounded sidebar-ad mt-3">
                        <div className="hstack gap-3">
                            <div className="john-img">
                                <img src="../../dist/images/profile/user-1.jpg" className="rounded-circle" width={40} height={40} alt />
                            </div>
                            <div className="john-title">
                                <h6 className="mb-0 fs-4 fw-semibold">Mathew</h6>
                                <span className="fs-2 text-dark">Designer</span>
                            </div>
                            <button className="border-0 bg-transparent text-primary ms-auto" tabIndex={0} type="button" aria-label="logout" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="logout">
                                <i className="ti ti-power fs-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

        </>
    )
}

export default Slidebar
