import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Language, TOAST_ERROR, TOAST_SUCCESS, allowLettersAndSpaces } from '../../config/common';
import SubNavbar from '../../layout/SubNavbar';
import { getFileNameFromUrl, selectOption, textInputValidation, textValidation } from '../../config/commonFunction';
import { AstroInputTypesEnum, AwsFolder, InputTypesEnum } from '../../config/commonVariable';
import { useDispatch, useSelector } from 'react-redux';
import { getCityListThunk, getGameListListThunk, setLoader } from '../../Store/slices/MasterSlice';
import { AiOutlineClose } from 'react-icons/ai';
import dayjs from 'dayjs';
import { DatePicker, ConfigProvider, TimePicker } from 'antd';
import { uploadImageOnAWS } from '../../utils/aws.service';
import { addVenue, detailsVenue, editVenue } from '../../utils/api.services';
import { PATHS } from '../../Router/Paths';
import { Codes } from '../../config/constant';

export default function ViewVenue() {
    const navigation = useNavigate();
    const dispatch = useDispatch();

    const location = useLocation();
    const { cityList: { data: cityList } } = useSelector((state) => state.masterslice);
    const { gameList: { data: gameList } } = useSelector((state) => state.masterslice);

    var venueData = location?.state;
    const dateFormat = 'YYYY-MM-DD';

    const { register, handleSubmit, setValue, clearErrors, unregister, reset, watch, control, formState: { errors }, getValues } = useForm({
        defaultValues: {
            games: [{ game: '', price: '', weekend_price: '', sloat_date: null, start_time: '', end_time: '', duration: '' }],
            images: [{ file: null }],
            prohibitions: [{ value: '' }],
            facilities: [{ value: "" }],
        }
    });

    const { fields, append, remove } = useFieldArray({ control, name: "games" });
    const { fields: imageFields, append: appendImage, remove: removeImage, } = useFieldArray({ control, name: "images" });
    const { fields: prohibitionsFields, append: appendProhibition, remove: removeProhibition } = useFieldArray({ control, name: "prohibitions" });
    const { fields: facilitiesFields, append: appendFacility, remove: removeFacility } = useFieldArray({ control, name: "facilities", });

    useEffect(() => {
        dispatch(getCityListThunk());
        dispatch(getGameListListThunk());
        if (venueData) {
            dispatch(setLoader(true))
            detailsVenue({ venue_id: venueData?.id })?.then((response) => {
                if (response?.code === Codes.SUCCESS) {
                    let responseDetails = response?.data;
                    setValue(AstroInputTypesEnum?.NAME, responseDetails?.name);
                    setValue(AstroInputTypesEnum?.CITY, responseDetails?.city_id);
                    setValue(AstroInputTypesEnum?.DESCRIPTION, responseDetails?.description);
                    setValue(AstroInputTypesEnum?.LOCATION, responseDetails?.location);
                    setValue(AstroInputTypesEnum?.VENUE_PRICE, responseDetails?.venue_price);
                    setValue(AstroInputTypesEnum?.VENUE_SIZE, responseDetails?.venue_size);
                    setValue('facilities', (responseDetails?.facilities || []).map((val) => ({ value: val.name })));
                    setValue('prohibitions', (responseDetails?.prohibitions || []).map((val) => ({ value: val.name })));
                    setValue('images', (responseDetails?.venue_images || []).map((img) => ({ file: img.image })));

                    const mergedGames = (responseDetails?.games || []).map((game) => {
                        const slot = (responseDetails?.slots || []).find(s => s.game_id == game.id);
                        return {
                            game: game.id,
                            price: game.price,
                            weekend_price: game.weekend_price,
                            sloat_date: slot ? dayjs(slot.slot_date) : null,         // convert to dayjs if needed
                            start_time: slot?.start_time || '',
                            end_time: slot?.end_time || '',
                            duration: slot?.duration || ''
                        };
                    });
                    setValue('games', mergedGames);
                    dispatch(setLoader(false))
                }
            }).catch(error => {
                dispatch(setLoader(false))
            });
        }
    }, [venueData]);

    const onSubmitData = async (data) => {
        try {

            dispatch(setLoader(true))

            const uploadedImages = await Promise.all(
                (data?.images || []).map(async (img) => {
                    if (img?.file instanceof Blob) {
                        const s3Url = await uploadImageOnAWS(img.file, AwsFolder?.VENUE_IMAGE);
                        return getFileNameFromUrl(s3Url); // extract "image.jpg"
                    } else if (img?.file) {
                        return getFileNameFromUrl(img.file); // already uploaded image
                    }
                    return null;
                })
            );

            let request = {
                name: data[AstroInputTypesEnum.NAME],
                city_id: data[AstroInputTypesEnum.CITY],
                description: data[AstroInputTypesEnum.DESCRIPTION],
                location: data[AstroInputTypesEnum.LOCATION],
                venue_price: data[AstroInputTypesEnum.VENUE_PRICE],
                venue_size: data[AstroInputTypesEnum.VENUE_SIZE],
                game_ids: data?.games.map(({ game, price, weekend_price }) => ({ game_id: game, price, weekend_price })),
                venue_images: uploadedImages,
                venue_facilities: data?.facilities.map(item => item.value),
                venue_prohibitions: data?.prohibitions.map(item => item.value),
                slots: data?.games.map(({ game, start_time, end_time, sloat_date, duration }) => ({
                    game_id: game,
                    start_time: dayjs(start_time, 'HH:mm').format('HH:mm:ss'), // Ensures HH:mm:ss
                    end_time: dayjs(end_time, 'HH:mm').format('HH:mm:ss'),
                    slot_date: dayjs(sloat_date).format("YYYY-MM-DD"),
                    duration
                }))
            }
            if (venueData) {
                request.venue_id = venueData.id;
                editVenue(request).then((response) => {
                    if (response?.code === Codes.SUCCESS) {
                        TOAST_SUCCESS(response?.message)
                        navigation(PATHS?.VENUE_LIST)
                    } else {
                        TOAST_ERROR(response.message)
                    }
                })
            } else {
                addVenue(request).then((response) => {
                    if (response?.code === Codes.SUCCESS) {
                        navigation(PATHS?.VENUE_LIST)
                        TOAST_SUCCESS(response?.message)
                    } else {
                        TOAST_ERROR(response.message)
                    }
                })
                TOAST_ERROR('Somthing went wrong')
            }
            dispatch(setLoader(false))
        } catch (error) {
            console.log('error', error);
        }
    }

    return (
        <>
            <div className="container-fluid mw-100">

                <SubNavbar title={venueData ? 'Details Venue' : 'Add Venue'} header={'Venue List'} subHeaderOnlyView={venueData ? 'Details Venue' : 'Add Venue'} />

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
                                                            disabled
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
                                                        Venue Size <span className="text-danger ms-1"></span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            disabled
                                                            className="form-control ps-2"
                                                            placeholder="Enter venue size"
                                                            autoComplete='nope'
                                                            {...register(AstroInputTypesEnum.VENUE_SIZE, textInputValidation(AstroInputTypesEnum.VENUE_SIZE, Language('Enter venue size')))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.VENUE_SIZE]?.message}
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
                                                    <label htmlFor="product_name" className="form-label fw-semibold">
                                                        Description<span className="text-danger ms-1"></span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <textarea
                                                            className="form-control ps-2"
                                                            placeholder="Enter description"
                                                            autoComplete="off"
                                                            disabled
                                                            rows={2} // Adjust number of lines as needed
                                                            {...register(
                                                                AstroInputTypesEnum.DESCREPTION,
                                                                textInputValidation(
                                                                    AstroInputTypesEnum.DESCREPTION,
                                                                    Language('Enter description')
                                                                )
                                                            )}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.DESCREPTION]?.message}
                                                    </label>
                                                </div>

                                                {/* <div className="d-flex justify-content-start mb-4">
                                                    <button
                                                        id="btn-add-contact"
                                                        type="button"
                                                        className="btn btn-sm btn-info d-flex align-items-center"
                                                        style={{ height: '32px' }}
                                                        onClick={addFacility}
                                                    >
                                                        <i className="ti ti-circle-plus fs-6"></i>
                                                        <span className="ms-2">Add Venue Facilities</span>
                                                    </button>
                                                </div> */}
                                                {/* {
                                                    venueFacility?.map((attribute, index) => (<>
                                                        <div className='row g-2 align-items-end' >
                                                            <div className='d-flex justify-content-between gap-2 flex-wrap'>
                                                                <div className="col-md-9">
                                                                    <div className="input-group border rounded-1">
                                                                        <input
                                                                            type="text"
                                                                            className="form-control ps-2"
                                                                            placeholder="Enter venue facilities"
                                                                            // onKeyPress={allowLettersAndSpaces}
                                                                            autoComplete='nope'
                                                                            // {...register('category_en', { required: "Enter category" })}
                                                                            {...register(`facility_${index}`, {
                                                                                required: `Enter venue facilities`,
                                                                            })}
                                                                        />
                                                                    </div>
                                                                    <label className="errorc ps-1 pt-1 pb-1">
                                                                        {errors[`facility_${index}`]?.message}
                                                                    </label>
                                                                </div>
                                                                {
                                                                    index != 0 ?
                                                                        < div className="col-md-2">
                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-sm btn-outline-danger"
                                                                                onClick={() => removeFacility(attribute.id, index)}
                                                                            >
                                                                                <AiOutlineClose />
                                                                            </button>
                                                                        </div>
                                                                        :
                                                                        < div className="col-md-2">
                                                                        </div>
                                                                }
                                                            </div>
                                                        </div >
                                                    </>))
                                                } */}

                                                {/* <div className="d-flex justify-content-start mb-4"> */}
                                                <label htmlFor="product_name" className="form-label fw-semibold">
                                                    Venue Facilities <span className="text-danger ms-1"></span>
                                                </label>
                                                {/* </div> */}
                                                {facilitiesFields.map((item, index) => (
                                                    <div className="row g-2 align-items-end mb-2" key={item.id}>
                                                        <div className="d-flex justify-content-between gap-2 flex-wrap w-100">
                                                            <div className="col-md-9">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Enter facility"
                                                                    disabled
                                                                    {...register(`facilities.${index}.value`, {
                                                                        required: "Enter facility",
                                                                    })}
                                                                />
                                                                <label className="errorc ps-1 pt-1">
                                                                    {errors?.facilities?.[index]?.value?.message}
                                                                </label>
                                                            </div>
                                                            {/* <div className="col-md-2">
                                                                {index > 0 && (
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-sm btn-outline-danger"
                                                                        onClick={() => removeFacility(index)}
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                )}
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className='col-md-6'>

                                                <div className="mb-4">
                                                    <label htmlFor="lastname" className="form-label fw-semibold">
                                                        City <span className="text-danger ms-1"></span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <select
                                                            className="form-control ps-2"
                                                            autoComplete="nope"
                                                            disabled
                                                            {...register(AstroInputTypesEnum.CITY, { required: "Please Enter City" })}
                                                        >
                                                            <option value="">Select City</option>
                                                            {selectOption(cityList?.result)}
                                                        </select>
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.CITY]?.message}
                                                    </label>
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="product_name" className="form-label fw-semibold">
                                                        Venue Price<span className="text-danger ms-1"></span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter venue price"
                                                            disabled
                                                            // {...register('category_ara', { required: "Enter category arabic" })}
                                                            {...register(AstroInputTypesEnum.VENUE_PRICE, textInputValidation(AstroInputTypesEnum.VENUE_PRICE, Language('Enter venue price')))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.VENUE_PRICE]?.message}
                                                    </label>
                                                </div>

                                                <div className="mb-5">
                                                    <label htmlFor="product_name" className="form-label fw-semibold">
                                                        Location <span className="text-danger ms-1"></span>
                                                    </label>
                                                    <div className="input-group border rounded-1">
                                                        <input
                                                            type="text"
                                                            className="form-control ps-2"
                                                            placeholder="Enter location"
                                                            disabled
                                                            autoComplete='nope'
                                                            // {...register('category_ara', { required: "Enter category arabic" })}
                                                            {...register(AstroInputTypesEnum.LOCATION, textInputValidation(AstroInputTypesEnum.LOCATION, Language('Enter location')))}
                                                        />
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">
                                                        {errors[AstroInputTypesEnum.LOCATION]?.message}
                                                    </label>
                                                </div>

                                                {/* <div className="d-flex justify-content-start mb-4">
                                                    <button
                                                        id="btn-add-contact"
                                                        type="button"
                                                        className="btn btn-sm btn-info d-flex align-items-center"
                                                        style={{ height: '32px' }}
                                                        onClick={() => { appendProhibition({ value: "" }) }}
                                                    // onClick={appendProhibition({ value: "" })}
                                                    >
                                                        <i className="ti ti-circle-plus fs-6"></i>
                                                        <span className="ms-2">Add Venue Prohibitions</span>
                                                    </button>
                                                </div> */}
                                                {/* <div className="d-flex justify-content-start mb-4">
                                                    <button
                                                        id="btn-add-contact"
                                                        type="button"
                                                        className="btn btn-sm btn-info d-flex align-items-center"
                                                        style={{ height: '32px' }}
                                                        onClick={addProhibitions}
                                                    >
                                                        <i className="ti ti-circle-plus fs-6"></i>
                                                        <span className="ms-2">Add Venue Prohibitions</span>
                                                    </button>
                                                </div> */}
                                                {/* {
                                                    venueProhibitions?.map((attribute, index) => (<>
                                                        <div className='row g-2 align-items-end' >
                                                            <div className='d-flex justify-content-between gap-2 flex-wrap'>
                                                                <div className="col-md-9">
                                                                    <div className="input-group border rounded-1">
                                                                        <input
                                                                            type="text"
                                                                            className="form-control ps-2"
                                                                            placeholder="Enter venue Prohibitions"
                                                                            // onKeyPress={allowLettersAndSpaces}
                                                                            autoComplete='nope'
                                                                            // {...register('category_en', { required: "Enter category" })}
                                                                            {...register(`prohibitions_${index}`, {
                                                                                required: `Enter venue Prohibitions`,
                                                                            })}
                                                                        />
                                                                    </div>
                                                                    <label className="errorc ps-1 pt-1 pb-1">
                                                                        {errors[`prohibitions_${index}`]?.message}
                                                                    </label>
                                                                </div>
                                                                {
                                                                    index != 0 ?
                                                                        < div className="col-md-2">
                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-sm btn-outline-danger"
                                                                                onClick={() => removeProhibitions(attribute.id, index)}
                                                                            >
                                                                                <AiOutlineClose />
                                                                            </button>
                                                                        </div>
                                                                        :
                                                                        < div className="col-md-2">
                                                                        </div>
                                                                }
                                                            </div>
                                                        </div >
                                                    </>))
                                                } */}

                                                <label htmlFor="product_name" className="form-label fw-semibold">
                                                    Venue Prohibitions <span className="text-danger ms-1"></span>
                                                </label>
                                                {prohibitionsFields.map((item, index) => (
                                                    <div key={item.id} className="mb-3 row">
                                                        <div className="col-md-10">
                                                            <input
                                                                type="text"
                                                                placeholder="Enter prohibition"
                                                                className="form-control"
                                                                disabled
                                                                {...register(`prohibitions.${index}.value`, { required: "This field is required" })}
                                                            />
                                                            <small className="text-danger">
                                                                {errors?.prohibitions?.[index]?.value?.message}
                                                            </small>
                                                        </div>
                                                        {/* <div className="col-md-2">
                                                            {index > 0 && (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    onClick={() => removeProhibition(index)}
                                                                >
                                                                    Remove
                                                                </button>
                                                            )}
                                                        </div> */}
                                                    </div>
                                                ))}
                                            </div>

                                            <hr></hr>

                                            <div className="row">

                                                {/* <div className="col-12 mb-3">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-info d-flex align-items-center"
                                                        onClick={() => append({ game: '', price: '', weekend_price: '', sloat_date: null, start_time: '', end_time: '', duration: '', })} >
                                                        <i className="ti ti-circle-plus fs-6"></i>
                                                        <span className="ms-2">Add Game</span>
                                                    </button>
                                                </div> */}

                                                {fields.map((item, index) => (
                                                    <div className="col-12 border rounded p-3 mb-4" key={item.id}>
                                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                                            <h6 className="mb-0">Game {index + 1}</h6>
                                                            {/* <button
                                                                type="button"
                                                                className="btn btn-sm btn-danger"
                                                                onClick={() => remove(index)}
                                                            >
                                                                <i className="ti ti-x"></i> Remove
                                                            </button> */}
                                                        </div>

                                                        <div className="row g-3">
                                                            {/* Game Dropdown */}
                                                            <div className="col-md-4">
                                                                <label className="form-label fw-semibold">Game <span className="text-danger"></span></label>
                                                                <select
                                                                    className="form-control ps-2"
                                                                    disabled
                                                                    {...register(`games.${index}.game`, { required: "Select game" })}
                                                                >
                                                                    <option value="">Select Game</option>
                                                                    {selectOption(gameList?.result)}
                                                                </select>
                                                                <label className="errorc ps-1 pt-1">{errors.games?.[index]?.game?.message}</label>
                                                            </div>

                                                            {/* Price */}
                                                            <div className="col-md-4">
                                                                <label className="form-label fw-semibold">Price <span className="text-danger"></span></label>
                                                                <input
                                                                    type="number"
                                                                    className="form-control ps-2"
                                                                    placeholder="Enter price"
                                                                    disabled
                                                                    {...register(`games.${index}.price`, textInputValidation(`games.${index}.price`, 'Enter price'))}
                                                                />
                                                                <label className="errorc ps-1 pt-1">{errors.games?.[index]?.price?.message}</label>
                                                            </div>

                                                            {/* Weekend Price */}
                                                            <div className="col-md-4">
                                                                <label className="form-label fw-semibold">Weekend Price <span className="text-danger"></span></label>
                                                                <input
                                                                    type="number"
                                                                    disabled
                                                                    className="form-control ps-2"
                                                                    placeholder="Enter weekend price"
                                                                    {...register(`games.${index}.weekend_price`, textInputValidation(`games.${index}.weekend_price`, 'Enter weekend price'))}
                                                                />
                                                                <label className="errorc ps-1 pt-1">{errors.games?.[index]?.weekend_price?.message}</label>
                                                            </div>

                                                            {/* Slot Date */}
                                                            <div className="col-md-3">
                                                                <label className="form-label fw-semibold">Slot Date <span className="text-danger"></span></label>
                                                                <Controller
                                                                    control={control}
                                                                    name={`games.${index}.sloat_date`}
                                                                    rules={{ required: "Select date" }}
                                                                    render={({ field }) => (
                                                                        <DatePicker
                                                                            {...field}
                                                                            className="form-control custom-datepicker w-100"
                                                                            format={dateFormat}
                                                                            allowClear={false}
                                                                            picker="date"
                                                                            disabled
                                                                        />
                                                                    )}
                                                                />
                                                                <label className="errorc ps-1 pt-1">{errors.games?.[index]?.sloat_date?.message}</label>
                                                            </div>

                                                            {/* Start Time */}
                                                            <div className="col-md-3">
                                                                <label className="form-label fw-semibold">Start Time <span className="text-danger"></span></label>
                                                                <Controller
                                                                    control={control}
                                                                    name={`games.${index}.start_time`}
                                                                    rules={{ required: 'Enter start time' }}
                                                                    render={({ field }) => (
                                                                        <TimePicker
                                                                            {...field}
                                                                            className="form-control ps-2"
                                                                            format="HH:mm"
                                                                            value={field.value ? dayjs(field.value, 'HH:mm') : null}
                                                                            onChange={(time) => field.onChange(time ? time.format('HH:mm') : '')}
                                                                            disabled
                                                                        />
                                                                    )}
                                                                />
                                                                <label className="errorc ps-1 pt-1">{errors.games?.[index]?.start_time?.message}</label>
                                                            </div>

                                                            {/* End Time */}
                                                            <div className="col-md-3">
                                                                <label className="form-label fw-semibold">End Time <span className="text-danger"></span></label>
                                                                <Controller
                                                                    control={control}
                                                                    name={`games.${index}.end_time`}
                                                                    rules={{ required: 'Enter end time' }}
                                                                    render={({ field }) => {
                                                                        const selectedStartTime = getValues(`games.${index}.start_time`);
                                                                        const start = selectedStartTime ? dayjs(selectedStartTime, 'HH:mm') : null;

                                                                        return (
                                                                            <TimePicker
                                                                                {...field}
                                                                                className="form-control ps-2"
                                                                                format="HH:mm"
                                                                                disabled
                                                                                value={field.value ? dayjs(field.value, 'HH:mm') : null}
                                                                                onChange={(time) => field.onChange(time ? time.format('HH:mm') : '')}
                                                                                disabledTime={() => {
                                                                                    if (!start) return {};
                                                                                    const disabledHours = () => {
                                                                                        const hours = [];
                                                                                        for (let i = 0; i < start.hour(); i++) {
                                                                                            hours.push(i);
                                                                                        }
                                                                                        return hours;
                                                                                    };
                                                                                    const disabledMinutes = (selectedHour) => {
                                                                                        const minutes = [];
                                                                                        if (selectedHour === start.hour()) {
                                                                                            for (let i = 0; i <= start.minute(); i++) {
                                                                                                minutes.push(i);
                                                                                            }
                                                                                        }
                                                                                        return minutes;
                                                                                    };
                                                                                    return { disabledHours, disabledMinutes };
                                                                                }}
                                                                            />
                                                                        );
                                                                    }}
                                                                />
                                                                <label className="errorc ps-1 pt-1">{errors.games?.[index]?.end_time?.message}</label>
                                                            </div>

                                                            {/* Duration */}
                                                            <div className="col-md-3">
                                                                <label className="form-label fw-semibold">Duration <span className="text-danger"></span></label>
                                                                <input
                                                                    type="number"
                                                                    className="form-control ps-2"
                                                                    disabled
                                                                    placeholder="Enter duration"
                                                                    {...register(`games.${index}.duration`, textInputValidation(`games.${index}.duration`, 'Enter duration'))}
                                                                />
                                                                <label className="errorc ps-1 pt-1">{errors.games?.[index]?.duration?.message}</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>


                                            <div className="row">
                                                {/* Add Image Button */}
                                                {/* <div className="mt-2 mb-4">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-info"
                                                        onClick={() => appendImage({ file: null })}
                                                    >
                                                        <i className="ti ti-circle-plus me-1"></i> Add Image
                                                    </button>
                                                </div> */}
                                                <label htmlFor="product_name" className="form-label fw-semibold">
                                                    Venue Images <span className="text-danger ms-1"></span>
                                                </label>
                                                {imageFields.map((item, index) => (
                                                    <div className="col-md-3 mb-4" key={item.id}>
                                                        <div className="border rounded p-2 position-relative h-100 shadow-sm">
                                                            {/* Image Preview or Placeholder */}
                                                            {watch(`images.${index}.file`) ? (
                                                                <img
                                                                    // src={URL.createObjectURL(watch(`images.${index}.file`))}
                                                                    src={
                                                                        watch(`images.${index}.file`) instanceof File
                                                                            ? URL.createObjectURL(watch(`images.${index}.file`))
                                                                            : watch(`images.${index}.file`)
                                                                    }
                                                                    alt={`Preview ${index + 1}`}
                                                                    className="img-fluid rounded mb-2"
                                                                    style={{ height: "130px", objectFit: "cover", width: "100%" }}
                                                                />
                                                            ) : (
                                                                <div
                                                                    className="d-flex justify-content-center align-items-center bg-light rounded mb-2"
                                                                    style={{ height: "130px", color: "#bbb", fontSize: "14px" }}
                                                                >
                                                                    No Image
                                                                </div>
                                                            )}

                                                            {/* File Input */}
                                                            {/* <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="form-control form-control-sm mb-2"
                                                                onChange={(e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (file) {
                                                                        setValue(`images.${index}.file`, file, { shouldValidate: true });
                                                                    }
                                                                }}
                                                            /> */}
                                                            {/* Remove Button */}
                                                            {/* <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-danger position-absolute"
                                                                style={{ top: "8px", right: "8px" }}
                                                                onClick={() => removeImage(index)}
                                                            >
                                                                <AiOutlineClose />
                                                            </button> */}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* <div className="d-flex justify-content-start ">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-info"
                                                    onClick={() => appendImage({ file: null })}
                                                >
                                                    + Add Image
                                                </button>
                                            </div> */}

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
                </div >
                {/* </div > */}
            </div >

        </>
    )
}
