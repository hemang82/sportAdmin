import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import SubNavbar from '../../layout/SubNavbar';
import { EditCustomer, customerList, delateVenue } from '../../utils/api.services';
import { ExportToCSV, ExportToExcel, ExportToPdf, TOAST_ERROR, TOAST_SUCCESS } from '../../config/common';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { getUserListThunk, getVenueListListThunk, setLoader, updateCustomerList, updateVenueList } from '../../Store/slices/MasterSlice';
import Constatnt, { Codes, ModelName, SEARCH_DELAY } from '../../config/constant';
import useDebounce from '../hooks/useDebounce';
import { closeModel, formatDate, openModel, truncateWords } from '../../config/commonFunction';
import Model from '../../component/Model';
import { DeleteComponent } from '../CommonPages/CommonComponent';
import Pagination from '../../component/Pagination';
import { DateFormat } from '../../config/commonVariable';
import { PATHS } from '../../Router/Paths';
import { CiSearch } from "react-icons/ci";
import { FiEye } from "react-icons/fi";
import { TbEdit } from "react-icons/tb";
import { AiOutlineDelete } from "react-icons/ai";

export default function ManageCoustomer() {

    let navigat = useNavigate();
    const dispatch = useDispatch();
    const [perPage, setPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [is_load, setis_load] = useState(false);
    const { venueList: { data: venueList } } = useSelector((state) => state.masterslice);
    const { customModel } = useSelector((state) => state.masterslice);
    const [selectedUser, setSelectedUser] = useState()
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const debounce = useDebounce(globalFilterValue, SEARCH_DELAY);
    const [filters, setFilters] = useState({ global: { value: '' } });

    useEffect(() => {
        // if (!hasInitialLoaded.current) {
        //     hasInitialLoaded.current = true;
        //     return; // Skip first effect run
        // }
        const fetchData = async () => {
            // dispatch(setLoader(true));
            const request = {
                per_page: perPage,
                page: page,
                search: globalFilterValue,
            };
            try {
                await dispatch(getVenueListListThunk(request));
            } finally {
                // dispatch(setLoader(false));
            }
        };

        fetchData();
    }, [is_load, debounce, page])

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
                venue_id: selectedUser?.id,
            }
            delateVenue(submitData).then((response) => {
                if (response.code === Codes?.SUCCESS) {
                    const updatedList = venueList?.result?.filter((item) => item.id !== selectedUser?.id);
                    dispatch(updateVenueList({
                        ...venueList,
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



    return (
        <>
            <div className="container-fluid mw-100">
                <SubNavbar title={"Venue List"} header={'Venue List'} />
                <div className="widget-content searchable-container list">
                    <div className="card card-body">
                        <div className="row">
                            <div className="col-md-4 col-xl-3">
                                <div className="position-relative">
                                    <input type="text" className="form-control product-search ps-5" id="input-search" placeholder="Search Venue Name ..."
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

                                <Link to={PATHS?.VENUE_ADD} id="btn-add-contact" className="btn btn-info d-flex align-items-center" style={{ height: '40px' }}>
                                    <i className="ti ti-category me-1 fs-6" />Add Venue
                                </Link>

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
                                value={venueList?.result}
                                rows={8}
                                // rowsPerPageOptions={[5, 10, 20]}
                                currentPageReportTemplate='Showing {first} to {last} of {totalRecords} entries'
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                loading={loading}
                                emptyMessage={<span style={{ textAlign: 'center', display: 'block' }}>No Venue found.</span>}
                            >
                                <Column
                                    field="id"
                                    header="Id"
                                    style={{ minWidth: '4rem' }}
                                    body={(rowData, options) => options.rowIndex + 1}
                                    sortable
                                    showFilterMenu={true}
                                />
                                {/* 
                                <Column field="image" header="Profile Image" style={{ minWidth: '8rem', whiteSpace: 'nowrap' }} body={(rowData) => (
                                    <img src={rowData?.image} className='ms-3 rounded-circle  ' alt="Profile" style={{ alignSelf: 'center', height: '40px', width: '40px' }} />
                                )} /> */}

                                <Column field="name" sortable header="Name" style={{ minWidth: '10rem', whiteSpace: 'nowrap', textTransform: 'capitalize' }} body={(rowData) => (
                                    <span>{truncateWords(rowData.name) || '-'}</span>
                                )} />

                                <Column field="city_name" sortable header="City Name" style={{ minWidth: '12rem' }} body={(rowData) => (
                                    <span>{truncateWords(rowData.city_name) || '-'}</span>
                                )} />

                                <Column field="venue_size" sortable header="Venue Size" style={{ minWidth: '12rem' }} body={(rowData) => (
                                    <span>{rowData.venue_size || '-'}</span>
                                )} />

                                <Column field="venue_price" sortable header="Venue Price" style={{ minWidth: '12rem' }} body={(rowData) => (
                                    <span>{rowData.venue_price || '-'}</span>
                                )} />

                                <Column field="created_at" sortable header="Created_at" style={{ minWidth: '12rem' }} body={(rowData) => (
                                    <span>{formatDate(rowData.created_at, DateFormat?.DATE_YEAR_WISE_DASH_TIME_FORMAT) || '-'} </span>
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
                                        <a className="text-info edit cursor_pointer cursor_pointer me-2" onClick={() => navigat(PATHS?.VENUE_EDIT, { state: rowData })} >
                                            <TbEdit style={{ fontSize: '1.2rem' }} />
                                        </a>
                                        <Link to={PATHS?.VENUE_DETAILS} state={rowData} className="text-info edit cursor_pointer">
                                            <FiEye style={{ fontSize: '1.2rem' }} />
                                        </Link>
                                        <a className="text-danger delete ms-2 cursor_pointer" onClick={() => { openModel(dispatch, ModelName.DELETE_MODEL); setSelectedUser(rowData); }} >
                                            <AiOutlineDelete className="fs-5" />
                                        </a>
                                    </div>
                                )} />
                            </DataTable>

                            <div className=''>
                                <Pagination per_page={venueList?.perPage} pageCount={venueList?.page_count} onPageChange={onPageChange} page={venueList?.currentPage} />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
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


