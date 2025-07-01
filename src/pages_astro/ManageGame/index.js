import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import SubNavbar from '../../layout/SubNavbar';
import { EditCustomer, addCity, addGame, customerList, deleteCity, deleteGame, editCity, editGame } from '../../utils/api.services';
import { ExportToCSV, ExportToExcel, ExportToPdf, TOAST_ERROR, TOAST_SUCCESS } from '../../config/common';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { getCityListThunk, getGameListListThunk, getUserListThunk, setLoader, updateCityList, updateCustomerList, updateGameList } from '../../Store/slices/MasterSlice';
import Constatnt, { Codes, ModelName, SEARCH_DELAY } from '../../config/constant';
import useDebounce from '../hooks/useDebounce';
import { closeModel, formatDate, getCommaSeparatedNames, getFileNameFromUrl, openModel, truncateWords } from '../../config/commonFunction';
import Model from '../../component/Model';
import { DeleteComponent } from '../CommonPages/CommonComponent';
import Pagination from '../../component/Pagination';
import { AwsFolder, DateFormat } from '../../config/commonVariable';
import { PATHS } from '../../Router/Paths';
import { CiSearch } from "react-icons/ci";
import { FiEye } from "react-icons/fi";
import { TbEdit } from "react-icons/tb";
import { AiOutlineDelete } from "react-icons/ai";
import { Controller, useForm } from 'react-hook-form';
import { uploadImageOnAWS } from '../../utils/aws.service';

export default function ManageCity() {

    let navigat = useNavigate();
    const dispatch = useDispatch();
    const imageRef = useRef();

    const { register, handleSubmit, setValue, clearErrors, reset, watch, control, formState: { errors } } = useForm();

    const [perPage, setPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [is_load, setis_load] = useState(false);
    const { gameList: { data: gameList } } = useSelector((state) => state.masterslice);
    const { customModel } = useSelector((state) => state.masterslice);
    const [selectedUser, setSelectedUser] = useState()
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const debounce = useDebounce(globalFilterValue, SEARCH_DELAY);
    const [filters, setFilters] = useState({ global: { value: '' } });
    const [ShowGameImage, setShowGameImage] = useState(null);

    const [cityModel, setCityModel] = useState(null);
    const [is_Edit, setIs_Edit] = useState(false)
    const [editData, setEditData] = useState(null)

    const fetchData = async () => {
        const request = {
            per_page: perPage,
            page: page,
            search: globalFilterValue,
        };
        // try {
        await dispatch(getGameListListThunk(request));
        // } finally {
        setis_load(false); // ✅ Reset trigger
        // }
    };

    useEffect(() => {
        fetchData();
    }, [is_load, debounce, page, is_Edit]);

    const handleStatus = async (id, changeChecked) => {
        let submitData = {
            customer_id: id,
            is_active: changeChecked,
            role: 'user'
        }
        // EditCustomer(submitData).then((response) => {
        //     if (response.code === Codes.SUCCESS) {
        //         TOAST_SUCCESS(response?.message)
        //         let updatedList = userList?.customerList?.map((item) => {
        //             if (id == item._id) {
        //                 return {
        //                     ...item,
        //                     is_active: item?.is_active == '1' ? '0' : '1'
        //                 };
        //             }
        //             return item;
        //         });
        //         dispatch(updateCustomerList({
        //             ...userList,
        //             customerList: updatedList
        //         }))
        //     } else {
        //         TOAST_ERROR(response.message)
        //     }
        // })
        // updateCustomerList
    }

    const handleDelete = (is_true) => {
        if (is_true) {
            // dispatch(setLoader(true));
            let submitData = {
                game_id: selectedUser?.id,
            }
            deleteGame(submitData).then((response) => {
                if (response.code === Codes?.SUCCESS) {
                    const updatedList = gameList?.result?.filter((item) => item.id !== selectedUser?.id);
                    dispatch(updateGameList({
                        ...gameList,
                        result: updatedList
                    }))
                    closeModel(dispatch)
                    dispatch(setLoader(false))
                    TOAST_SUCCESS(response?.message);
                }
            });
        }
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        if (_filters['global']) { // Check if _filters['global'] is defined
            _filters['global'].value = value;
        }

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const onSubmitData = async (data) => {
        dispatch(setLoader(true))
        let image = data?.game_image;
        if (image instanceof Blob) image = await uploadImageOnAWS(image, AwsFolder?.GAME_IMAGE);
        const sendRequest = {
            name: data?.game_name,
            photo: getFileNameFromUrl(image)
        };

        if (is_Edit) {
            sendRequest.game_id = editData?.id;
            editGame(sendRequest).then((response) => {
                if (response?.code === Codes.SUCCESS) {
                    TOAST_SUCCESS(response?.message);
                    setCityModel(false);
                    reset();
                    setis_load(true); // ✅ Trigger fetch
                } else {
                    TOAST_ERROR(response?.message);
                }
            });
        } else {
            addGame(sendRequest).then((response) => {
                if (response?.code === Codes.SUCCESS) {
                    TOAST_SUCCESS(response?.message);
                    setCityModel(false);
                    reset();
                    setis_load(true); // ✅ Trigger fetch
                } else {
                    TOAST_ERROR(response?.message);
                }
            });
        }
        dispatch(setLoader(false))
    };

    // ---------------------------------- Export Data ----------------------------------

    const handleExportApiCall = async () => {
        dispatch(setLoader(true));
        let submitData = {
            search: globalFilterValue
        }
        const { code, data: { customerList } } = await customerList(submitData);
        const customerData = customerList?.map((customer, index) => ({
            id: index + 1,
            FullName: `${customer.name || '-'}`,
            Contact: customer?.country_code + ' ' + customer?.mobile_number || '-',
            Email: customer?.email || '-',
            Gender: customer?.gender || '-',
            Address: customer?.curr_address || '-',
            CreateUser: formatDate(customer?.created_at, DateFormat?.DATE_YEAR_WISE_DASH_TIME_FORMAT) || '-'
        }));

        return { code, data: customerData }
    };

    const handleExportToPdfManage = async () => {
        const { code, data } = await handleExportApiCall();
        if (code === Codes.SUCCESS) {
            ExportToPdf(data, 'Customer List', 'Customer List');
        }
        dispatch(setLoader(false));
    };

    const handleExportToCSVManage = async () => {
        const { code, data } = await handleExportApiCall();
        if (code === Codes.SUCCESS) {
            ExportToCSV(data, 'Customer List');
        }
        dispatch(setLoader(false));

    };

    const handleExportToExcelManage = async () => {
        const { code, data } = await handleExportApiCall();
        if (code === Codes.SUCCESS) {
            ExportToExcel(data, 'Customer List');
        }
        dispatch(setLoader(false));
    };

    const onPageChange = (Data) => {
        setPage(Data)
    }

    const handleImageChange = async (image) => {
        console.log('image data', image);
        setValue("game_image", image);
        clearErrors("game_image");
        setShowGameImage(URL.createObjectURL(image))
    }

    const editFunction = (rowData) => {
        console.log('rowData', rowData);

        setValue('game_name', rowData?.name); // ✅ Set actual name
        setValue('game_image_names', getCommaSeparatedNames(rowData?.photo)); // ✅ Set image names if needed

        setEditData(rowData);
        setCityModel(true);
        setShowGameImage(rowData?.photo); // ✅ For image preview
    };

    console.log('cityListcityList', gameList);

    return (
        <>
            <div className="container-fluid mw-100">
                <SubNavbar title={"Game List"} header={'Game List'} />
                <div className="widget-content searchable-container list">
                    <div className="card card-body">
                        <div className="row">
                            <div className="col-md-4 col-xl-3">
                                <div className="position-relative">
                                    <input type="text" className="form-control product-search ps-5" id="input-search" placeholder="Search Game ..."
                                        value={globalFilterValue}
                                        onChange={onGlobalFilterChange} />
                                    <div className="position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3 d-flex flex-column align-items-center">
                                        {/* <i className="ti ti-search" /> */}
                                        <CiSearch />
                                    </div>
                                    {/* <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y fs-6 text-dark ms-3" /> */}
                                </div>
                            </div>

                            {/* <div className="col-md-8 col-xl-9 text-end d-flex justify-content-md-end justify-content-center mt-3 mt-md-0">
                                <div className="action-btn show-btn" style={{ display: 'none' }}>
                                    {/* <a href="javascript:void(0)" className="delete-multiple btn-light-danger btn me-2 text-danger d-flex align-items-center font-medium">
                                        <i className="ti ti-trash text-danger me-1 fs-5" /> Delete All Row
                                    </a> 
                               
                                 <Link to={'/astrologer_list/add_astrologer'} id="btn-add-contact" className="btn btn-info d-flex align-items-center" style={{ height: '40px' }}>
                                                                   <i className="ti ti-category me-1 fs-6" />Add Astrologers
                                                               </Link>

                                <div className="btn-group mb-2">

                                    <button type="button" className="btn btn-info dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Export
                                    </button>
                                    <ul className="dropdown-menu animated flipInY">
                                        <li><a className="dropdown-item cursor_pointer text-black-50" onClick={handleExportToPdfManage}>PDF</a></li>
                                        <li><a className="dropdown-item cursor_pointer text-black-50" onClick={handleExportToCSVManage}>CSV</a></li>
                                        <li><a className="dropdown-item cursor_pointer text-black-50" onClick={handleExportToExcelManage}>Excel</a></li>
                                    </ul>
                                </div>
                                </div>
                            </div> */}

                            <div className="col-md-8 col-xl-9 text-end d-flex justify-content-md-end justify-content-center mt-3 mt-md-0">

                                <div id="btn-add-contact" className="btn btn-info d-flex align-items-center" style={{ height: '40px' }} onClick={() => { setCityModel(true) }}>
                                    <i className="ti ti-category me-1 fs-6" />Add Game
                                </div>

                                {/* <div className="btn-group mb-2 ms-2">
                                    <button type="button" className="btn btn-info dropdown-toggle " data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{ height: '40px' }}>
                                        Export
                                    </button>
                                    <ul className="dropdown-menu animated flipInY">
                                        <li><a className="dropdown-item cursor_pointer text-black-50" onClick={handleExportToExcelManage}>Excel</a></li>
                                        <li><a className="dropdown-item cursor_pointer text-black-50" onClick={handleExportToPdfManage}>PDF</a></li>
                                        <li><a className="dropdown-item cursor_pointer text-black-50" onClick={handleExportToCSVManage}>CSV</a></li>
                                    </ul>
                                </div> */}

                            </div>
                        </div>
                    </div>

                    {/* ---------------------
                      end Contact
                  ---------------- */}
                    {/* Modal */}
                    <div className="modal fade" id="addContactModal" tabIndex={-1} role="dialog" aria-labelledby="addContactModalTitle" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header d-flex align-items-center">
                                    <h5 className="modal-title">Contact</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                                </div>
                                <div className="modal-body">
                                    <div className="add-contact-box">
                                        <div className="add-contact-content">
                                            <form id="addContactModalTitle">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="mb-3 contact-name">
                                                            <input type="text" id="c-name" className="form-control" placeholder="Name" />
                                                            <span className="validation-text text-danger" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="mb-3 contact-email">
                                                            <input type="text" id="c-email" className="form-control" placeholder="Email" />
                                                            <span className="validation-text text-danger" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="mb-3 contact-occupation">
                                                            <input type="text" id="c-occupation" className="form-control" placeholder="Occupation" />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="mb-3 contact-phone">
                                                            <input type="text" id="c-phone" className="form-control" placeholder="Phone" />
                                                            <span className="validation-text text-danger" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="mb-3 contact-location">
                                                            <input type="text" id="c-location" className="form-control" placeholder="Location" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button id="btn-add" className="btn btn-success rounded-pill px-4">Add</button>
                                    <button id="btn-edit" className="btn btn-success rounded-pill px-4">Save</button>
                                    <button className="btn btn-danger rounded-pill px-4" data-bs-dismiss="modal"> Discard </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card card-body">
                        <div className="table-responsive">
                            <DataTable
                                value={gameList?.result}
                                // paginator
                                rows={8}
                                // rowsPerPageOptions={[5, 10, 20]}
                                currentPageReportTemplate='Showing {first} to {last} of {totalRecords} entries'
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                loading={loading}
                                emptyMessage={<span style={{ textAlign: 'center', display: 'block' }}>No Game found.</span>}
                            >
                                <Column
                                    field="id"
                                    header="Id"
                                    style={{ minWidth: '4rem' }}
                                    body={(rowData, options) => options.rowIndex + 1}
                                    sortable
                                    showFilterMenu={true}
                                />

                                <Column field="photo" header="Game Image" style={{ minWidth: '8rem', whiteSpace: 'nowrap' }} body={(rowData) => (
                                    <img src={rowData?.photo} className='ms-3 rounded-circle  ' alt="Profile" style={{ alignSelf: 'center', height: '40px', width: '40px' }} />
                                )} />

                                <Column field="name" sortable header="Game Name" style={{ minWidth: '10rem', whiteSpace: 'nowrap' }} body={(rowData) => (
                                    <span>{truncateWords(rowData.name) || '-'}</span>
                                )} />

                                <Column field="created_at" sortable header="Created at" style={{ minWidth: '12rem' }} body={(rowData) => (
                                    <span>{formatDate(rowData.created_at, DateFormat?.DATE_TIME_MONTH_WISE_FORMAT) || '-'} </span>
                                )} />

                                {/* <Column field="country" sortable header="Country" style={{ minWidth: '8rem', textTransform: 'capitalize' }} body={(rowData) => (
                                        <span>{rowData.country || '-'}</span>
                                    )} /> */}

                                {/* <Column field="status" data-pc-section="root" header="Status" style={{ minWidth: '6rem' }} body={(rowData) => (
                                    <>
                                        {rowData.is_active == 1 ? (
                                            <span className="p-tag p-component p-tag-success cursor_pointer badge bg-success p-1" data-pc-name="tag" data-pc-section="root" onClick={() => { handleStatus(rowData?._id, '0') }} >
                                                <span className="p-tag-value" data-pc-section="value">Active</span>
                                            </span>
                                        ) : (
                                            <span className="p-tag p-component p-tag-danger cursor_pointer badge bg-danger p-1" data-pc-name="tag" data-pc-section="root" onClick={() => { handleStatus(rowData?._id, '1') }}>
                                                <span className="p-tag-value" data-pc-section="value">Inactive</span>
                                            </span>
                                        )}
                                    </>
                                )} /> */}

                                <Column field="status" header="Action" style={{ minWidth: '10rem' }} body={(rowData) => (
                                    <div className="action-btn">
                                        <a className="text-info edit cursor_pointer cursor_pointer me-1" onClick={() => { setValue('game_name', rowData?.name); setIs_Edit(true); setEditData(rowData); setCityModel(true); setShowGameImage(rowData?.photo); setValue('game_image', rowData?.photo) }} >
                                            <TbEdit style={{ fontSize: '1.2rem' }} />
                                        </a>
                                        {/* <Link to={PATHS?.DETAILS_USER} state={rowData} className="text-info edit cursor_pointer">
                                            <FiEye style={{ fontSize: '1.2rem' }} />
                                        </Link> */}
                                        <a className="text-danger delete ms-1 cursor_pointer" onClick={() => { openModel(dispatch, ModelName.DELETE_MODEL); setSelectedUser(rowData); }} >
                                            <AiOutlineDelete className="fs-5" />
                                        </a>
                                    </div>
                                )} />
                            </DataTable>

                            <div className=''>
                                <Pagination per_page={gameList?.perPage} pageCount={gameList?.page_count} onPageChange={onPageChange} page={gameList?.currentPage} />
                            </div>

                        </div>
                    </div>
                </div>
            </div>


            <div className={`modal custom-modal  ${cityModel ? "fade show d-block " : "d-none"}`} id="addnotesmodal" tabIndex={-1} role="dialog" aria-labelledby="addnotesmodalTitle" aria-hidden="true">
                <div className="modal-dialog modal-md modal-dialog-centered" role="document" >
                    <div className="modal-content border-0">
                        <div className="modal-header bg-primary " style={{ borderRadius: '10px 10px 0px 0px' }}>
                            <h6 className="modal-title text-white"> {is_Edit ? 'Edit' : 'Add'} Game</h6>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onClick={() => { setCityModel(false); setIs_Edit(false); setEditData(null); reset(); setShowGameImage(null) }} />
                        </div>

                        <div className="modal-body">
                            <form onSubmit={handleSubmit(onSubmitData)}>
                                <div className="col-lg-12">
                                    <div className="card-body p-4">
                                        <div className='row d-flex gap-3'>
                                            <div className='col'>
                                                <label htmlFor="exampleInputPassword1" className="form-label fw-semibold">Game image<spna className="text-danger"> *</spna></label>
                                                <div className="d-flex justify-content-center">
                                                    {/* <div className="col-5"> */}
                                                    <div className="card  ">
                                                        <div className="card-body">
                                                            <div
                                                                className="dropzone p-3 border border-2 rounded text-center d-flex flex-column align-items-center justify-content-center cursor_pointer"
                                                                style={{ minHeight: '150px' }}
                                                                onClick={() => imageRef.current.click()}
                                                            >
                                                                {ShowGameImage ? (
                                                                    <div
                                                                        className="image-container"
                                                                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                                                                        <img
                                                                            src={ShowGameImage}
                                                                            alt="Selected"
                                                                            // style={{
                                                                            //     objectFit: 'contain',
                                                                            //     height: '100%',
                                                                            //     width: '100%',
                                                                            //     // borderRadius: '8px',
                                                                            //     // border: '1px solid #ddd',
                                                                            // }}
                                                                            style={{
                                                                                fontSize: '1.1rem',
                                                                                color: '#999',
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                justifyContent: 'center',
                                                                                height: '100px',
                                                                                width: '100%',
                                                                            }}
                                                                        />
                                                                    </div>
                                                                ) : (
                                                                    <div
                                                                        className="text-muted"
                                                                        style={{
                                                                            fontSize: '0.8rem',
                                                                            color: '#999',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            height: '100px',
                                                                            width: '100%',
                                                                        }}
                                                                    >
                                                                        Click to select image
                                                                    </div>
                                                                )}

                                                                <Controller
                                                                    name="game_image"
                                                                    control={control}
                                                                    defaultValue={null}
                                                                    rules={{ required: 'Image is required' }}
                                                                    render={({ field }) => (
                                                                        <input
                                                                            type="file"
                                                                            accept="image/*"
                                                                            ref={(e) => {
                                                                                imageRef.current = e;
                                                                                field.ref(e);
                                                                            }}
                                                                            onChange={(e) => {
                                                                                const file = e.target.files[0];
                                                                                handleImageChange(file);
                                                                                field.onChange(file);
                                                                            }}
                                                                            className="d-none"
                                                                        />
                                                                    )}
                                                                />


                                                            </div>
                                                            {errors?.game_image && (
                                                                <label className="errorc ps-1 pt-1">{errors.game_image.message}</label>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {/* </div> */}
                                                </div>

                                                <div className="mb-4">
                                                    <label htmlFor="question" className="form-label fw-semibold">Game Name<span className="text-danger ms-1"> *</span></label>
                                                    <input type="text" className="form-control ps-2" placeholder="Enter game name" {...register('game_name', { required: "Enter game name" })} />
                                                    <label className="errorc ps-1 pt-1">{errors.game_name?.message}</label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="modal-footer justify-content-center">
                                            <button type="button" className="btn btn-danger" onClick={() => { reset(); setShowGameImage(null) }}>Reset</button>
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
                customModel.isOpen && customModel?.modalType === ModelName.DELETE_MODEL && (
                    <Model>
                        <DeleteComponent onConfirm={handleDelete} />
                    </Model >
                )
            }
        </>
    )
}


