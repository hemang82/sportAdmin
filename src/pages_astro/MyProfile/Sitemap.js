import React, { useEffect, useState } from 'react'
import Header from '../../layout/Header'
import Slidebar from '../../layout/Slidebar'
import { Language, PASSWORD_VALIDATION, SWIT_DELETE, SWIT_DELETE_SUCCESS, TOAST_ERROR, TOAST_SUCCESS, allowLettersAndSpaces } from '../../config/common'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import SubNavbar from '../../layout/SubNavbar'
import profile_image from '../../assets/Images/default.jpg'
import Footer from '../../layout/Footer'
import * as API from '../../utils/api.services'
import { handelInputText, textInputValidation, textValidation } from '../../config/commonFunction'
import { AstroInputTypesEnum, InputTypesEnum } from '../../config/commonVariable'
import { Codes } from '../../config/constant'
import { useDispatch } from 'react-redux'
import { setLoader } from '../../Store/slices/MasterSlice'
import axios from 'axios'


const Sitemap = () => {

    let navigation = useNavigate()
    const dispatch = useDispatch()
    const { register, handleSubmit, reset, formState, formState: { errors }, watch, setValue } = useForm();
    const [oldPassVisible, setOldPassVisible] = useState(false);
    const [newPassVisible, setNewPassVisible] = useState(false);
    const [confPassVisible, setConfPassVisible] = useState(false);

    const genrateSitemap = async (request) => {
        const response = await axios.get(`https://sitemap.chatmyastrologer.com/api/generate-sitemap`, request, {
            // headers: {
            //     'api-key': Constatnt.API_KEY,
            //     'Content-Type': 'multipart/form-data',
            // },
            // timeout: 10000,
        });
        return response.data; // 👈 Direct return of response.data
    };

    const onSubmitData = async (data) => {
        // SWIT_DELETE(`You won't be able to update!`, `Yes, update it!`).then(async (result) => {
        //     if (result.isConfirmed) {
        dispatch(setLoader(true))
        let request = {
            newKey: data[AstroInputTypesEnum?.VALUE],
        }
        const response = await genrateSitemap(request)
        TOAST_SUCCESS(response?.message)
        dispatch(setLoader(false))
        // .then((response) => {
        //     if (response?.code == Codes.SUCCESS) {
        //         TOAST_SUCCESS(response?.message);
        //         // navigation('/')
        //         localStorage.setItem('VEDIC_API_KEY', data[AstroInputTypesEnum?.VALUE])
        //         setValue(AstroInputTypesEnum?.VALUE, data[AstroInputTypesEnum?.VALUE]);
        //     } else {
        //         TOAST_ERROR(response?.message)
        //     }
        // });
        // http://sitemap.chatmyastrologer.com/api/generate-sitemap
    };

    const VEDIC_API = localStorage.getItem('VEDIC_API_KEY')
    useEffect(() => {
        setValue(AstroInputTypesEnum?.VALUE, VEDIC_API);
    }, [VEDIC_API]);


    return (
        <div className="card overflow-hidden chat-application">
            {/* <div className="d-flex align-items-center justify-content-between gap-3 m-3 d-lg-none">
                <button className="btn btn-primary d-flex" type="button" data-bs-toggle="offcanvas" data-bs-target="#chat-sidebar" aria-controls="chat-sidebar">
                    <i className="ti ti-menu-2 fs-5" />
                </button>
                <form className="position-relative w-100">
                    <input type="text" className="form-control search-chat py-2 ps-5" id="text-srh" placeholder="Search Contact" />
                    <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark me-3" />
                </form>
            </div> */}

            <div className="row m-2">
                <div className="col-12 justify-content-center">
                    <div className='row justify-content-center '>
                        <form onSubmit={handleSubmit(onSubmitData)}>
                            <div className="" >
                                <div className="card-body">
                                    <div className='row g-3'>
                                        <div className='col-md-6'>
                                            {/* <div className="mb-4">
                                                <label htmlFor="lastname" className="form-label fw-semibold">
                                                    Type <span className="text-danger ms-1"></span>
                                                </label>
                                                <div className="input-group border rounded-1">
                                                    <input
                                                        type="text"
                                                        className="form-control ps-2"
                                                        placeholder="Enter type"
                                                        // onKeyPress={allowLettersAndSpaces}
                                                        autoComplete='nope'
                                                        // {...register('category_en', { required: "Enter category" })}
                                                        {...register(AstroInputTypesEnum.TYPE, textInputValidation(AstroInputTypesEnum.TYPE, Language('Enter type')))}
                                                    />
                                                </div>
                                                <label className="errorc ps-1 pt-1">
                                                    {errors[AstroInputTypesEnum?.TYPE]?.message}
                                                </label>
                                            </div> */}
                                        </div>

                                        <div>
                                            <label htmlFor="lastname" className="form-label fw-semibol d">
                                                Sitemap Chat My Astrologer Link: <span className="text-danger ms-1"></span>
                                            </label>
                                            <label className="ps-1 pt-1">
                                                <a
                                                    href="https://sitemap.chatmyastrologer.com/sitemap.xml"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    https://sitemap.chatmyastrologer.com/sitemap.xml
                                                </a>
                                            </label>
                                        </div><br></br>

                                        <div className="modal-footer justify-content-center mb-3">

                                            {/* <button type='button' className="btn btn-danger m-2">Cancel</button> */}
                                            <button type='submit' className="btn btn-primary" >Genrate Sitemap</button>
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sitemap
