

import React, { useEffect, useState } from 'react'
import Header from '../../layout/Header'
import * as API from '../../utils/api.services';
import { useDispatch } from 'react-redux';
import { setLoader } from '../../Store/slices/MasterSlice';
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';
import OwlCarousel from 'react-owl-carousel';
import { Codes, PUBLIC_URL } from '../../config/constant';
import { FiUsers } from 'react-icons/fi';
import { PiCity, PiFlagBannerFoldThin } from 'react-icons/pi';
import { FaRegCalendarAlt, FaVenus } from 'react-icons/fa';
import { CgGames } from 'react-icons/cg';
import { PATHS } from '../../Router/Paths';

const Index = () => {

    let dispatch = useDispatch();

    const [dashboard, setDashboard] = useState({});

    const fetchDashboardData = async () => {
        try {
            // dispatch(setLoader(true));
            const res = await API.DashboardCount({});
            if (res?.code === Codes.SUCCESS) {
                setDashboard(res?.data);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            // dispatch(setLoader(false));
        }
    };

    useEffect(() => {
        // fetchDashboardData();
    }, []);

    // Sample data for astrologer ratings and consultations
    const astrologerData = [
        ['John Doe', 5, 'Astrologer', 320, '2019-12-01'],
        ['Jane Smith', 4, 'Astrologer', 240, '2020-12-05'],
        ['Mike Johnson', 3, 'Astrologer', 200, '2021-12-15'],
        ['Emma White', 5, 'Astrologer', 410, '2021-12-20'],
        ['Sophia Brown', 4, 'Astrologer', 310, '2021-12-22'],
    ];

    // Process the data for astrologer ratings and consultations
    const preprocessAstrologerData = (data) => {
        const aggregatedData = {};

        data.forEach(([name, rating, profession, sessions, date]) => {
            if (sessions === '-') sessions = 0; // Handle missing sessions
            const [year, month] = date.split('-').slice(0, 2);

            const key = `${year}-${month}`;
            if (!aggregatedData[key]) {
                aggregatedData[key] = { sessions: 0, rating: 0 };
            }

            aggregatedData[key].sessions += parseInt(sessions);
            aggregatedData[key].rating += parseInt(rating);
        });

        return Object.entries(aggregatedData).map(([key, { sessions, rating }]) => ({
            date: key,
            sessions,
            rating: (rating / 5).toFixed(1), // Average rating for the month
        }));
    };

    const astrologerStats = preprocessAstrologerData(astrologerData);

    // AstroTalk rating chart option
    const ratingOption = {
        dataset: [
            {
                dimensions: ['date', 'rating'],
                source: astrologerStats,
            },
            {
                transform: {
                    type: 'sort',
                    config: { dimension: 'rating', order: 'desc' },
                },
            },
        ],
        xAxis: {
            type: 'category',
            axisLabel: { interval: 0, rotate: 30 },
        },
        yAxis: {},
        series: {
            type: 'bar',
            encode: { x: 'date', y: 'rating' },
            datasetIndex: 1,
        },
    };

    // AstroTalk consultation chart (Line Chart)
    const consultationOption = {
        grid: {
            left: 50,
            right: 50,
            top: 50,
            bottom: 50,
        },
        xAxis: {
            type: 'category',
            data: astrologerStats.map(item => item.date),
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                name: 'Consultations',
                type: 'line',
                data: astrologerStats.map(item => item.sessions),
            },
        ],
    };

    const dashboardCards = [
        {
            title: "Total Users",
            icon: <FiUsers style={{ fontSize: '1.5rem', color: '#023F7A' }} />,
            value: dashboard?.total_users,
            link: PATHS?.USER_LIST
        },
        {
            title: "Total City",
            icon: <PiCity style={{ fontSize: '1.5rem', color: '#023F7A' }} />,
            value: dashboard?.total_approved_loans,
            link: PATHS?.CITY_LIST
        },
        {
            title: "Total Games",
            icon: <CgGames style={{ fontSize: '1.5rem', color: '#023F7A' }} />,
            value: dashboard?.total_pending_loans,
            link: PATHS?.GAME_LIST
        },
        {
            title: "Total Venues",
            icon: <FaVenus style={{ fontSize: '1.5rem', color: '#023F7A' }} />,
            value: dashboard?.total_rejected_loans,
            link: PATHS?.VENUE_LIST
        },
        {
            title: "Total Banners",
            icon: <PiFlagBannerFoldThin style={{ fontSize: '1.5rem', color: '#023F7A' }} />,
            value: dashboard?.total_loans,
            link: PATHS?.BANNER_LIST
        },
        {
            title: "Total Booking",
            icon: <FaRegCalendarAlt style={{ fontSize: '1.5rem', color: '#023F7A' }} />,
            value: dashboard?.total_loans,
            link: PATHS?.BOOKING_LIST
        },
    ];
    return (
        <>
            <div className="container-fluid mw-100">
                <div className="row">
                    {dashboardCards?.map((card, index) => (
                        <div className="col-12 col-sm-6 col-md-2 col-lg-3 " key={index}>
                            <div className="card border-1 zoom-in them-light shadow-sm">
                                <div className="card-body text-center">
                                    <Link to={card.link}>
                                        {/* <img src={PUBLIC_URL + card.icon} width={30} height={30} className="mb-3" alt="Icon" />
                                         */}
                                        <span>
                                            {card.icon}
                                        </span>
                                        <p className="fw-semibold fs-3 text-dark mb-1">{card.title}</p>
                                        <h5 className="fw-semibold text-dark mb-0">
                                            <CountUp start={0} end={card?.value || 0} duration={3} separator="," />
                                        </h5>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* <OwlCarousel className="owl-theme"
                    margin={10}
                    nav
                    autoplay
                    autoplayTimeout={1000}
                    autoplayHoverPause
                    key={dashboard?.totalCustomerList ? "123" : "145"}
                > */}

                {/* <div className="item">
                        <div className="card border-0 zoom-in dashbordColor shadow-none">
                            <div className="card-body">
                                <Link to={'/customer_list'} className="text-center">
                                    <img src={PUBLIC_URL + "/dist/images/svgs/icon-user-male.svg"} width={50} height={50} className="mb-3" alt="User Icon" />
                                    <p className="fw-semibold fs-3 text-dark mb-1">Customers</p>
                                    <h5 className="fw-semibold text-dark mb-0">{<CountUp start={0} end={dashboard?.totalCustomerList} duration={3} separator="," />}</h5>
                                </Link>
                            </div>
                        </div>
                    </div> */}

                {/* <div className="item">
                        <div className="card border-0 zoom-in bg-light-warning shadow-none">
                            <div className="card-body">
                                <Link to={'/category_list'} className="text-center">
                                    <img src={PUBLIC_URL + "/dist/images/svgs/icon-user-male.svg"} width={50} height={50} className="mb-3" alt="Consultation Icon" />
                                    <p className="fw-semibold fs-3 text-dark mb-1">Category</p>
                                    <h5 className="fw-semibold text-dark mb-0">
                                        {<CountUp start={0} end={dashboard?.consultationCount} duration={3} separator="," />}
                                    </h5>
                                </Link>
                            </div>
                        </div>
                    </div> */}

                {/* <div className="item">
                        <div className="card border-0 zoom-in dashbordColor shadow-none">
                            <div className="card-body">
                                <Link to={'/banner_list'} className="text-center">
                                    <img src={PUBLIC_URL + "/dist/images/svgs/icon-user-male.svg"} width={50} height={50} className="mb-3" alt="User Icon" />
                                    <p className="fw-semibold fs-3 text-dark mb-1">Banner</p>
                                    <h5 className="fw-semibold text-dark mb-0">{<CountUp start={0} end={dashboard?.totalBannerList} duration={3} separator="," />}</h5>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="item">
                        <div className="card border-0 zoom-in dashbordColor shadow-none">
                            <div className="card-body">
                                <Link to={'/blog_list'} className="text-center">
                                    <img src={PUBLIC_URL + "/dist/images/svgs/icon-user-male.svg"} width={50} height={50} className="mb-3" alt="Consultation Icon" />
                                    <p className="fw-semibold fs-3 text-dark mb-1">Blog</p>
                                    <h5 className="fw-semibold text-dark mb-0">
                                        {<CountUp start={0} end={dashboard?.totalBlogList} duration={3} separator="," />}
                                    </h5>
                                </Link>
                            </div>
                        </div>
                    </div> */}

                {/* <div className="item">
                        <div className="card border-0 zoom-in dashbordColor shadow-none">
                            <div className="card-body">
                                <Link to={'/couponcode_list'} className="text-center">
                                    <img src={PUBLIC_URL + "/dist/images/svgs/icon-user-male.svg"} width={50} height={50} className="mb-3" alt="Consultation Icon" />
                                    <p className="fw-semibold fs-3 text-dark mb-1">Coupon Code</p>
                                    <h5 className="fw-semibold text-dark mb-0">
                                        {<CountUp start={0} end={dashboard?.consultationCount} duration={3} separator="," />}
                                    </h5>
                                </Link>
                            </div>
                        </div>
                    </div> */}

                {/* <div className="item">
                        <div className="card border-0 zoom-in dashbordColor shadow-none">
                            <div className="card-body">
                                <Link to={'/our_celebrity_list'} className="text-center">
                                    <img src={PUBLIC_URL + "/dist/images/svgs/icon-user-male.svg"} width={50} height={50} className="mb-3" alt="Consultation Icon" />
                                    <p className="fw-semibold fs-3 text-dark mb-1">Our Celebrity</p>
                                    <h5 className="fw-semibold text-dark mb-0">
                                        {<CountUp start={0} end={dashboard?.totalOurCelebrityList} duration={3} separator="," />}
                                    </h5>
                                </Link>
                            </div>
                        </div>
                    </div> */}


                {/* Card for Astrologers */}
                {/* <div className="item">
                        <div className="card border-0 zoom-in dashbordColor shadow-none">
                            <div className="card-body">
                                <Link to={'/astrologer_list'} className="text-center cursor_pointer">
                                    <img src={PUBLIC_URL + "/dist/images/svgs/icon-user-male.svg"} width={50} height={50} className="mb-3" alt="Astrologer Icon" />
                                    <p className="fw-semibold fs-3 text-dark mb-1">Astrologers</p>
                                    <h5 className="fw-semibold text-dark mb-0">
                                        {<CountUp start={0} end={dashboard?.totalAstrologerList} duration={3} separator="," />}
                                    </h5>
                                </Link>
                            </div>
                        </div>
                    </div> */}

                {/* Card for Consultations */}
                {/* Other Cards */}

                {/* </OwlCarousel> */}

                {/* Row 2: Astrologer Ratings and Consultation Data */}
                {/* <div className="row mt-3">
                    <div className="col-lg-6">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h4 className="header-title mb-3">Astrologer Ratings</h4>
                                <div>
                                    <ReactECharts
                                        option={ratingOption}
                                        notMerge={true}
                                        lazyUpdate={true}
                                        theme={'light'}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h4 className="header-title mb-3">Consultations Over Time</h4>
                                <div>
                                    <ReactECharts
                                        option={consultationOption}
                                        notMerge={true}
                                        lazyUpdate={true}
                                        theme={'light'}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </>
    );
}

export default Index;
