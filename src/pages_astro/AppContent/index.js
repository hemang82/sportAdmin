import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import SubNavbar from '../../layout/SubNavbar';
import { TOAST_SUCCESS } from '../../config/common';
import Header from '../../layout/Header';
import Slidebar from '../../layout/Slidebar';
import { Codes } from '../../config/constant';

export default function AppContent(props) {

    var navigation = useNavigate()
    const location = useLocation();
    const path = '/' + location?.pathname?.split('/')?.[1]

    const [aboutValue, setAbout] = useState('');
    const [policyValue, setPolicy] = useState('');
    const [conditionValue, setCondition] = useState('');

    const [aboutHi, setAboutHi] = useState('');
    const [aboutGu, setAboutGu] = useState('');

    const [policyHi, setPolicyHi] = useState('');
    const [policyGu, setPolicyGu] = useState('');

    const [conditionHi, setConditionHi] = useState('');
    const [conditionGu, setConditionGu] = useState('');



    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5] }, { 'font': [] }],
            [{ size: [] }],
            ["bold", "underline", "italic", "strike", "blockquote"],
            ["code-block", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }, { 'indent': '-1' }, { 'indent': '+1' }],
            // ['link', 'image', 'video'],
            ['clean']
        ]
    }

    // const success = async () => {
    //     if (path === '/about-us') {
    //         let { data, code, message } = await editAppContent({ "en_about_content": aboutValue, "hin_about_content": hin_aboutValue, "spa_about_content": spa_aboutValue, "fra_about_content": fra_aboutValue, "ita_about_content": ita_aboutValue });
    //         if (code === '1') {
    //             TOAST_SUCCESS('Your About Us has been saved');
    //             navigation('/')
    //         }
    //     } else if (path === '/privacy-policy') {
    //         let { data, code, message } = await editAppContent({ "en_policy_content": policyValue, "hin_policy_content": hin_policyValue, "spa_policy_content": spa_policyValue, "fra_policy_content": fra_policyValue, "ita_policy_content": ita_policyValue });
    //         if (code === '1') {
    //             TOAST_SUCCESS('Your Privacy policy has been saved');
    //             navigation('/')

    //         }
    //     } else {
    //         let { data, code, message } = await editAppContent({ "en_condition_content": conditionValue, "hin_condition_content": hinconditionValue, "spa_condition_content": spa_conditionValue, "fra_condition_content": fra_conditionValue, "ita_condition_content": ita_conditionValue });
    //         if (code === '1') {
    //             TOAST_SUCCESS('Your Terms & Condition has been saved');
    //             navigation('/')
    //         }
    //     }
    // }

    const success = async () => {
        // if (path === '/about-us') {

        //     let { data, code, message } = await editAppContent({ "page_name": "about_us", "content": aboutValue });
        //     let { data1, code1, message1 } = await editAppContent({ "page_name": "about_us_hi", "content": aboutHi });
        //     let { data2, code2, message2 } = await editAppContent({ "page_name": "about_us_gu", "content": aboutGu });


        //     if (code == Codes.SUCCESS) {
        //         // if (code1 == Codes.SUCCESS) {
        //         TOAST_SUCCESS('Your About Us has been saved');
        //         // }
        //     }

        // } else if (path === '/privacy-policy') {

        //     let { data, code, message } = await editAppContent({ "page_name": "privacy_policy", "content": policyValue });
        //     let { data1, code1, message1 } = await editAppContent({ "page_name": "privacy_policy_hi", "content": policyHi });
        //     let { data2, code2, message2 } = await editAppContent({ "page_name": "privacy_policy_gu", "content": policyGu });


        //     if (code == Codes.SUCCESS) {
        //         // if (code1 == Codes.SUCCESS) {
        //         TOAST_SUCCESS('Your Privacy policy has been saved');
        //         // }
        //     }

        // } else if (path === '/terms-condition') {

        //     let { data, code, message } = await editAppContent({ "page_name": "term_and_condition", "content": conditionValue });
        //     let { data1, code1, message1 } = await editAppContent({ "page_name": "terms_conditions_hi", "content": conditionHi });
        //     let { data2, code2, message2 } = await editAppContent({ "page_name": "terms_conditions_gu", "content": conditionGu });

        //     if (code == Codes.SUCCESS) {
        //         // if (code1 == Codes.SUCCESS) {
        //         TOAST_SUCCESS('Your Terms & Condition has been saved');
        //         // }
        //     }
        // }
    }

    // useEffect(() => {
    //     getAppContent().then((response) => {
    //         response?.data.forEach(item => {
    //             if (item.page_name === 'about_us') {
    //                 setAbout(item.content);
    //             } 
    //             else if (item.page_name === 'about_us_hi') {
    //                 setAboutHi(item.content);
    //             }
    //             else if (item.page_name === 'about_us_gu') {
    //                 setAboutGu(item.content);
    //             } 
    //             else if (item.page_name === 'terms_conditions_hi') {
    //                 setConditionHi(item.content);
    //             } 
    //             else if (item.page_name === 'term_and_condition_gu') {
    //                 setConditionGu(item.content);
    //             } 
    //             else if (item.page_name === 'term_and_condition') {
    //                 setCondition(item.content);
    //             } 
    //             else if (item.page_name === 'privacy_policy') {
    //                 setPolicy(item.content);
    //             }
    //              else if (item.page_name === 'privacy_policy_hi') {
    //                 setPolicyHi(item.content);
    //             }
    //             else if (item.page_name === 'privacy_policy_gu') {
    //                 setPolicyGu(item.content);
    //             }
    //         });
    //     }).catch(err => console.log("About-Us ma Error aayi--->>>  ", err));
    // }, [])

    return (
        <>
            {/* <Slidebar />
            <div className="body-wrapper">
                <Header /> */}
            <div className="container-fluid mw-100">
                <SubNavbar title={path === '/about-us' ? "About Us" : path === '/privacy-policy' ? "Privacy Policy" : "Terms & Condition"} header={'Cms Page'} subHeader={path === '/about-us' ? "About Us" : path === '/privacy-policy' ? "Privacy Policy" : "Terms & Condition"} />

                <div className="row ">
                    <div className="col-lg-12">
                        <div className="card shadow-sm m-2">
                            <div className="card text-center ">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="container-fluid">

                                                {/* Enaglish langauge */}
                                                {/* <hr></hr> */}
                                                <div className='col-lg-12  overflow-auto'>
                                                    <h4 className="d-flex justify-content-start">Description<p className='ms-1 me-1 text-mute'>(English)</p> <span style={{ color: "red" }}>*</span> </h4>

                                                    <div className='editor m-3'>
                                                        {path === '/about-us' ?
                                                            <ReactQuill type="text" id="about_content" name="about_content" modules={modules} style={{ "height": "500px" }} theme="snow" value={aboutValue} onChange={(aboutValue) => { setAbout(aboutValue) }} />
                                                            : path === '/privacy-policy' ?
                                                                <ReactQuill type="text" id="about_content" name="about_content" modules={modules} style={{ "height": "500px" }} theme="snow" value={policyValue} onChange={(policyValue) => { setPolicy(policyValue) }} />
                                                                :
                                                                <ReactQuill type="text" id="about_content" name="about_content" modules={modules} style={{ "height": "500px" }} theme="snow" value={conditionValue} onChange={(conditionValue) => { setCondition(conditionValue) }} />
                                                        }
                                                    </div>
                                                    <br />
                                                    <br />
                                                    <br />
                                                </div>

                                                <hr className=''></hr>
                                                {/* Hindi langauge */}
                                                <div className='col-lg-12 overflow-auto'>
                                                    <h4 className="d-flex justify-content-start mt-3 ">Description<span className='ms-1 me-1 text-mute'>(Hindi)</span> <span style={{ color: "red" }}>*</span> </h4>
                                                    <div className='editor m-3 mt-4'>
                                                        {path === '/about-us' ?
                                                            <ReactQuill type="text" id="about_content" name="about_content" modules={modules} style={{ "height": "430px" }} theme="snow" value={aboutHi} onChange={(aboutAr) => { setAboutHi(aboutAr) }} />
                                                            : path === '/privacy-policy' ?
                                                                <ReactQuill type="text" id="about_content" name="about_content" modules={modules} style={{ "height": "430px" }} theme="snow" value={policyHi} onChange={(policyAr) => { setPolicyHi(policyAr) }} />
                                                                :
                                                                <ReactQuill type="text" id="about_content" name="about_content" modules={modules} style={{ "height": "430px" }} theme="snow" value={conditionHi} onChange={(conditionAr) => { setConditionHi(conditionAr) }} />
                                                        }
                                                    </div>
                                                    <br />
                                                    <br />
                                                    <br />
                                                </div>

                                                {/* Gujarati langauge */}
                                                <div className='col-lg-12 overflow-auto'>
                                                    <h4 className="d-flex justify-content-start mt-3 ">Description<span className='ms-1 me-1 text-mute'>(Gujarati)</span> <span style={{ color: "red" }}>*</span> </h4>
                                                    <div className='editor m-3 mt-4'>
                                                        {path === '/about-us' ?
                                                            <ReactQuill type="text" id="about_content" name="about_content" modules={modules} style={{ "height": "430px" }} theme="snow" value={aboutGu} onChange={(aboutAr) => { setAboutGu(aboutAr) }} />
                                                            : path === '/privacy-policy' ?
                                                                <ReactQuill type="text" id="about_content" name="about_content" modules={modules} style={{ "height": "430px" }} theme="snow" value={policyGu} onChange={(policyAr) => { setPolicyGu(policyAr) }} />
                                                                :
                                                                <ReactQuill type="text" id="about_content" name="about_content" modules={modules} style={{ "height": "430px" }} theme="snow" value={conditionGu} onChange={(conditionAr) => { setConditionGu(conditionAr) }} />
                                                        }
                                                    </div>
                                                    <br />
                                                    <br />
                                                    <br />
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                    <hr></hr>
                                    <div className="row mb-5 form_submit ">
                                        <div className="col-lg-">

                                            <div className="modal-footer justify-content-center">
                                                <button type='button' className="btn btn-danger m-2" >Cancel</button>
                                                <button type='submit' className="btn btn-primary" onClick={success}>Submit</button>
                                            </div>

                                            {/* <div className="text-center mb-3 ">
                                                    
                                                    <button className="btn secondary-btn" type="button" data-bs-toggle="" data-bs-target="">Cancel</button>
                                                    <button class="btn primary-btn" type="submit" data-bs-toggle="" data-bs-target="" onClick={success}>Submit</button>
                                                </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* </div> */}
            </div>
        </>
    )
}