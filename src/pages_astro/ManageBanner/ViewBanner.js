import React, { useState, useEffect, useRef } from 'react'
import Swal from 'sweetalert2'
import { useLocation, useNavigate } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form';
import Header from '../../layout/Header';
import Slidebar from '../../layout/Slidebar';
import Footer from '../../layout/Footer';
import { Language, TOAST_ERROR, TOAST_SUCCESS, allowLettersAndSpaces } from '../../config/common';
import { addBanner, AddBanner, addCategory, categoryDetails, categoryDetials, editBanner, EditBanner, editCategory, updateCategoryQuestion } from '../../utils/api.services';
import SubNavbar from '../../layout/SubNavbar';
import categoryImage from '../../assets/Images/Group 48096953.png'
import { uploadImageOnAWS } from '../../utils/aws.service';
// import { AwsFolder, Codes } from '../../config/constant';
import { SketchPicker } from 'react-color';
import { getFileNameFromUrl, selectOption, textInputValidation, textValidation } from '../../config/commonFunction';
import { AstroInputTypesEnum, AwsFolder } from '../../config/commonVariable';
import { useDispatch, useSelector } from 'react-redux';
import { setLoader } from '../../Store/slices/MasterSlice';
import { LazyLoadImage } from "react-lazy-load-image-component";
import Spinner from '../../component/Spinner';
import { DatePicker, TimePicker } from 'antd';
import dayjs from 'dayjs';
import { Codes } from '../../config/constant';
import { PATHS } from '../../Router/Paths';

export default function AddCategory() {
    const navigation = useNavigate();
    const dispatch = useDispatch();

    const location = useLocation();

    const [shoWbannerImage, setShowBannerImage] = useState(null);
    const { isLoading } = useSelector((state) => state.masterslice);


    var BannerData = location?.state;

    const { register, handleSubmit, setValue, clearErrors, reset, watch, control, formState: { errors }, } = useForm();

    useEffect(() => {
        if (BannerData) {
            setShowBannerImage(BannerData?.image);
            setValue("name", BannerData?.name || "");
            setValue("start_date", BannerData?.start_date ? dayjs(BannerData.start_date) : null);
            setValue("end_date", BannerData?.end_date ? dayjs(BannerData.end_date) : null);
            setValue("start_time", BannerData?.start_time ? dayjs(BannerData.start_time, "HH:mm") : null);
            setValue("end_time", BannerData?.end_time ? dayjs(BannerData.end_time, "HH:mm") : null);
            setValue("image", getFileNameFromUrl(BannerData?.image)); // If image name is stored
        }
    }, [BannerData, setValue]);

    const onSubmitData = async (data) => {
        try {
            dispatch(setLoader(true))

            let image = data[AstroInputTypesEnum.BANNER_IMAGE];
            if (image instanceof Blob) image = await uploadImageOnAWS(image, AwsFolder?.BANNER_IMAGE);

            let request = {
                name: data.name,
                image: image,
                start_date: data?.start_date ? dayjs(data.start_date).format("YYYY-MM-DD") : null,
                end_date: data?.end_date ? dayjs(data.end_date).format("YYYY-MM-DD") : null,
                start_time: data?.start_time ? dayjs(data.start_time).format("HH:mm") : null,
                end_time: data?.end_time ? dayjs(data.end_time).format("HH:mm") : null,
            };

            console.log('data request', request);
            if (BannerData) {
                request.banner_id = BannerData.id;
                editBanner(request).then((response) => {
                    if (response?.code === Codes.SUCCESS) {
                        TOAST_SUCCESS(response?.message)
                        navigation(PATHS.BANNER_LIST)
                    } else {
                        TOAST_ERROR(response.message)
                    }
                })
            } else {
                addBanner(request).then((response) => {
                    if (response?.code === Codes.SUCCESS) {
                        TOAST_SUCCESS(response?.message)
                        navigation(PATHS.BANNER_LIST)
                    } else {
                        TOAST_ERROR(response.message)
                    }
                })
            }
            dispatch(setLoader(false))
        } catch (error) {
            console.log('errorerror', error);
            TOAST_ERROR('Somthing went wrong')
        }
    }

    const handleImageChange = async (e) => {
        const image = e.target.files[0]
        setValue("banner_image", image);
        clearErrors("category_image");
        setShowBannerImage(URL.createObjectURL(image))
    }

    return (
        <>
            {/* <Slidebar /> <div className="body-wrapper"> <Header /> */}

            <div className="container-fluid mw-100">

                <SubNavbar title={BannerData ? 'Banner Details' : 'Add Banner'} header={'Banner List'} subHeaderOnlyView={BannerData ? 'Banner Details' : 'Add Banner'} />

                {isLoading && <Spinner message="" isActive={isLoading} />}

                <div className="row m-2">
                    <div className="col-12 justify-content-center">
                        <div className='row justify-content-center '>
                            <form onSubmit={handleSubmit(onSubmitData)}>
                                <div className="card" >
                                    <div className="card-body">
                                        {/* <div className="px-4 py-3 border-bottom mb-3">
                                            <h5 className="card-title fw-semibold mb-0">
                                                Product Details
                                            </h5>
                                        </div> */}

                                        <div className="row justify-content-center">
                                            <div className="col-auto">
                                                <div className="card shadow-sm custom-card">
                                                    <div className="card-body text-center" >

                                                        <div className="dropzone cursor_pointer custom_dropzone" >
                                                            <label htmlFor={AstroInputTypesEnum.BANNER_IMAGE} className='cursor_pointer'>
                                                                <Controller name={AstroInputTypesEnum.BANNER_IMAGE}
                                                                    control={control} defaultValue={null}
                                                                    rules={{ required: 'Select banner image' }}
                                                                    render={({ field }) => (<>
                                                                        <input type="file" name='banner_image' disabled className="custom-file-input form-control" id={AstroInputTypesEnum.BANNER_IMAGE} accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />

                                                                    </>
                                                                    )} />
                                                                <input
                                                                    className="form-control d-none"
                                                                    type="file"
                                                                    id="formFileMultiple"
                                                                    multiple
                                                                    onChange={handleImageChange}
                                                                />
                                                                {
                                                                    shoWbannerImage ? (
                                                                        <LazyLoadImage src={shoWbannerImage}
                                                                            style={{ height: '150px', width: '300px', objectFit: 'contain' }}
                                                                            alt="Image Alt"
                                                                        />
                                                                    ) : (
                                                                        <div className="fallback text-center" style={{ height: '150px', width: '300px', objectFit: 'contain', alignItems: 'center', justifyContent: 'center' }}>
                                                                            <label htmlFor="formFileMultiple" className="dz-button centered-dropzone">
                                                                                Select files here to upload
                                                                            </label>
                                                                        </div>
                                                                    )
                                                                }
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <label className="errorc ps-1 pt-1">
                                                    {errors[AstroInputTypesEnum.BANNER_IMAGE]?.message}
                                                </label>
                                            </div>
                                            {/* <p className='text-danger pt-1'> <span>{errors[AstroInputTypesEnum.BANNER_IMAGE] && errors[AstroInputTypesEnum.BANNER_IMAGE].message}</span></p> */}
                                        </div>

                                        <div className='row g-3'>
                                            <div className='col-md-6'>
                                                <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        Name<span className="text-danger ms-1"></span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder={'Enter name'}
                                                            autoComplete='nope'
                                                            disabled
                                                            {...register(AstroInputTypesEnum.NAME, textInputValidation(AstroInputTypesEnum.NAME, Language('Enter name')))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.NAME]?.message}
                                                    </label>
                                                </div>
                                                <div className="mb-4">
                                                    <label className="form-label fw-semibold">Start Date <span className="text-danger">*</span></label>
                                                    <Controller
                                                        control={control}
                                                        name="start_date"
                                                        rules={{ required: "Select start date" }}
                                                        render={({ field }) => (
                                                            <DatePicker
                                                                {...field}
                                                                className="form-control custom-datepicker w-100"
                                                                format="YYYY-MM-DD"
                                                                allowClear={false}
                                                                picker="date"
                                                                disabled
                                                            />
                                                        )}
                                                    />
                                                    <label className="errorc">
                                                        {errors?.start_date?.message}
                                                    </label>
                                                </div>

                                                <div className="mb-4">
                                                    <label className="form-label fw-semibold">End Date <span className="text-danger">*</span></label>
                                                    <Controller
                                                        control={control}
                                                        name="end_date"
                                                        rules={{ required: "Select end date" }}
                                                        render={({ field }) => (
                                                            <DatePicker
                                                                {...field}
                                                                className="form-control custom-datepicker w-100"
                                                                format="YYYY-MM-DD"
                                                                allowClear={false}
                                                                picker="date"
                                                                disabled
                                                            />
                                                        )}
                                                    />
                                                    <label className="errorc">
                                                        {errors?.end_date?.message}
                                                    </label>
                                                </div>
                                            </div>

                                            <div className='col-md-6'>
                                                <div className="mb-4">
                                                    <label className="form-label fw-semibold">
                                                        Start Time <span className="text-danger">*</span>
                                                    </label>
                                                    <Controller
                                                        control={control}
                                                        name="start_time"
                                                        rules={{ required: "Select start time" }}
                                                        render={({ field }) => (
                                                            <TimePicker
                                                                {...field}
                                                                className="form-control w-100"
                                                                format="HH:mm"
                                                                allowClear={false}
                                                                disabled
                                                                onChange={(time) => field.onChange(time)}
                                                                value={field.value ? dayjs(field.value, "HH:mm") : null}
                                                            />
                                                        )}
                                                    />
                                                    <label className="errorc">{errors?.start_time?.message}</label>
                                                </div>
                                                <div className="mb-4">
                                                    <label className="form-label fw-semibold">
                                                        End Time <span className="text-danger">*</span>
                                                    </label>
                                                    <Controller
                                                        control={control}
                                                        name="end_time"
                                                        disabled
                                                        rules={{
                                                            required: "Select end time",
                                                            validate: (value) =>
                                                                !value || !watch("start_time") || dayjs(value, "HH:mm").isAfter(dayjs(watch("start_time"), "HH:mm"))
                                                                    ? true
                                                                    : "End time must be after start time",
                                                        }}
                                                        render={({ field }) => (
                                                            <TimePicker
                                                                {...field}
                                                                className="form-control w-100"
                                                                format="HH:mm"
                                                                allowClear={false}
                                                                onChange={(time) => field.onChange(time)}
                                                                value={field.value ? dayjs(field.value, "HH:mm") : null}
                                                            />
                                                        )}
                                                    />
                                                    <label className="errorc">{errors?.end_time?.message}</label>
                                                </div>
                                            </div>

                                            {/* <div className="modal-footer justify-content-center mb-3">
                                                <button type='button' className="btn btn-danger m-2" onClick={() => { reset(); setShowBannerImage("") }}>Cancel</button>
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
