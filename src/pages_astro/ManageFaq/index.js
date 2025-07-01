import React, { useEffect, useState } from 'react'
import Header from '../../layout/Header'
import { Link, useNavigate } from 'react-router-dom';
import Slidebar from '../../layout/Slidebar';
import { useDispatch, useSelector } from 'react-redux';
import { Codes, ModelName, PER_PAGE_DATA, PUBLIC_URL, SEARCH_DELAY } from '../../config/constant';
import useDebounce from '../hooks/useDebounce';
import { ExportToCSV, ExportToExcel, ExportToPdf, Language, SWIT_DELETE, SWIT_DELETE_SUCCESS, TOAST_ERROR, TOAST_SUCCESS } from '../../config/common';
import Pagination from '../../component/Pagination';
import { setLoader } from '../../Store/slices/MasterSlice';
import * as API from '../../utils/api.services';
import SubNavbar from '../../layout/SubNavbar';
import { useForm } from 'react-hook-form';
import Model from '../../component/Model';
import { closeModel, openModel } from '../../config/commonFunction';
import { DeleteComponent } from '../CommonPages/CommonComponent';
import { AiOutlineDelete } from 'react-icons/ai';
import { TbEdit } from 'react-icons/tb';

const ManageFaq = () => {

    let navigate = useNavigate();
    let dispatch = useDispatch();

    const { register, handleSubmit, setValue, clearErrors, reset, watch, control, formState: { errors } } = useForm();

    const { customModel } = useSelector((state) => state.masterslice);

    const [page, setPage] = useState(1);
    const [faqList, setFaqList] = useState([]);
    const [is_load, setis_load] = useState(false);
    const [faqModel, setFaqModel] = useState(null);
    const [selectedUser, setSelectedUser] = useState()
    const [faqStatus, setFaqStatus] = useState('home_screen');

    const [is_Edit, setIs_Edit] = useState(false)
    const [editData, setEditData] = useState(null)

    useEffect(() => {
        // const handleContactUsListAPI = () => {
        dispatch(setLoader(true));
        API.FAQList({ type: faqStatus }).then((response) => {
            if (response?.code === Codes.SUCCESS) {
                setFaqList(response.data)
            } else {
                setFaqList([])
            }
        })
        dispatch(setLoader(false));
        // };
    }, [faqModel, is_load, faqStatus])

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleStatusManage = async (data, newStatus) => {
        // dispatch(setLoader(true));
        // setis_flag(true)
        // let submitData = {
        //     faq_id: data?.id,
        //     is_active: newStatus,
        // }
        // API.editFaqs(submitData).then((response) => {
        //     if (response?.code === '1') {
        //         dispatch(setLoader(false));
        //         setis_flag(false)

        //     }
        // })
        // await dispatch(editContactUsDataApiCall(submitData));
        // await handleContactUsListAPI();
    }

    const handleDeleteManage = async (data) => {
        // SWIT_DELETE(`You won't be able to delete this!`).then(async result => {
        //     if (result?.isConfirmed) {
        //         dispatch(setLoader(true));
        //         setis_flag(true)

        //         let submitData = {
        //             faq_id: data?.id,
        //             is_delete: '1',
        //         }
        //         API.editFaqs(submitData).then((response) => {
        //             if (response?.code === '1') {
        //                 dispatch(setLoader(false));
        //                 setis_flag(false)
        //                 SWIT_DELETE_SUCCESS(`Contact deletion successful`);
        //             }
        //         })
        // await handleContactUsListAPI();

        // }
        // });
    }
    // console.log('faqList', faqList);

    const onSubmitData = (data) => {

        const sendRequest = {
            answer: data?.answer,
            question: data.question,
            is_active: 1,
            is_delete: ""
        }

        if (is_Edit) {
            sendRequest.faqs_id = editData?.id
            API.EditFAQ(sendRequest).then((response) => {
                if (response?.code === Codes.SUCCESS) {
                    TOAST_SUCCESS(response?.message);
                    setFaqModel(false)
                    reset()
                    closeModel(dispatch)
                } else {
                    TOAST_ERROR(response?.message)
                }
            })
        } else {
            API.AddFAQ(sendRequest).then((response) => {
                if (response?.code === Codes.SUCCESS) {
                    TOAST_SUCCESS(response?.message);
                    setFaqModel(false)
                    reset()
                    closeModel(dispatch)
                } else {
                    TOAST_ERROR(response?.message)
                }
            })
        }
    }

    const handleDelete = (is_true) => {
        if (is_true) {
            setis_load(true)
            dispatch(setLoader(true));
            let submitData = {
                faqs_id: selectedUser?.id,
                is_delete: '1',
            }
            API.EditFAQ(submitData).then((response) => {
                if (response.code === Codes?.SUCCESS) {
                    setis_load(false)
                    closeModel(dispatch)
                    TOAST_SUCCESS(response?.message);
                }
            });
            dispatch(setLoader(false))
        }
    };

    const formatLabel = (text) => {
        return text
            .replace(/_/g, ' ') // Replace _ with space
            .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
    };

    const faqEditfun = (data) => {
        setIs_Edit(true)
        setEditData(data)
        setValue('answer', data?.answer);
        setValue('question', data?.question);
        setFaqModel(true)
    }

    return (
        <>
            {/* <Slidebar />
            <div className="body-wrapper">
                <Header /> */}
            <div className="container-fluid mw-100">

                <SubNavbar title={"FAQ"} header={'FAQ'} />
                <div className="card card-body mb-4">
                    <div className="row">
                        <div className='col-md-4 col-xl-3'>

                        </div>
                        <div className="col-md-8 col-xl-9 text-end d-flex justify-content-md-end justify-content-center mt-3 mt-md-0">
                            <div className="col-12 col-md-6 col-lg-2">
                                <label className="d-block mb-1 fw-semibold mt-2 mt-md-4 w-md-auto "></label>
                                <div
                                    // to="/loan_list/add_loan"
                                    id="btn-add-contact"
                                    className="btn btn-info d-flex align-items-center justify-content-center"
                                    style={{ height: '40px' }}
                                    onClick={() => { setFaqModel(true) }}
                                >
                                    <span className="me-1">
                                        {/* <IoAddCircleOutline style={{ fontSize: '1.2rem' }} /> */}
                                    </span>
                                    <span className="fw-semibold"> Add FAQ</span>
                                </div>
                            </div>
                            {/* <div className="action-btn show-btn" style={{ display: 'none' }}>
                                        <a href="javascript:void(0)" className="delete-multiple btn-light-danger btn me-2 text-danger d-flex align-items-center font-medium">
                                            <i className="ti ti-trash text-danger me-1 fs-5" /> Delete All Row
                                        </a>
                                    </div> */}
                            {/* <a id="btn-add-contact" className="btn btn-info d-flex align-items-center" onClick={() => { setFaqModel(true) }}>
                                Add FAQ
                            </a> */}
                        </div>
                    </div>
                </div>

                <div className="row justify-content-center mt-5">
                    <div className="col-lg-8">
                        <div className="accordion accordion-flush mb-5 card position-relative overflow-hidden" id="accordionFlushExample">
                            {faqList?.result?.map((faq, index) => (
                                <div className="accordion-item" key={faq._id}>
                                    <h2 className="accordion-header d-flex" id={`flush-heading${index}`}>
                                        <button
                                            className="accordion-button collapsed fs-5 fw-semibold d-flex justify-content-between align-items-center"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#flush-collapse${index}`}
                                            aria-expanded="false"
                                            aria-controls={`flush-collapse${index}`}
                                        >
                                            <span>{faq.question}</span>
                                        </button>
                                        <div className="action-btn me-4 mt-2 d-flex align-items-center">
                                            <a className="text-info edit cursor_pointer cursor_pointer" onClick={() => faqEditfun(faq)}  >
                                                <TbEdit className="fs-5" />
                                            </a>
                                            <a className="text-dark delete ms-2 cursor_pointer cursor_pointer" onClick={() => { openModel(dispatch, ModelName.DELETE_MODEL); setSelectedUser(faq) }}>
                                                <AiOutlineDelete className="fs-5" />
                                            </a>
                                        </div>
                                    </h2>
                                    <div id={`flush-collapse${index}`} className="accordion-collapse collapse" aria-labelledby={`flush-heading${index}`} data-bs-parent="#accordionFlushExample">
                                        <div className="accordion-body fw-normal">
                                            {faq.answer}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className={`modal custom-modal  ${faqModel ? "fade show d-block " : "d-none"}`} id="addnotesmodal" tabIndex={-1} role="dialog" aria-labelledby="addnotesmodalTitle" aria-hidden="true">
                <div className="modal-dialog modal-md modal-dialog-centered" role="document" >
                    <div className="modal-content border-0">
                        <div className="modal-header bg-primary " style={{ borderRadius: '10px 10px 0px 0px' }}>
                            <h6 className="modal-title text-white"> {is_Edit ? 'Edit' : 'Add'} Faq</h6>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={() => { setFaqModel(false); setIs_Edit(false); setEditData(null); reset() }} />
                        </div>

                        <div className="modal-body">

                            <form onSubmit={handleSubmit(onSubmitData)}>
                                <div className="col-lg-12">
                                    <div className="card-body p-4">
                                        <div className='row d-flex gap-3'>
                                            <div className='col'>
                                                <div className="mb-4">
                                                    <label htmlFor="question" className="form-label fw-semibold">Question<span className="text-danger ms-1"> *</span></label>
                                                    <input type="text" className="form-control ps-2" placeholder="Enter question" {...register('question', { required: "Enter question" })} />
                                                    <label className="errorc ps-1 pt-1">{errors.question?.message}</label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='row d-flex gap-3'>
                                            <div className='col'>
                                                <div className="mb-4">
                                                    <label htmlFor="answer" className="form-label fw-semibold">Answer<span className="text-danger ms-1"> *</span></label>
                                                    <div className="input-group border rounded-1">
                                                        <textarea
                                                            className="form-control p-7 ps-2"
                                                            placeholder="Enter answer"
                                                            {...register('answer', { required: "Enter answer" })}
                                                        ></textarea>
                                                    </div>
                                                    <label className="errorc ps-1 pt-1">{errors.answer?.message}</label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="modal-footer justify-content-center">
                                            <button type="button" className="btn btn-danger" onClick={() => { closeModel(dispatch); reset(); }}>Cancel</button>
                                            <button type="submit" className="btn btn-primary">Submit</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div >
            {
                faqModel && (
                    <div className="modal-backdrop fade show"></div>
                )
            }

            {
                customModel.isOpen && customModel?.modalType === ModelName.DELETE_MODEL && (
                    <Model>
                        <DeleteComponent onConfirm={handleDelete} />
                    </Model >
                )
            }
        </>
    )
}

export default ManageFaq
