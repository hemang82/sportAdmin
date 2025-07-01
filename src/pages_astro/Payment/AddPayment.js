import React, { useState, useEffect, useRef } from 'react'
import Swal from 'sweetalert2'
import { useLocation, useNavigate } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form';
import Header from '../../layout/Header';
import Slidebar from '../../layout/Slidebar';
import Footer from '../../layout/Footer';
import { Language, TOAST_ERROR, TOAST_SUCCESS, allowLettersAndSpaces } from '../../config/common';
import { addCategory, categoryDetails, categoryDetials, editCategory, updateCategoryQuestion } from '../../utils/api.services';
import SubNavbar from '../../layout/SubNavbar';
import categoryImage from '../../assets/Images/Group 48096953.png'
import { uploadImageOnAWS } from '../../utils/aws.service';
import { AwsFolder, Codes } from '../../config/constant';
import { SketchPicker } from 'react-color';
import { selectOption, textInputValidation, textValidation } from '../../config/commonFunction';
import { InputTypesEnum } from '../../config/commonVariable';
import { useDispatch } from 'react-redux';
import { setLoader } from '../../Store/slices/MasterSlice';
import { LazyLoadImage } from "react-lazy-load-image-component";
import CountryMobileNumber from '../../pages/CommonPages/CountryMobileNumber';

export default function AddCustomer() {
    const navigation = useNavigate();
    const dispatch = useDispatch();

    const location = useLocation();
    const [shoWcategoryImage, setShowCategoryImage] = useState(null);

    var categoryData = location?.state;
    const {
        register,
        handleSubmit,
        setValue,
        clearErrors,
        reset,
        watch,
        control,
        formState: { errors },
    } = useForm();


    useEffect(() => {
        if (categoryData) {
            categoryDetails({ category_id: categoryData?._id }).then((response) => {
                if (response?.code === Codes.SUCCESS) {
                    setShowCategoryImage(response?.data?.category_image)
                    reset({
                        category_en: response.data.name_en,
                        category_ar: response.data.name_ar
                    })
                    setValue("category_image", response.data.image);
                }
            }).catch(error => {
            });
        }
    }, [categoryData]);

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

            let image = data?.category_image;
            if (image instanceof Blob) image = await uploadImageOnAWS(image, AwsFolder?.CATEGORY_IMAGE);

            let request = {
                name_en: data.category_en,
                name_ar: data.category_ar,
                image: image
            }

            if (categoryData) {
                request.request_type = 'edit';
                request.category_id = categoryData._id;
            } else {
                request.request_type = 'add';
            }

            addCategory(request).then((response) => {
                if (response?.code === Codes.SUCCESS) {
                    TOAST_SUCCESS(response?.message)
                    navigation('/astrologer_list')
                } else {
                    TOAST_ERROR(response.message)
                }
            })
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

    return (
        <>
            {/* <Slidebar />
            <div className="body-wrapper">
                <Header /> */}
            <div className="container-fluid mw-100">

                <SubNavbar title={'Add Astrologer'} header={'Astrologer List'} subHeaderOnlyView={'Add Astrologer'} />

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
                                                            {...register(InputTypesEnum.NAME, textInputValidation(InputTypesEnum.NAME, Language('Please Enter Name')))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[InputTypesEnum.NAME]?.message}
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
                                                            // onKeyPress={allowLettersAndSpaces}
                                                            autoComplete='nope'
                                                            // {...register('category_en', { required: "Enter category" })}
                                                            {...register(InputTypesEnum.EMAIL, textInputValidation(InputTypesEnum.EMAIL, Language('Please Enter Email')))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[InputTypesEnum.EMAIL]?.message}
                                                    </label>
                                                </div>
                                                 <div className="mb-4">
                                                <label htmlFor="exampleInputPassword1" className="form-label fw-semibold">Phone no<spna className="text-danger"> *</spna></label>
                                                <CountryMobileNumber onChangeMobileNumber={onChangeMobileNumber} onChangeCountryCode={onChangeCountryCode} setDefaultData={''} imageIcon={true} />
                                                <input type='hidden' {...register(InputTypesEnum?.MOBILE, { required: "Please Enter Phone number" })} />
                                                <input type='hidden' {...register(InputTypesEnum?.COUNTRYCODE)} />
                                                <label className="errorc ps-1 pt-1" >{errors.mobile_number?.message}</label>
                                            </div>

                                                <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        Gender <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <select
                                                            className="form-control ps-2"
                                                            autoComplete="nope"
                                                            {...register(InputTypesEnum.GENDER, {
                                                                required: "Please Enter Gender", 
                                                            })}
                                                        >
                                                            <option value="">Select Gender</option>
                                                            <option value="male">Male</option>
                                                            <option value="female">Female</option>
                                                            <option value="other">Other</option>
                                                        </select>
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[InputTypesEnum.GENDER]?.message}
                                                    </label>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibol  d">
                                                        Experiance <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter Experiance"
                                                            // onKeyPress={allowLettersAndSpaces}
                                                            autoComplete='nope'
                                                            // {...register('category_en', { required: "Enter category" })}
                                                            {...register(InputTypesEnum.EXPERIANCE, textInputValidation(InputTypesEnum.EXPERIANCE, Language('Please Enter Experiance')))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[InputTypesEnum.EXPERIANCE]?.message}
                                                    </label>
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibol  d">
                                                        Price Per Minutes <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter Price Per Minutes"
                                                            // onKeyPress={allowLettersAndSpaces}
                                                            autoComplete='nope'
                                                            // {...register('category_en', { required: "Enter category" })}
                                                            {...register(InputTypesEnum.PRICEMIN, textInputValidation(InputTypesEnum.PRICEMIN, Language('Please Enter Price Per Minutes')))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[InputTypesEnum.PRICEMIN]?.message}
                                                    </label>
                                                </div>

                                            </div>

                                            <div className='col-md-6'>

                                                <div className="mb-4">
                                                    <label htmlFor="product_name" className="form-label fw-semibold">
                                                        Address <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter Address"
                                                            autoComplete='nope'
                                                            // {...register('category_ara', { required: "Enter category arabic" })}
                                                            {...register(InputTypesEnum.ADDRESS, textInputValidation(InputTypesEnum.ADDRESS, Language('Please Enter Address')))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[InputTypesEnum.ADDRESS]?.message}
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
                                                            placeholder="Enter City"
                                                            autoComplete='nope'
                                                            // {...register('category_ara', { required: "Enter category arabic" })}
                                                            {...register(InputTypesEnum.CITY, textInputValidation(InputTypesEnum.CITY, Language('Please Enter city')))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[InputTypesEnum.CITY]?.message}
                                                    </label>
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="product_name" className="form-label fw-semibold">
                                                        Pincode <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter Pincode"
                                                            autoComplete='nope'
                                                            // {...register('category_ara', { required: "Enter category arabic" })}
                                                            {...register(InputTypesEnum.PINCODE, textInputValidation(InputTypesEnum.PINCODE, Language('Plase Enter Pincode')))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[InputTypesEnum.PINCODE]?.message}
                                                    </label>
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="product_name" className="form-label fw-semibold">
                                                        Category <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter category"
                                                            autoComplete='nope'
                                                            // {...register('category_ara', { required: "Enter category arabic" })}
                                                            {...register(InputTypesEnum.CATEGORY, textInputValidation(InputTypesEnum.CATEGORY, Language('Please Enter category')))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[InputTypesEnum.CATEGORY]?.message}
                                                    </label>
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="product_name" className="form-label fw-semibold">
                                                        Language <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter Language"
                                                            autoComplete='nope'
                                                            // {...register('category_ara', { required: "Enter category arabic" })}
                                                            {...register(InputTypesEnum.LANGUAGE, textInputValidation(InputTypesEnum.LANGUAGE, Language('Please Enter language')))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[InputTypesEnum.LANGUAGE]?.message}
                                                    </label>
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="product_name" className="form-label fw-semibold">
                                                        Profile Photo <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="file"
                                                            className="form-control ps-2"
                                                            placeholder="Enter Profile Photo"
                                                            autoComplete='nope'
                                                            // {...register('category_ara', { required: "Enter category arabic" })}
                                                            {...register(InputTypesEnum.PROFILE, textInputValidation(InputTypesEnum.PROFILE, Language('Please Enter Profile Photo')))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[InputTypesEnum.PROFILE]?.message}
                                                    </label>
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
