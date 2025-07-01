import React, { useEffect, useState } from 'react'
import Header from '../../layout/Header';
import Slidebar from '../../layout/Slidebar';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import SubNavbar from '../../layout/SubNavbar';
import { setLoader } from '../../Store/slices/MasterSlice';
import profile_image from '../../assets/Images/default.jpg'
import { Codes, PUBLIC_URL } from '../../config/constant';
import { TOAST_ERROR } from '../../config/common';

const ContectDetails = () => {
    const navigat = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    var contactUsDetails = location?.state;

    const [ContactUsDetails, setContactUsDetails] = useState();

    return (
        <>

            {/* <Slidebar />
            <div className="body-wrapper">
                <Header /> */}
            {/* --------------------------------------------------- */}
            {/* Header End */}
            {/* --------------------------------------------------- */}
            <div className="container-fluid mw-100">

                <SubNavbar title={'ContactUs Details'} header={'ContactUs List'} subHeaderOnlyView={'ContactUs Details'} />

                <div className="tab-pane fade show active" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" tabIndex={1}>

                    <div className="card overflow-hidden chat-application">
                        <div className="d-flex align-items-center justify-content-between gap-3 m-3 d-lg-none">
                            <button className="btn btn-primary d-flex" type="button" data-bs-toggle="offcanvas" data-bs-target="#chat-sidebar" aria-controls="chat-sidebar">
                                <i className="ti ti-menu-2 fs-5" />
                            </button>
                            <form className="position-relative w-100">
                                <input type="text" className="form-control search-chat py-2 ps-5" id="text-srh" placeholder="Search Contact" />
                                <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark me-3" />
                            </form>
                        </div>

                        <div className="d-flex w-100">

                            <div className="d-flex w-100">

                                <div className="w-100">
                                    <div className="chat-container h-100 w-100">
                                        <div className="chat-box-inner-part h-100">
                                            <div className="chatting-box app-email-chatting-box">
                                                <div className="position-relative overflow-hidden">
                                                    
                                                    <div className="position-relative">
                                                        <div className="chat-box p-9" style={{ height: 'calc(100vh - 100px)' }} data-simplebar>
                                                            <div className="chat-list chat active-chat" data-user-id={1}>
                                                                <div className="row">
                                                                    <div className="col-6 mb-3">
                                                                        <p className="mb-1 fs-2">Name</p>
                                                                        <h6 className="fw-semibold mb-0 ">{contactUsDetails?.name || '-'}</h6>
                                                                    </div>
                                                                    <div className="col-6 mb-3">
                                                                        <p className="mb-1 fs-2">Email</p>
                                                                        <h6 className="fw-semibold mb-0 ">{contactUsDetails?.email || '-'}</h6>
                                                                    </div>

                                                                    {/* <div className="col-8 mb-7">
                                                                        <p className="mb-1 fs-2">Last name</p>
                                                                        <h6 className="fw-semibold mb-0">{ContactUsDetails?.last_name || '-'}</h6>
                                                                    </div>

                                                                    <div className="col-4 mb-7">
                                                                        <p className="mb-1 fs-2">Email address</p>
                                                                        <h6 className="fw-semibold mb-0">{ContactUsDetails?.email || '-'}</h6>
                                                                    </div> */}

                                                                    <div className="col-8 mb-9">
                                                                        <p className="mb-1 fs-2">Description</p>
                                                                        <h6 className="fw-semibold mb-0">{contactUsDetails?.description || '-'}</h6>
                                                                    </div>

                                                                    {/* <div className="col-4 mb-9">
                                                                        <p className="mb-1 fs-2">Subject</p>
                                                                        <h6 className="fw-semibold mb-0">{ContactUsDetails?.subject || '-'}</h6>
                                                                    </div>
                                                                    <div className="col-8 mb-9">
                                                                        <p className="mb-1 fs-2">Created at</p>
                                                                        <h6 className="fw-semibold mb-0">{ContactUsDetails?.created_at || '-'}</h6>
                                                                    </div>
                                                                    <div className="col-4 mb-9">
                                                                        <p className="mb-1 fs-2">Status</p>
                                                                        <h6 className="fw-semibold mb-0">{ContactUsDetails?.status || '-'}</h6>
                                                                    </div> */}
                                                                    {/* <div className="col-4 mb-7">
                                        <p className="mb-1 fs-2">City</p>
                                        <h6 className="fw-semibold mb-0">New York</h6>
                                    </div>
                                    <div className="col-8 mb-7">
                                        <p className="mb-1 fs-2">Country</p>
                                        <h6 className="fw-semibold mb-0">United Stats</h6>
                                    </div> */}
                                                                </div>
                                                                {/* <div className="border-bottom pb-7 mb-4">
                                    <p className="mb-2 fs-2">Notes</p>
                                    <p className="mb-3 text-dark">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque bibendum
                                        hendrerit lobortis. Nullam ut lacus eros. Sed at luctus urna, eu fermentum diam.
                                        In et tristique mauris.
                                    </p>
                                    <p className="mb-0 text-dark">Ut id ornare metus, sed auctor enim. Pellentesque nisi magna, laoreet a augue eget, tempor volutpat diam.</p>
                                </div> */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="offcanvas offcanvas-start user-chat-box" tabIndex={-1} id="chat-sidebar" aria-labelledby="offcanvasExampleLabel">

                            </div>
                        </div>
                    </div>
                </div>

                {/* </div> */}
            </div >
        </>
    )
}

export default ContectDetails;
