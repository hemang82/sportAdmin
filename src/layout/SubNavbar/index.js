import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { PUBLIC_URL } from '../../config/constant';
import { PATHS } from '../../Router/Paths';

export default function SubNavbar({ title, header, subHeader, subHeaderOnlyView }) {
    const location = useLocation();
    const path = location?.pathname
    let splitPath = path?.split('/')

    return (
        <>

            {/* <div className="row">
                <div className="col-12">
                    <div className="page-title-box">
                        <div className="page-title-right">
                            <ol className="breadcrumb m-0">
                                <li className='linkdata'><i className="bi bi-house-door"></i>&nbsp;</li>
                                <li className="breadcrumb-item"><Link to="/" className='linkdata'>Dashboard</Link></li>
                                <li className="breadcrumb-item"><Link to={'/' + splitPath?.[1]}>{header}</Link></li>
                                {subHeader ?
                                    <li className="breadcrumb-item"><Link to={path}>{subHeader}</Link></li> : <></>
                                }
                                {subHeaderOnlyView ?
                                    <li className="breadcrumb-item active"><a>{subHeaderOnlyView}</a></li> : <></>
                                }
                            </ol>
                        </div>
                        <h4 className="page-title">{title}</h4>
                    </div>
            </div>
            </div> */}

            <div className="card bg-light-info shadow-none position-relative overflow-hidden">
                <div className="card-body px-4 py-3">
                    <div className="row align-items-center">
                        <div className="col-9">
                            <h4 className="fw-semibold mb-8">{title}</h4>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><Link className="" to={PATHS?.DASHBOARD}>Dashboard</Link></li>
                                    <li className="breadcrumb-item" aria-current="page">
                                        <Link to={`/${splitPath?.[1]}`} className="text-decoration-none">
                                            {header}
                                        </Link>
                                    </li>
                                    {subHeader ? <li className="breadcrumb-item"><Link to={path} >{subHeader}</Link></li> : <></>
                                    }
                                    {subHeaderOnlyView ?
                                        <li className="breadcrumb-item active"><a>{subHeaderOnlyView}</a></li> : <></>
                                    }
                                </ol>
                            </nav>
                        </div>
                        <div className="col-3">
                            <div className="text-center mb-n5">
                                {/* <img src={PUBLIC_URL + "/dist/images/breadcrumb/ChatBc.png"} alt className="img-fluid mb-n4" /> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
