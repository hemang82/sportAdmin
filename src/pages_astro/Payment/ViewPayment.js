import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import Header from '../../layout/Header';
import Slidebar from '../../layout/Slidebar';
import SubNavbar from '../../layout/SubNavbar';
import { Childerndetials, customerDetails, getPostList, previewChildren, userDetials } from '../../utils/api.services';
import { TOAST_ERROR, formatDate } from '../../config/common';
import Constatnt, { Codes, DATE_YEAR_WISE_DASH_TIME_FORMAT, ModelName, PUBLIC_URL } from '../../config/constant';
import { getPostListThunk, setLoader, setModalStatus, setModel } from '../../Store/slices/MasterSlice';
import profileImage from '../../assets/Images/default.jpg'
import Footer from '../../layout/Footer';
import { CustomModel, DeleteComponent, PostComponent } from '../CommonPages/CommonComponent';
import Model from '../../component/Model';
import { openModel } from '../../config/commonFunction';
import Pagination from '../../component/Pagination';
import PostDetails from '../ManagePost/PostDetails';

const ViewCustomer = () => {

    const navigat = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const locationData = location?.state;

    const { customModel } = useSelector((state) => state.masterslice);
    const { postList: { data: postList }, } = useSelector((state) => state.masterslice);

    const {
        register,
        handleSubmit,
        setValue,
        clearErrors,
        reset,
        control,
        watch,
        formState: { errors },
    } = useForm();

    const [customerdetails, setCustomerDetails] = useState();
    const [postDetailsData, setPostDetailsData] = useState();


    const [page, setPage] = useState(1);
    const [postModel, setPostModel] = useState(false);

    const onSubmit = async (worksheetData) => {
        // dispatch(setLoader(true));
        // let submitData = {
        //     worksheet_submit_id: worksheetLocationData?.id,
        //     total_marks: worksheetData?.totalMarks,
        //     obtain_marks: worksheetData?.obtainMarks,
        //     is_answer_submitted: '1'
        // };
        // const { code, message } = await API.addSubmitedWorksheetMarksAPI(submitData);
        // if (code === '1') {
        //     dispatch(getWorksheetAnswerList({ worksheet_submit_id: worksheetLocationData?.id }));
        //     TOAST_SUCCESS(message);
        // }
        // dispatch(setLoader(false));
    };

    // const inputHandler = (e) => {
    //     const { value, maxLength } = e.target;
    //     if (String(value).length >= maxLength) {
    //         e.preventDefault();
    //         return;
    //     }
    // };

    // useEffect(() => {
    //     let request = {
    //         customer_id: locationData?.id,
    //     }
    //     userDetials(request).then((response) => {
    //         if (response?.code === '1') {
    //             setCustomerData(response?.data)
    //         } else {
    //             setCustomerData([])
    //         }
    //     })
    // }, [locationData])

    // useEffect(() => {
    //     dispatch(setLoader(true))

    //     let request = {
    //         customer_id: locationData?.id,
    //     }
    //     userDetials(request).then((response) => {
    //         if (response?.code === '1') {
    //             console.log('response detials ', response?.data);
    //             setCustomerData(response?.data?.userDetails)
    //             setBookingData(response?.data?.bookingDetails)
    //             setChildernDetials(response?.data?.childrenList)
    //             // setChildernDetials(response?.data?.childrenList)
    //             setcustomerAddress(response?.data?.customerAddress)
    //             dispatch(setLoader(false))

    //         } else {
    //             setCustomerData([])
    //         }
    //     })


    //     console.log('ChildernDetials', ChildernDetials);

    // }, [locationData])

    useEffect(() => {
        dispatch(setLoader(true));
        let request = {
            customer_id: locationData?._id,
            page: page,
            // search: globalFilterValue,
        };
        dispatch(getPostListThunk(request))
        dispatch(setLoader(false));
    }, [page, locationData]);

    useEffect(() => {
        dispatch(setLoader(true))
        customerDetails({ customer_id: locationData?._id }).then((response) => {
            if (response?.code === Codes.SUCCESS) {
                setCustomerDetails(response?.data)
                // setPostList(response?.data?.postList)
            } else {
                TOAST_ERROR(response?.message)
            }
        })

        dispatch(setLoader(false))

    }, [page, locationData])

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };


    return (
        <>
            {/* <Slidebar />

            <div className="body-wrapper">
                <Header /> */}

            <div className="container-fluid mw-100">

                <SubNavbar title={'Customer Details'} header={'Customer List'} subHeaderOnlyView={'Customer Details'} />

                {/* ------------------------------------- Tab Name -------------------------------------------- */}

                <ul className="nav nav-pills user-profile-tab justify-content-end mt-2 border border-2 rounded-2 mb-3" id="pills-tab" role="tablist">

                    <li className="nav-item" role="presentation">
                        <button className="nav-link position-relative rounded-0 active d-flex align-items-center justify-content-center bg-transparent fs-3 py-6" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="true">
                            <i className="ti ti-user-circle me-2 fs-6" />
                            <span className="d-none d-md-block">Customer Details</span>
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-6" id="pills-followers-tab" data-bs-toggle="pill" data-bs-target="#pills-followers" type="button" role="tab" aria-controls="pills-followers" aria-selected="false">
                            <i className="ti ti-photo-plus  me-2 fs-6" />
                            <span className="d-none d-md-block">{postModel ? 'Post Details' : 'Post'}  </span>
                        </button>
                    </li>

                    {/* <li className="nav-item" role="presentation">
                        <button className="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-6" id="pills-friends-tab" data-bs-toggle="pill" data-bs-target="#pills-friends" type="button" role="tab" aria-controls="pills-friends" aria-selected="false">
                            <i className="ti ti-user-circle me-2 fs-6" />
                            <span className="d-none d-md-block">Friends</span>
                        </button>
                          </li>

                    `   <li className="nav-item" role="presentation">
                        <button className="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-6" id="pills-gallery-tab" data-bs-toggle="pill" data-bs-target="#pills-gallery" type="button" role="tab" aria-controls="pills-gallery" aria-selected="false">
                            <i className="ti ti-photo-plus me-2 fs-6" />
                            <span className="d-none d-md-block">Gallery</span>
                        </button>
                        </li> */}

                </ul>

                {/* ------------------------------------- Tab Mange  -------------------------------------------- */}

                <div className="tab-content" id="pills-tabContent">

                    {/* ------------------------------------- Tab content 1  -------------------------------------------- */}

                    <div className="tab-pane fade show active" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" tabIndex={1}>

                        <div className="card overflow-hidden chat-application">
                            <div className="d-flex align-items-center justify-content-between gap-3 m-3 d-lg-none">
                                <button className="btn btn-primary d-flex" type="button" data-bs-toggle="offcanvas" data-bs-target="#chat-sidebar" aria-controls="chat-sidebar">
                                    <i className="ti ti-menu-2 fs-5" />
                                </button>
                                <form className="position-relative w-100">
                                    <input type="text" className="form-control search-chat py-2 ps-5" id="text-srh" placeholder="Search Customer" />
                                    <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark me-3" />
                                </form>
                            </div>

                            <div className="d-flex w-100">
                                <div className="d-flex w-100">
                                    <div className="w-100">
                                        <div className="chat-container h-100 w-100">
                                            <div className="chat-box-inner-part h-100">
                                                <div className="chatting-box app-email-chatting-box">
                                                    <div className="p-9 py-3 border-bottom chat-meta-user d-flex align-items-center justify-content-between">
                                                        <h5 className="text-dark mb-0 fw-semibold">Customer Details</h5>

                                                        <ul className="list-unstyled mb-0 d-flex align-items-center">
                                                            {/* <div className="px-9 pt-4 pb-3">
                                                        <button className="btn btn-primary fw-semibold py-8 w-100">Edit Profile</button>
                                                    </div> */}
                                                        </ul>
                                                    </div>

                                                    <div className="position-relative overflow-hidden">
                                                        <div className="position-relative">
                                                            <div className="chat-box p-9" style={{ height: 'calc(100vh - 200px)' }} data-simplebar>
                                                                <div className="chat-list chat active-chat" data-user-id={1}>

                                                                    <div className="hstack align-items-start mb-7 pb-1 align-items-center justify-content-between">
                                                                        <div className="d-flex align-items-center gap-3">
                                                                            <img src={`https://eveksia.s3.me-central-1.amazonaws.com/profile_image/1721286162134.png`} alt="user4" width={72} height={72} className="rounded-circle" />
                                                                            <div>
                                                                                <h6 className="fw-semibold fs-4 mb-0">{customerdetails?.userDetials?.first_name + ' ' + customerdetails?.userDetials?.last_name}</h6>
                                                                                <p className="mb-0">{customerdetails?.userDetials?.user_name}</p>
                                                                                {/* <p className="mb-0">Digital Arc Pvt. Ltd.</p> */}
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="row m-3">

                                                                        <div className="col-4 mb-7">
                                                                            <p className="mb-1 fs-2">Name</p>
                                                                            <h6 className="fw-semibold mb-0">{customerdetails?.userDetials?.first_name}</h6>
                                                                        </div>
                                                                        {/* <div className="col-8 mb-7">
                                                                            <p className="mb-1 fs-2">Last name</p>
                                                                            <h6 className="fw-semibold mb-0">{customerdetails?.userDetials?.last_name}</h6>
                                                                        </div> */}
                                                                        <div className="col-4 mb-7">
                                                                            <p className="mb-1 fs-2">Mobile number</p>
                                                                            <h6 className="fw-semibold mb-0">{customerdetails?.userDetials?.country_code + ' ' + customerdetails?.userDetials?.mobile_number}</h6>
                                                                        </div>
                                                                        <div className="col-8 mb-7">
                                                                            <p className="mb-1 fs-2">Email address</p>
                                                                            <h6 className="fw-semibold mb-0">{customerdetails?.userDetials?.email}</h6>
                                                                        </div>
                                                                        <div className="col-4 mb-7">
                                                                            <p className="mb-1 fs-2">Gender</p>
                                                                            <h6 className="fw-semibold mb-0">{customerdetails?.userDetials?.introduction}</h6>
                                                                        </div>

                                                                        <div className="col-8 mb-7">
                                                                            <p className="mb-1 fs-2">Date Of Birth</p>
                                                                            <h6 className="fw-semibold mb-0">{customerdetails?.Post}</h6>
                                                                        </div>
                                                                        <div className="col-4 mb-7">
                                                                            <p className="mb-1 fs-2">Time Of Birth</p>
                                                                            <h6 className="fw-semibold mb-0">{customerdetails?.gift_count}</h6>
                                                                        </div>
                                                                        <div className="col-8 mb-7">
                                                                            <p className="mb-1 fs-2">Place Of Birth</p>
                                                                            <h6 className="fw-semibold mb-0">{customerdetails?.token_count}</h6>
                                                                        </div>
                                                                        <div className="col-4 mb-7">
                                                                            <p className="mb-1 fs-2">Current Address</p>
                                                                            <h6 className="fw-semibold mb-0">{customerdetails?.Follower}</h6>
                                                                        </div>
                                                                        <div className="col-8 mb-7">
                                                                            <p className="mb-1 fs-2">City</p>
                                                                            <h6 className="fw-semibold mb-0">{customerdetails?.Following}</h6>
                                                                        </div>
                                                                        <div className="col-4 mb-7">
                                                                            <p className="mb-1 fs-2">Pincode</p>
                                                                            <h6 className="fw-semibold mb-0">{customerdetails?.Total_live}</h6>
                                                                        </div>
                                                                        <div className="col-4 mb-7">
                                                                            <p className="mb-1 fs-2">Language</p>
                                                                            <h6 className="fw-semibold mb-0">{customerdetails?.Total_live}</h6>
                                                                        </div>

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


                        {/* <PostComponent postData={''} /> */}
                    </div>

                    {/* ------------------------------------- Tab content 2  -------------------------------------------- */}

                    <div className="tab-pane fade" id="pills-followers" role="tabpanel" aria-labelledby="pills-followers-tab" tabIndex={0}>
                        {
                            postModel === true ? (<>

                                <PostComponent postDetails={postDetailsData} postModel={postModel} setPostModel={setPostModel} />

                            </>) : (<>

                                <div className="card overflow-hidden chat-application">
                                    <div className="d-flex align-items-center justify-content-between gap-3 m-3 d-lg-none">
                                        <button className="btn btn-primary d-flex" type="button" data-bs-toggle="offcanvas" data-bs-target="#chat-sidebar" aria-controls="chat-sidebar">
                                            <i className="ti ti-menu-2 fs-5" />
                                        </button>
                                        <form className="position-relative w-100">
                                            <input type="text" className="form-control search-chat py-2 ps-5" id="text-srh" placeholder="Search Customer" />
                                            <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark me-3" />
                                        </form>
                                    </div>

                                    <div className="d-flex w-100">

                                        <div className="d-flex w-100">

                                            <div className="w-100">
                                                <div className="chat-container h-100 w-100">
                                                    <div className="chat-box-inner-part h-100">

                                                        <div className="chatting-box app-email-chatting-box">
                                                            {/* <div className="card card-body"> */}
                                                            <div className='row'>
                                                                {postList?.postList && postList?.postList.length > 0 ? (
                                                                    postList.postList.map((data, index) => (
                                                                        <div className='col-md-6 col-lg-3' key={index}>
                                                                            <div className="card">
                                                                                <div className="card-body">
                                                                                    <div className="d-flex align-items-center">
                                                                                        <img src={!data?.userDetails?.profile_image ? data?.userDetails?.profile_image : PUBLIC_URL + "/dist/images/profile/user-4.jpg"} alt="user4" width={72} height={72} className="rounded-circle" />

                                                                                        <div className="ms-3">
                                                                                            <h4 className="card-title">{data?.userDetails?.first_name + ' ' + data?.userDetails?.last_name}</h4>
                                                                                            <p className="card-subtitle mb-0">{data?.created_at}</p>
                                                                                        </div>
                                                                                        <div className="ms-auto">
                                                                                            <div className="dropdown">
                                                                                                <a href="#" className="link" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                                                                                    <i className="ti ti-dots fs-6 text-dark" />
                                                                                                </a>
                                                                                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                                                                    <li>
                                                                                                        <a className="dropdown-item" onClick={() => { openModel(dispatch, ModelName.POST_MODEL); setPostDetailsData(data); }}>
                                                                                                            View Post
                                                                                                        </a>
                                                                                                    </li>
                                                                                                    <li>
                                                                                                        <a className="dropdown-item" onClick={() => { openModel(dispatch, ModelName.DELETE_MODEL); setPostDetailsData(data); }}>
                                                                                                            Delete Post
                                                                                                        </a>
                                                                                                    </li>
                                                                                                    <li><a className="dropdown-item">Active</a></li>
                                                                                                </ul>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>

                                                                                    {/* <img src={PUBLIC_URL + "/dist/images/big/img5.jpg"} className="img-fluid rounded-1 mt-4 post-image" alt="main content" onClick={() => { setPostModel(true); setPostDetailsData(data); }} />
                                                                                    <div className="mt-4">
                                                                                        <p className="fs-4">
                                                                                            {data?.description}😍 🥰<a href="#">#beauty</a>
                                                                                        </p>
                                                                                    </div> */}

                                                                                    <img src={data?.poster} className="img-fluid rounded-1 mt-4 post-image" alt="main content" onClick={() => { setPostModel(true); setPostDetailsData(data); }} />

                                                                                    <div className="mt-4">
                                                                                        <p className="fs-4">
                                                                                            <label className="fs-4">
                                                                                                <b> {data.title} </b>
                                                                                            </label> <br></br>
                                                                                            <label className="fs-4">
                                                                                                {data.description || 'hello How are you'}
                                                                                            </label>
                                                                                            <a href="#"> #goa🏄🏽‍♀️</a>
                                                                                            {/* <a href="#">#goa🏄🏽‍♀️</a> <a href="#">#india</a> <a href="#">#happylife</a> */}
                                                                                        </p>
                                                                                    </div>
                                                                                    <div className="d-flex align-items-center">
                                                                                        <a href="#" className="me-3">
                                                                                            <i className="ti ti-heart text-dark fs-7" />
                                                                                        </a>
                                                                                        <a href="#" className="me-3">
                                                                                            <i className="ti ti-message-circle text-dark fs-7" />
                                                                                        </a>
                                                                                        <a href="#" className="me-2">
                                                                                            <i className="ti ti-send text-dark fs-7" />
                                                                                        </a>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <div className="col-12 m-3 mb-5">
                                                                        <h3 className="text-center m-2 ">No Customer found</h3>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <Pagination per_page={Constatnt.per_page} pageCount={postList?.totalCount} onPageChang={handlePageChange} page={page} lableName={'Post List'} />
                                                            {/* </div> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="offcanvas offcanvas-start user-chat-box" tabIndex={-1} id="chat-sidebar" aria-labelledby="offcanvasExampleLabel">
                                        </div>
                                    </div>
                                </div>

                            </>)
                        }
                    </div>

                    {/* ------------------------------------- Tab content 3  -------------------------------------------- */}

                    {/* <div className="tab-pane fade" id="pills-friends" role="tabpanel" aria-labelledby="pills-friends-tab" tabIndex={0}>
                            <h1>3</h1>
                        </div> */}

                    {/* ------------------------------------- Tab content 4  -------------------------------------------- */}

                    {/* <div className="tab-pane fade" id="pills-gallery" role="tabpanel" aria-labelledby="pills-gallery-tab" tabIndex={0}>
                            <h1>4</h1>
                        </div> */}
                </div>

            </div>
            {/* </div > */}

            {customModel.isOpen && customModel?.modalType === ModelName.POST_MODEL && (<>
                <PostComponent postData={''} />
            </>)}

            {
                customModel.isOpen && customModel?.modalType === ModelName.DELETE_MODEL && (
                    <Model>
                        <DeleteComponent />
                    </Model >
                )
            }



        </>
    )
}

export default ViewCustomer
