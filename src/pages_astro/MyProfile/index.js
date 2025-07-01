import React, { useEffect, useRef, useState } from 'react'
import Header from '../../layout/Header';
import Slidebar from '../../layout/Slidebar';
import { Controller, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '../../layout/Footer';
import { TOAST_ERROR, TOAST_SUCCESS, allowLettersAndSpaces } from '../../config/common';
import SubNavbar from '../../layout/SubNavbar';
import profile_image from '../../assets/Images/default.jpg'
import { editProfile } from '../../utils/api.services';
import { uploadImageOnAWS } from '../../utils/aws.service';
import Constatnt, { AwsFolder, Codes, PUBLIC_URL } from '../../config/constant';
import CountryMobileNumber from '../../pages/CommonPages/CountryMobileNumber';
import ChangePassword from './ChangePassword';
import { useDispatch, useSelector } from 'react-redux';
import { setLoader } from '../../Store/slices/MasterSlice';
import { InputTypesEnum } from '../../config/commonVariable';
import { isValidInput, textValidation, handelInputText } from '../../config/commonFunction';
import AppSettings from './AppSettings';
import Sitemap from './Sitemap';

const MyProfile = () => {

    const location = useLocation();
    const navigation = useNavigate();
    const imageRef = useRef();
    const dispatch = useDispatch()
    const profileData = JSON.parse(localStorage.getItem(Constatnt.AUTH_KEY))
    const userDetailsData = "";
    // const { userDetails: { data: userDetailsData }, } = useSelector((state) => state.users);
    // const { countryListData: { data: countryListData }, } = useSelector((state) => state.countryList);

    // ---------------------- only redux api call for rendering page ----------------------------------------------

    const [ShowProfileImage, setShowProfileImage] = useState(null);
    const [CountryCode, setCountryCode] = useState(null);
    const [profileModel, setProfileModel] = useState(null);

    console.log('selectedCoCountryCode', CountryCode);

    const { register, handleSubmit, setValue, clearErrors, reset, watch, control, formState: { errors } } = useForm();

    useEffect(() => {
        reset({
            profile_image: userDetailsData?.profile_image,
            firstName: userDetailsData?.firstname,
            lastName: userDetailsData?.lastname,
            email: userDetailsData?.email,
            country_code: userDetailsData?.country_code,
            mobile_number: `${userDetailsData?.mobile_number}`,
            is_online: userDetailsData?.is_online
        });
        // setischange(false)
        setShowProfileImage(userDetailsData?.profile_image_link)
        // setProfileImageState(defaultImage);
    }, [])

    const handleImageChange = async (image) => {
        console.log('image data', image);
        setValue("profile_image", image);
        clearErrors("profile_image");
        setShowProfileImage(URL.createObjectURL(image))
    }

    var onChangeMobileNumber = (mobileNumber) => {
        console.log('onChangemobileNumber', mobileNumber);
        setValue('mobile_number', mobileNumber)
        clearErrors('mobile_number', '')
    }

    var onChangeCountryCode = (countryCode) => {
        console.log('onChangemobileNumber', countryCode);
        setValue('country_code', countryCode?.country_code)
        clearErrors('country_code', '')
    }

    const onSubmitData = async (data) => {
        try {

            dispatch(setLoader(true))

            let image = data?.profile_image;
            if (image instanceof Blob) image = await uploadImageOnAWS(image, AwsFolder?.PROFILE_IMAGE);

            let request = {
                user_id: profileData?.id,
                firstname: data.firstName,
                lastname: data.lastName,
                email: data.email,
                country: data?.country,
                country_id: data?.country_id,
                country_code: data?.country_code,
                mobile_number: data?.mobile_number,
                profile_image: image,
            }

            // editProfile(request).then((response) => {
            //     console.log('response editProfile:', response);
            //     if (response.code === Codes.SUCCESS) {
            //         localStorage.setItem(Constatnt.AUTH_KEY, JSON.stringify(response?.data));
            //         navigation('/my_profile')
            //         setProfileModel(false)
            //         TOAST_SUCCESS(response.message);
            //     }
            // })
            dispatch(setLoader(false))

        } catch (err) {
            TOAST_ERROR(err.message)
        }
    }

    return (
        <>
            {/* --------------------------------------------------- */}
            {/* Header End */}
            {/* --------------------------------------------------- */}
            <div className="container-fluid mw-100">

                <SubNavbar title={"Admin Profile"} header={'Admin Profile'} />

                <ul className="nav nav-pills user-profile-tab justify-content-end mt-2 border border-2 rounded-2 mb-3 " id="pills-tab" role="tablist">

                    {/* <li className="nav-item" role="presentation">
                        <button className="nav-link position-relative rounded-0 active d-flex align-items-center justify-content-center bg-transparent fs-3 py-6" id="pills-followers-tab" data-bs-toggle="pill" data-bs-target="#pills-followers" type="button" role="tab" aria-controls="pills-followers" aria-selected="true">
                            <i class="ti ti-key me-2 fs-6"></i>
                            <span className="d-none d-md-block">Change Password</span>
                        </button>
                    </li>

                    <li className="nav-item" role="presentation">
                        <button className="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-6" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-settings" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">
                            <i className="ti ti-user-circle me-2 fs-6" />
                            <span className="d-none d-md-block">App Settings</span>
                        </button>
                    </li> */}

                    <li className="nav-item" role="presentation">
                        <button className="nav-link active position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-6" id="pills-change-password-tab" data-bs-toggle="pill" data-bs-target="#pills-change-password" type="button" role="tab" aria-controls="pills-change-password" aria-selected="true">
                            <i className="ti ti-key me-2 fs-6"></i>
                            <span className="d-none d-md-block">Change Password</span>
                        </button>
                    </li>
{/* 
                    <li className="nav-item" role="presentation">
                        <button className="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-6" id="pills-app-settings-tab" data-bs-toggle="pill" data-bs-target="#pills-app-settings" type="button" role="tab" aria-controls="pills-app-settings" aria-selected="false">
                            <i className="ti ti-user-circle me-2 fs-6" />
                            <span className="d-none d-md-block">App Settings</span>
                        </button>
                    </li> */}

                    {/* <li className="nav-item" role="presentation">
                        <button className="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-6" id="pills-chat-setting-tab" data-bs-toggle="pill" data-bs-target="#pills-chat-setting" type="button" role="tab" aria-controls="pills-chat-setting" aria-selected="false">
                            <i className="ti ti-settings me-2 fs-6" />
                            <span className="d-none d-md-block">Sitemap</span>
                        </button>
                    </li> */}

                    {/* <li className="nav-item" role="presentation">
                            <button className="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-6" id="pills-friends-tab" data-bs-toggle="pill" data-bs-target="#pills-friends" type="button" role="tab" aria-controls="pills-friends" aria-selected="false">
                                <i className="ti ti-user-circle me-2 fs-6" />
                                <span className="d-none d-md-block">Friends</span>
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link position-relative rounded-0 d-flex align-items-center justify-content-center bg-transparent fs-3 py-6" id="pills-gallery-tab" data-bs-toggle="pill" data-bs-target="#pills-gallery" type="button" role="tab" aria-controls="pills-gallery" aria-selected="false">
                                <i className="ti ti-photo-plus me-2 fs-6" />
                                <span className="d-none d-md-block">Gallery</span>
                            </button>
                        </li> */}
                </ul>

                <div className="tab-content" id="pills-tabContent">
                    <div className="tab-pane fade show active" id="pills-change-password" role="tabpanel" aria-labelledby="pills-change-password-tab">
                        <ChangePassword />
                    </div>

                    <div className="tab-pane fade" id="pills-app-settings" role="tabpanel" aria-labelledby="pills-app-settings-tab">
                        <AppSettings />
                    </div>

                    <div className="tab-pane fade" id="pills-chat-setting" role="tabpanel" aria-labelledby="pills-chat-setting-tab">
                        <Sitemap />
                    </div>
                </div>

                {/* Modal Add notes */}

                <div className={`modal custom-modal  ${profileModel ? "fade show d-block " : "d-none"}`} id="addnotesmodal" tabIndex={-1} role="dialog" aria-labelledby="addnotesmodalTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document" >
                        <div className="modal-content border-0">
                            <div className="modal-header bg-primary " style={{ borderRadius: '10px 10px 0px 0px' }}>
                                <h6 className="modal-title text-light">Edit Profile</h6>
                                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={() => { setProfileModel(false) }} />
                            </div>

                            <div className="modal-body">
                                <form onSubmit={handleSubmit(onSubmitData)} >
                                    <div className="col-lg-12">
                                        {/* <div className="card"> */}
                                        <div className="card-body p-4">
                                            <div className="mb-2">
                                                <label htmlFor="exampleInputPassword1" className="form-label fw-semibold">Profile image<spna className="text-danger"> *</spna></label>
                                                <div className="d-flex justify-content-center">
                                                    <div className="col-5">
                                                        <div className="card border">
                                                            <div className="card-body">
                                                                {/* {
                                                                    ShowProfileImage ? 
                                                                } */}
                                                                <div className="dropzone p-2 cursor_pointer" onClick={() => {
                                                                    imageRef.current.click()
                                                                }}>

                                                                    {
                                                                        ShowProfileImage ? (<>
                                                                            <div className="image-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
                                                                                <img src={ShowProfileImage} className='dz-default dz-message' style={{ objectFit: 'contain', height: '80px', width: '80px' }} />
                                                                            </div>

                                                                        </>) : (<>
                                                                            <div class="dz-default dz-message fs-1">Upload image</div></>)
                                                                    }

                                                                    {/* <div className="fallback">
                                                                        <Controller name="profile_image"
                                                                            control={control} defaultValue={null}
                                                                            rules={{ required: 'File is required' }}
                                                                            render={({ field }) => (<>
                                                                                <input type="file" name='profile_image' className="custom-file-input form-control d-none" id="profile_image" accept="image/*" onChange={(e) => { handleImageChange(e.target.files[0]); }} ref={imageRef} />
                                                                            </>
                                                                            )} />
                                                                        <input name="file" type="file" className='d-none' ref={imageRef} />
                                                                    </div> */}
                                                                    <p className='text-danger pt-1'> <span>{errors.profile_image && errors.profile_image.message}</span></p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="exampleInputPassword1" className="form-label fw-semibold">First name<spna className="text-danger"> *</spna></label>
                                                <div className="input-group border rounded-1">
                                                    <span className="input-group-text bg-transparent px-6 border-0" id="basic-addon1"><i className="ti ti-user fs-6" /></span>
                                                    <input type="text" className="form-control border-0 ps-2 form-control " placeholder="Enter first name" onKeyPress={handelInputText} {...register(InputTypesEnum.FIRSTNAME, textValidation(InputTypesEnum.FIRSTNAME))} />
                                                </div>
                                                <label className="errorc ps-1 pt-1" >{errors.firstName?.message}</label>
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="exampleInputPassword1" className="form-label fw-semibold">Last name<spna className="text-danger"> *</spna></label>
                                                <div className="input-group border rounded-1">
                                                    <span className="input-group-text bg-transparent px-6 border-0" id="basic-addon1"><i className="ti ti-user fs-6" /></span>
                                                    <input type="text" className="form-control border-0 ps-2" placeholder="Enter last name" onKeyPress={handelInputText} autoComplete='nope' {...register(InputTypesEnum.LASTNAME, textValidation(InputTypesEnum.LASTNAME))} />
                                                </div>
                                                <label className="errorc ps-1 pt-1" >{errors.lastName?.message}</label>
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="exampleInputPassword1" className="form-label fw-semibold">Email<spna className="text-danger"> *</spna></label>
                                                <div className="input-group border rounded-1">
                                                    <span className="input-group-text bg-transparent px-6 border-0" id="basic-addon1"><i className="ti ti-mail fs-6" /></span>
                                                    <input type="text" className="form-control border-0 ps-2" placeholder="Enter your email address" onChange={handelInputText} {...register(InputTypesEnum.EMAIL, textValidation(InputTypesEnum.EMAIL))} />
                                                </div>
                                                <label className="errorc ps-1 pt-1" >{errors.email?.message}</label>
                                            </div>

                                            <div className="mb-4">
                                                {/* <label htmlFor="exampleInputPassword1" className="form-label fw-semibold">Phone no<spna className="text-danger"> *</spna></label>
                                                <CountryMobileNumber onChangeMobileNumber={onChangeMobileNumber} onChangeCountryCode={onChangeCountryCode} setDefaultData={userDetailsData} imageIcon={true} />
                                                <input type='hidden' {...register(InputTypesEnum?.MOBILE, { required: "Enter mobile number" })} />
                                                <input type='hidden' {...register(InputTypesEnum?.COUNTRYCODE)} />
                                                <label className="errorc ps-1 pt-1" >{errors.mobile_number?.message}</label> */}
                                            </div>

                                            <div className="modal-footer justify-content-center">
                                                <button type='button' className="btn btn-danger" onClick={() => { setProfileModel(false) }}>Cancel</button>
                                                <button type='submit' className="btn btn-primary" >Submit</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div >
                {
                    profileModel && (
                        <div className="modal-backdrop fade show"></div>
                    )
                }

            </div >
        </>
    )
}

export default MyProfile;
