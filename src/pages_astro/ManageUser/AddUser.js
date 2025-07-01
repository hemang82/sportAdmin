import React, { useState, useEffect, useRef } from 'react'
import Swal from 'sweetalert2'
import { useLocation, useNavigate } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form';
import Header from '../../layout/Header';
import Slidebar from '../../layout/Slidebar';
import Footer from '../../layout/Footer';
import { Language, TOAST_ERROR, TOAST_SUCCESS, allowLettersAndSpaces } from '../../config/common';
import { addCategory, categoryDetails, categoryDetials, CustomerDetails, editCategory, EditCustomer, updateCategoryQuestion } from '../../utils/api.services';
import SubNavbar from '../../layout/SubNavbar';
import categoryImage from '../../assets/Images/Group 48096953.png'
import { uploadImageOnAWS } from '../../utils/aws.service';
import { AwsFolder, Codes } from '../../config/constant';
import { SketchPicker } from 'react-color';
import { selectOption, textInputValidation, textValidation } from '../../config/commonFunction';
import { AstroInputTypesEnum, InputTypesEnum } from '../../config/commonVariable';
import { useDispatch } from 'react-redux';
import { setLoader } from '../../Store/slices/MasterSlice';
import { LazyLoadImage } from "react-lazy-load-image-component";
import CountryMobileNumber from '../../pages/CommonPages/CountryMobileNumber';

export default function AddUser() {

    const navigation = useNavigate();
    const dispatch = useDispatch();

    const location = useLocation();
    const [shoWcategoryImage, setShowCategoryImage] = useState(null);

    var customerData = location?.state;

    const { register, handleSubmit, setValue, clearErrors, reset, watch, control, formState: { errors }, } = useForm();

    useEffect(() => {
        if (customerData) {
            dispatch(setLoader(true))
            CustomerDetails({ customer_id: customerData?._id })?.then((response) => {
                if (response?.code === Codes.SUCCESS) {
                    let responseDetails = response?.data[0];
                    setValue(AstroInputTypesEnum?.NAME, responseDetails?.name);
                    setValue(AstroInputTypesEnum?.EMAIL, responseDetails?.email);
                    setValue(AstroInputTypesEnum?.COUNTRYCODE, responseDetails?.country_code);
                    setValue(AstroInputTypesEnum?.MOBILE, responseDetails?.country_code + ' ' + responseDetails?.mobile_number);
                    setValue(AstroInputTypesEnum?.BIRTH_DATE, responseDetails?.dob);
                    setValue(AstroInputTypesEnum?.TIME_OF_BIRTH, responseDetails?.time_of_birth);
                    setValue(AstroInputTypesEnum?.PLACE_OF_BIRTH, responseDetails?.place_of_birth);
                    setValue(AstroInputTypesEnum?.CURRENT_ADDRESH, responseDetails?.curr_address);
                    setValue(AstroInputTypesEnum?.CITY, responseDetails?.city);
                    setValue(AstroInputTypesEnum?.PINCODE, responseDetails?.pincode);
                    if (responseDetails?.gender) {
                        setValue(AstroInputTypesEnum.GENDER, '');
                    }
                }
            }).catch(error => {
            });
            dispatch(setLoader(false))
        }
    }, [customerData]);

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
                place_of_birth: data[AstroInputTypesEnum.PLACE_OF_BIRTH],
                curr_address: data[AstroInputTypesEnum.CURRENT_ADDRESH],
                city: data[AstroInputTypesEnum.CITY],
                pincode: data[AstroInputTypesEnum.PINCODE],
            }

            if (customerData) {
                request.customer_id = customerData._id;
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

    console.log('watch', watch());

    return (
        <>
            {/* <Slidebar />
            <div className="body-wrapper">
                <Header /> */}
            <div className="container-fluid mw-100">

                <SubNavbar title={customerData ? 'Edit Customer' : 'Add Customer'} header={'Customer List'} subHeaderOnlyView={customerData ? 'Edit Customer' : 'Add Customer'} />

                <div className="row m-2">
                    <div className="col-12 justify-content-center">
                        <div className='row justify-content-center '>
                            <form onSubmit={handleSubmit(onSubmitData)}>
                                <div className="card" >
                                    <div className="card-body">

                                        <div className="row justify-content-center">
                                            <div className="col-auto">
                                                <div className="card shadow-sm custom-card">

                                                </div>
                                            </div>
                                        </div>

                                        <div className='row g-3'>
                                            <div className='col-md-6'>
                                                <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        Name <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter Name"
                                                            // onKeyPress={allowLettersAndSpaces}
                                                            autoComplete='nope'
                                                            // {...register('category_en', { required: "Enter category" })}
                                                            {...register(AstroInputTypesEnum.NAME, textInputValidation(AstroInputTypesEnum.NAME, Language('Please Enter Name')))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.NAME]?.message}
                                                    </label>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        MObile Number <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter mobile number"
                                                            autoComplete='nope'
                                                            disabled
                                                            {...register(AstroInputTypesEnum.MOBILE, textInputValidation(AstroInputTypesEnum.MOBILE, Language('Please Enter Email')))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.MOBILE]?.message}
                                                    </label>
                                                </div>


                                                <div className="mb-4">
                                                    {/* <label htmlFor="exampleInputPassword1" className="form-label fw-semibold">Phone no<spna className="text-danger"> *</spna></label>
                                                    <CountryMobileNumber onChangeMobileNumber={onChangeMobileNumber} onChangeCountryCode={onChangeCountryCode} setDefaultData={customerData} imageIcon={false} />
                                                    <input type='hidden' {...register(AstroInputTypesEnum?.MOBILE, { required: "Please Enter Phone number" })} />
                                                    <input type='hidden' {...register(AstroInputTypesEnum?.COUNTRYCODE)} />
                                                    <label className="errorc ps-1 pt-1" >{errors.mobile_number?.message}</label> */}
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        Gender <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <select
                                                            className="form-control ps-2"
                                                            autoComplete="nope"
                                                            {...register(AstroInputTypesEnum.GENDER, {
                                                                required: "Please Enter Gender",
                                                            })}
                                                        >
                                                            <option value="">Select Gender</option>
                                                            <option value="M">Male</option>
                                                            <option value="F">Female</option>
                                                            <option value="O">Other</option>
                                                        </select>
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.GENDER]?.message}
                                                    </label>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="product_name" className="form-label fw-semibold">
                                                        City <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter city"
                                                            autoComplete='nope'
                                                            // {...register('category_ara', { required: "Enter category arabic" })}
                                                            {...register(AstroInputTypesEnum.CITY, textInputValidation(AstroInputTypesEnum.CITY, Language('Please enter city')))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.CITY]?.message}
                                                    </label>
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="product_name" className="form-label fw-semibold">
                                                        Current Address <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter current address"
                                                            autoComplete='nope'
                                                            // {...register('category_ara', { required: "Enter category arabic" })}
                                                            {...register(AstroInputTypesEnum.CURRENT_ADDRESH, textInputValidation(AstroInputTypesEnum.CURRENT_ADDRESH, Language('Enter current address')))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.CURRENT_ADDRESH]?.message}
                                                    </label>
                                                </div>
                                            </div>

                                            <div className='col-md-6'>

                                                <div className="mb-4">
                                                    <label htmlFor="product_name" className="form-label fw-semibold">
                                                        Time Of Birth <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="time"
                                                            className="form-control ps-2"
                                                            placeholder="Enter time of birth"
                                                            autoComplete='nope'
                                                            // {...register('category_ara', { required: "Enter category arabic" })}
                                                            {...register(AstroInputTypesEnum.TIME_OF_BIRTH, textInputValidation(AstroInputTypesEnum.TIME_OF_BIRTH, Language('Enter time of birth')))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.TIME_OF_BIRTH]?.message}
                                                    </label>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        Email <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter Email"
                                                            autoComplete='nope'
                                                            {...register(AstroInputTypesEnum.EMAIL, textInputValidation(AstroInputTypesEnum.EMAIL, Language('Please Enter Email')))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.EMAIL]?.message}
                                                    </label>
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="product_name" className="form-label fw-semibold">
                                                        Place Of Birth <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter place of birth"
                                                            // {...register('category_ara', { required: "Enter category arabic" })}
                                                            {...register(AstroInputTypesEnum.PLACE_OF_BIRTH, textInputValidation(AstroInputTypesEnum.PLACE_OF_BIRTH, Language('Enter place of birth')))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.PLACE_OF_BIRTH]?.message}
                                                    </label>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="product_name" className="form-label fw-semibold">
                                                        Birth Date <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="date"
                                                            className="form-control ps-2"
                                                            placeholder="Enter birth date"
                                                            autoComplete='nope'
                                                            // {...register('category_ara', { required: "Enter category arabic" })}
                                                            {...register(AstroInputTypesEnum.BIRTH_DATE, textInputValidation(AstroInputTypesEnum.BIRTH_DATE, Language('Enter birth date')))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.BIRTH_DATE]?.message}
                                                    </label>
                                                </div>

                                                <div className="mb-4">
                                                    {/* <label htmlFor="product_name" className="form-label fw-semibold">
                                                        Pincode <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter pincode"
                                                            autoComplete='nope'
                                                            // {...register('category_ara', { required: "Enter category arabic" })}
                                                            {...register(AstroInputTypesEnum.PINCODE, textInputValidation(AstroInputTypesEnum.PINCODE, Language('Enter pincode')))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.PINCODE]?.message}
                                                    </label> */}
                                                </div>


                                            </div>

                                            <div className="modal-footer justify-content-center mb-3">
                                                <button type='button' className="btn btn-danger m-2">Cancel</button>
                                                <button type='submit' className="btn btn-primary" >Submit</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                {/* </div > */}
            </div >

        </>
    )
}
