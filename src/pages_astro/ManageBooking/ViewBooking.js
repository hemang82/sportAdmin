import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { Language, TOAST_ERROR, TOAST_SUCCESS, formatDate } from '../../config/common';
import { EditCustomer } from '../../utils/api.services';
import SubNavbar from '../../layout/SubNavbar';
import { Codes } from '../../config/constant';
import { formatIndianPrice, textInputValidation, } from '../../config/commonFunction';
import { AstroInputTypesEnum, DateFormat, } from '../../config/commonVariable';
import { useDispatch } from 'react-redux';
import { setLoader } from '../../Store/slices/MasterSlice';

export default function ViewBooking() {
    const navigation = useNavigate();
    const dispatch = useDispatch();

    const location = useLocation();
    const [shoWcategoryImage, setShowCategoryImage] = useState(null);

    var bokkingDetails = location?.state;
    const { register, handleSubmit, setValue, clearErrors, reset, watch, control, formState: { errors } } = useForm();

    useEffect(() => {

        if (bokkingDetails) {
            dispatch(setLoader(true))
            // CustomerDetails({ customer_id: customerData?._id }).then((response) => {
            //     if (response?.code === Codes.SUCCESS) {
            // let location = location;
            setValue(AstroInputTypesEnum?.NAME, bokkingDetails?.name || ' - ');
            setValue(AstroInputTypesEnum?.EMAIL, bokkingDetails?.email || ' - ');
            setValue(AstroInputTypesEnum?.MOBILE, bokkingDetails?.country_code + ' ' + bokkingDetails?.mobile_number || ' - ');
            setValue(AstroInputTypesEnum?.STATE, bokkingDetails?.state || ' - ');
            setValue(AstroInputTypesEnum?.PASSWORD, bokkingDetails?.password || ' - ');
            setValue(AstroInputTypesEnum?.CREATE_USER, formatDate(bokkingDetails?.created_at, DateFormat?.DATE_TIME_MONTH_WISE_FORMAT) || ' - ');
            setValue(AstroInputTypesEnum?.CITY, bokkingDetails?.city || ' - ');

            // setValue(AstroInputTypesEnum?.PINCODE, customerData?.pincode || ' - ');
            if (bokkingDetails?.gender) {
                setValue(AstroInputTypesEnum.GENDER, '');
            }
            // }
            // }).catch(error => {
            // });
            dispatch(setLoader(false))
        }
    }, [bokkingDetails]);

    var onChangeMobileNumber = (mobileNumber) => {
        setValue('mobile_number', mobileNumber)
        clearErrors('mobile_number', '')
    }

    var onChangeCountryCode = (countryCode) => {
        setValue('country_code', countryCode?.country_code)
        clearErrors('country_code', '')
    }

    const onSubmitData = async (data) => {
        try {

            dispatch(setLoader(true))

            // let image = data?.category_image;
            // if (image instanceof Blob) image = await uploadImageOnAWS(image, AwsFolder?.CATEGORY_IMAGE);

            let request = {
                name: data[AstroInputTypesEnum.NAME],
                email: data[AstroInputTypesEnum.EMAIL],
                country_code: data[AstroInputTypesEnum.COUNTRYCODE] || '+91',
                mobile_number: data[AstroInputTypesEnum.MOBILE],
                gender: data[AstroInputTypesEnum.GENDER] || 'M',
                dob: data[AstroInputTypesEnum.BIRTH_DATE],
                time_of_birth: data[AstroInputTypesEnum.TIME_OF_BIRTH],
                // password: data[AstroInputTypesEnum.PASSWORD],
                curr_address: data[AstroInputTypesEnum.CREATE_USER],
                city: data[AstroInputTypesEnum.CITY],
                pincode: data[AstroInputTypesEnum.PINCODE],
            }

            if (bokkingDetails) {
                request.customer_id = bokkingDetails._id;
                EditCustomer(request).then((response) => {
                    if (response?.code === Codes.SUCCESS) {
                        TOAST_SUCCESS(response?.message)
                        navigation('/customer_list')
                    } else {
                        TOAST_ERROR(response.message)
                    }
                })
            } else {
                TOAST_ERROR('Somthing went wrong')
            }

            dispatch(setLoader(false))
        } catch (error) {
            TOAST_ERROR('Somthing went wrong')
        }
    }

    const handleImageChange = async (e) => {
        const image = e.target.files[0]
        setValue("category_image", image);
        clearErrors("category_image");
        setShowCategoryImage(URL.createObjectURL(image))
    }

    console.log('bokkingDetails', bokkingDetails);


    return (
        <>
            {/* <Slidebar />
            <div className="body-wrapper">
                <Header /> */}
            <div className="container-fluid mw-100">
                <SubNavbar title={bokkingDetails ? 'Booking Details' : 'Add User'} header={'Booking List'} subHeaderOnlyView={bokkingDetails ? 'Booking Details' : 'Add User'} />
                <div className="row">
                    <div className="col-12 justify-content-center">
                        <div className='row justify-content-center '>
                            <div className="card overflow-hidden chat-application ">

                                {/* <div className="d-flex align-items-center justify-content-between gap-3 m-3 d-lg-none">
                                    <button className="btn btn-primary d-flex" type="button" data-bs-toggle="offcanvas" data-bs-target="#chat-sidebar" aria-controls="chat-sidebar">
                                        <i className="ti ti-menu-2 fs-5" />
                                    </button>
                                    <form className="position-relative w-100">
                                        <input type="text" className="form-control search-chat py-2 ps-5" id="text-srh" placeholder="Search Contact" />
                                        <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark me-3" />
                                    </form>
                                </div> */}

                                <div className="d-flex w-100">

                                    <div className="d-flex w-100">
                                        <div className="w-100">
                                            <div className="chat-container">
                                                <div className="chat-box-inner-part h-100">
                                                    <div className="chatting-box app-email-chatting-box">
                                                        {/* <div className="p-9 py-3 border-bottom chat-meta-user d-flex align-items-center justify-content-between">
                                                            <h5 className="text-dark mb-0 fw-semibold">Profile Details</h5>
                                                            <ul className="list-unstyled mb-0 d-flex align-items-center">

                                                                <li className="nav-item ms-auto">
                                                                    <a className="btn btn-primary d-flex align-items-center px-3" id="add-notes">
                                                                        <i className="ti  me-0 me-md-1 fs-4" />
                                                                        <span className="d-none d-md-block font-weight-medium fs-3" >Edit Profile</span>
                                                                    </a>
                                                                </li>

                                                            </ul>
                                                        </div> */}

                                                        <div className="position-relative overflow-hidden">
                                                            <div className="position-relative">
                                                                <div className="chat-box p-9">
                                                                    <div className="chat-list chat active-chat" >

                                                                        {/* <div className="hstack align-items-start mb-7 pb-1 align-items-center justify-content-between">
                                                                            <div className="d-flex align-items-center gap-3">
                                                                                <img src={loanDetailsData?.profile_image || Constatnt?.DEFAULT_IMAGE} alt="user4" width={72} height={72} className="rounded-circle" />
                                                                                <div>
                                                                                    <h6 className="fw-semibold fs-4 mb-0">{loanDetailsData?.firstname + ' ' + loanDetailsData?.lastname}</h6>
                                                                                    <p className="mb-0">{loanDetailsData?.role == '1' ? 'Admin' : 'Sub admin'}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div> */}

                                                                        <div className="row">

                                                                            <div className="p-9 py-3 border-bottom chat-meta-user d-flex align-items-center justify-content-between mb-4">
                                                                                <h5 className="text-secondary mb-0 fw-semibold">Booking Details</h5>
                                                                                <ul className="list-unstyled mb-0 d-flex align-items-center">

                                                                                </ul>
                                                                            </div>
                                                                            <div className="col-5 mb-7">
                                                                                <p className="mb-1 fs-3">Order ID</p>
                                                                                <h6 className="fw-semibold mb-0 fs-4 text-capitalize">{bokkingDetails?.order_id}</h6>
                                                                            </div>
                                                                            <div className="col-6 mb-7">
                                                                                <p className="mb-1 fs-3">User Name</p>
                                                                                <h6 className="fw-semibold mb-0 fs-4 text-capitalize">{bokkingDetails?.user_name}</h6>
                                                                            </div>
                                                                            <div className="col-5 mb-7">
                                                                                <p className="mb-1 fs-3">Venue Name</p>
                                                                                <h6 className="fw-semibold mb-0 fs-4 text-capitalize">{bokkingDetails?.venue_name}</h6>
                                                                            </div>
                                                                            <div className="col-6 mb-7">
                                                                                <p className="mb-1 fs-3">Game Name</p>
                                                                                <h6 className="fw-semibold mb-0 fs-4 text-capitalize">{bokkingDetails?.game_name}</h6>
                                                                            </div>
                                                                            <div className="col-5 mb-7">
                                                                                <p className="mb-1 fs-3">Booking Date</p>
                                                                                <h6 className="fw-semibold mb-0 fs-4">{bokkingDetails?.slot_date}</h6>
                                                                            </div>
                                                                            <div className="col-7 mb-7">
                                                                                <p className="mb-1 fs-3">Booking Sloat</p>
                                                                                <h6 className="fw-semibold mb-0 fs-4">{bokkingDetails?.booking_slots}</h6>
                                                                            </div>
                                                                            <div className="col-5 mb-7">
                                                                                <p className="mb-1 fs-3">Price</p>
                                                                                <h6 className="fw-semibold mb-0 fs-4">{formatIndianPrice(bokkingDetails?.price)}</h6>
                                                                            </div>
                                                                            <div className="col-7 mb-7 d-flex">
                                                                                <div>
                                                                                    <p className="mb-1 fs-3">GST Amount</p>
                                                                                    <h6 className="fw-semibold mb-0 fs-4">{formatIndianPrice(bokkingDetails?.gst_amount)}</h6>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-5 mb-7">
                                                                                <p className="mb-1 fs-3">Payment Status</p>
                                                                                <h6 className="fw-semibold mb-0 fs-4">{bokkingDetails?.payment_status}</h6>
                                                                            </div>
                                                                            <div className="col-7 mb-7 ">
                                                                                <p className="mb-1 fs-3">City</p>
                                                                                <h6 className="fw-semibold mb-0 ">{bokkingDetails?.city_name}</h6>

                                                                            </div>

                                                                            {/* 
                                                                            <div className="p-9 py-3 border-bottom chat-meta-user d-flex align-items-center justify-content-between mb-4">
                                                                                <h5 className="text-secondary mb-0 fw-semibold">Loan Details</h5>
                                                                                <ul className="list-unstyled mb-0 d-flex align-items-center">
                                                                                </ul>
                                                                            </div>

                                                                            <div className="col-5 mb-7">
                                                                                <p className="mb-1 fs-3">Company Name</p>
                                                                                <h6 className="fw-semibold mb-0 fs-4 text-capitalize">{bokkingDetails?.company_name}</h6>
                                                                            </div>
                                                                            <div className="col-7 mb-7">
                                                                                <p className="mb-1 fs-3">Company Address</p>
                                                                                <h6 className="fw-semibold mb-0 fs-4">{bokkingDetails?.company_address}</h6>
                                                                            </div>
                                                                            <div className="col-5 mb-7">
                                                                                <p className="mb-1 fs-3">Designation</p>
                                                                                <h6 className="fw-semibold mb-0 fs-4 text-capitalize">{bokkingDetails?.designation}</h6>
                                                                            </div>
                                                                            <div className="col-7 mb-7">
                                                                                <p className="mb-1 fs-3">Purpose Of Loan</p>
                                                                                <h6 className="fw-semibold mb-0 fs-4">{bokkingDetails?.purpose_of_loan}</h6>
                                                                            </div>
                                                                            
                                                                            <div className="col-5 mb-7">
                                                                                <p className="mb-1 fs-3">Annual Income</p>
                                                                                <h6 className="fw-semibold mb-0 fs-4">{formatIndianPrice(bokkingDetails?.annual_income)}</h6>
                                                                            </div>

                                                                            <div className="col-7 mb-7">
                                                                                <p className="mb-1 fs-3">Desired Loan</p>
                                                                                <h6 className="fw-semibold mb-0 fs-4">{formatIndianPrice(bokkingDetails?.desired_loan)}</h6>
                                                                            </div>

                                                                            <div className="col-8 mb-7">
                                                                                {bokkingDetails?.approved_loan ? (
                                                                                    <div className="p-2">
                                                                                        <p className="mb-1 fs-3">Approved Loan Amount</p>
                                                                                        <h6 className="fw-semibold mb-0 fs-4 text-success">{formatIndianPrice(bokkingDetails?.approved_loan)}</h6>
                                                                                    </div>
                                                                                ) : ''}
                                                                            </div> */}

                                                                            {/* <div className="p-9 py-3 border-bottom chat-meta-user d-flex align-items-center justify-content-between mb-4">
                                                                                <h5 className="text-secondary mb-0 fw-semibold">Document Details</h5>
                                                                                <ul className="list-unstyled mb-0 d-flex align-items-center">
                                                                                </ul>
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
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* </div > */}
            </div >

        </>
    )
}
