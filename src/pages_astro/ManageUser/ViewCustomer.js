import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { Language, TOAST_ERROR, TOAST_SUCCESS, formatDate } from '../../config/common';
import { EditCustomer } from '../../utils/api.services';
import SubNavbar from '../../layout/SubNavbar';
import { Codes } from '../../config/constant';
import { textInputValidation, } from '../../config/commonFunction';
import { AstroInputTypesEnum, DateFormat, } from '../../config/commonVariable';
import { useDispatch } from 'react-redux';
import { setLoader } from '../../Store/slices/MasterSlice';

export default function DetailsCustomer() {
    const navigation = useNavigate();
    const dispatch = useDispatch();

    const location = useLocation();
    const [shoWcategoryImage, setShowCategoryImage] = useState(null);

    var userDetails = location?.state;
    const { register, handleSubmit, setValue, clearErrors, reset, watch, control, formState: { errors } } = useForm();

    useEffect(() => {

        if (userDetails) {
            dispatch(setLoader(true))
            // CustomerDetails({ customer_id: customerData?._id }).then((response) => {
            //     if (response?.code === Codes.SUCCESS) {
            // let location = location;
            setValue(AstroInputTypesEnum?.NAME, userDetails?.name || ' - ');
            setValue(AstroInputTypesEnum?.EMAIL, userDetails?.email || ' - ');
            setValue(AstroInputTypesEnum?.MOBILE, userDetails?.country_code + ' ' + userDetails?.mobile_number || ' - ');
            setValue(AstroInputTypesEnum?.STATE, userDetails?.state || ' - ');
            setValue(AstroInputTypesEnum?.PASSWORD, userDetails?.password || ' - ');
            setValue(AstroInputTypesEnum?.CREATE_USER, formatDate(userDetails?.created_at, DateFormat?.DATE_TIME_MONTH_WISE_FORMAT) || ' - ');
            setValue(AstroInputTypesEnum?.CITY, userDetails?.city || ' - ');

            // setValue(AstroInputTypesEnum?.PINCODE, customerData?.pincode || ' - ');
            if (userDetails?.gender) {
                setValue(AstroInputTypesEnum.GENDER, '');
            }
            // }
            // }).catch(error => {
            // });
            dispatch(setLoader(false))
        }
    }, [userDetails]);

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

            if (userDetails) {
                request.customer_id = userDetails._id;
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

    return (
        <>
            {/* <Slidebar />
            <div className="body-wrapper">
                <Header /> */}
            <div className="container-fluid mw-100">
                <SubNavbar title={userDetails ? 'User Details' : 'Add User'} header={'User List'} subHeaderOnlyView={userDetails ? 'User Details' : 'Add User'} />
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
                                                        Name <span className="text-danger ms-1"></span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter Name"
                                                            // onKeyPress={allowLettersAndSpaces}
                                                            autoComplete='nope'
                                                            disabled
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
                                                        Mobile Number <span className="text-danger ms-1"></span>
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
                                                    <CountryMobileNumber onChangeMobileNumber={onChangeMobileNumber} onChangeCountryCode={onChangeCountryCode} disabled={true} setDefaultData={customerData} imageIcon={false} />
                                                    <input type='hidden' {...register(AstroInputTypesEnum?.MOBILE, { required: "Please Enter Phone number" })} />
                                                    <input type='hidden' {...register(AstroInputTypesEnum?.COUNTRYCODE)} />
                                                    <label className="errorc ps-1 pt-1" >{errors.mobile_number?.message}</label> */}
                                                </div>

                                                {/* <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        Gender <span className="text-danger ms-1">*</span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <select
                                                            className="form-control ps-2"
                                                            autoComplete="nope"
                                                            disabled
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
                                                </div> */}

                                                <div className="mb-4">
                                                    <label htmlFor="product_name" className="form-label fw-semibold">
                                                        City <span className="text-danger ms-1"></span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter city"
                                                            autoComplete='nope'
                                                            disabled
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
                                                        Create User <span className="text-danger ms-1"></span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="-"
                                                            autoComplete='nope'
                                                            disabled
                                                            // {...register('category_ara', { required: "Enter category arabic" })}
                                                            {...register(AstroInputTypesEnum.CREATE_USER, textInputValidation(AstroInputTypesEnum.CREATE_USER, Language('-')))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.CREATE_USER]?.message}
                                                    </label>
                                                </div>
                                            </div>

                                            <div className='col-md-6'>

                                                <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        Email <span className="text-danger ms-1"></span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter Email"
                                                            autoComplete='nope'
                                                            disabled
                                                            {...register(AstroInputTypesEnum.EMAIL, textInputValidation(AstroInputTypesEnum.EMAIL, Language('Please Enter Email')))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.EMAIL]?.message}
                                                    </label>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="product_name" className="form-label fw-semibold">
                                                        Password<span className="text-danger ms-1"></span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter place of birth"
                                                            disabled
                                                            // {...register('category_ara', { required: "Enter category arabic" })}
                                                            {...register(AstroInputTypesEnum.PASSWORD, textInputValidation(AstroInputTypesEnum.PASSWORD, Language('Enter place of birth')))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.PASSWORD]?.message}
                                                    </label>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="product_name" className="form-label fw-semibold">
                                                        State <span className="text-danger ms-1"></span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter state"
                                                            autoComplete='nope'
                                                            disabled
                                                            // {...register('category_ara', { required: "Enter category arabic" })}
                                                            {...register(AstroInputTypesEnum.STATE, textInputValidation(AstroInputTypesEnum.STATE, Language('Enter state')))}
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
                                                            disabled
                                                            // {...register('category_ara', { required: "Enter category arabic" })}
                                                            {...register(AstroInputTypesEnum.PINCODE, textInputValidation(AstroInputTypesEnum.PINCODE, Language('Enter pincode')))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.PINCODE]?.message}
                                                    </label> */}
                                                </div>



                                            </div>

                                            {/* <div className="modal-footer justify-content-center mb-3">
                                                <button type='button' className="btn btn-danger m-2">Cancel</button>
                                                <button type='submit' className="btn btn-primary" >Submit</button>
                                            </div> */}
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
