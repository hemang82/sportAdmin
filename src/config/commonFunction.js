

import Constatnt, { Codes } from "./constant";
import CryptoJS from 'crypto-js';
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCountryListApiCall, setModalStatus } from "../Store/slices/MasterSlice";
import ExcelJS from 'exceljs';
import moment from 'moment';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { data } from "jquery";
import { allowedTypes, AstroInputTypesEnum, InputRegex, InputTypesEnum } from "./commonVariable";
import { Language } from "./common";
import { updateToken } from "../utils/api.services";

const KEY = CryptoJS.enc.Utf8.parse(Constatnt.KEY);
const IV = CryptoJS.enc.Utf8.parse(Constatnt.IV);

// ------------------------------------------------------- Encryption Decreption ---------------------------------------------------------------------------

export const Encryption = (request = {}, isStringify) => {
    const requestData = isStringify ? JSON.stringify(request) : request;
    let encrypted = CryptoJS.AES.encrypt(requestData, KEY, { iv: IV }).toString();
    return encrypted
}

export const Decryption = async (response) => {
    // console.log('Decreption response', response);
    let decrypted = await CryptoJS.AES.decrypt(response.toString(), KEY, { iv: IV });
    let decryptedData = await JSON.parse(decrypted.toString(CryptoJS.enc.Utf8))
    if (decryptedData?.code === '0') {
        TOAST_ERROR(decryptedData?.message);
    }
    if (decryptedData?.code === -1) {
        logoutRedirection();
    }
    return decryptedData;
}

export const ManageTokan = async (response) => {
    const refresh_token = localStorage.getItem(Constatnt?.REFRESH_TOKEN_KEY);
    if (refresh_token) {
        updateToken({ refresh_token: refresh_token }).then((response) => {
            console.log('response updateToken', response);
            if (response?.code === Codes.SUCCESS) {
                localStorage.setItem(Constatnt.ACCESS_TOKEN_KEY, response?.data?.accessToken);
            } else if (response?.code === Codes?.EXPIRE) {
                logoutRedirection()
            } else {
                logoutRedirection()
            }
        })
    } else {
        logoutRedirection()
    }
}

export function formatIndianPrice(price) {
    return price?.toLocaleString('en-IN') + `.00`;
}

export const getFileNameFromUrl = (url) => {
    return url ? url.split('/').pop() : "";
};

export const formatDate = (dateString, formatPattern) => {
    return moment(dateString).format(formatPattern);
};

export const getArrayFromCommaSeparated = (str) => {
    return str.split(',');
};

export const getCommaSeparatedNames = (list) => {
    return Array.isArray(list) ? list.map(item => item.name).join(', ') : '';
};
// ------------------------------------------------------- Login/Logout Redirection -----------------------------------------------------------------------

export const loginRedirection = (data) => {
    // const navigate = useNavigate();
    localStorage.setItem(Constatnt.LOGIN_KEY, true);
    localStorage.setItem(Constatnt.ROLE_KEY, data?.role);
    localStorage.setItem(Constatnt.ACCESS_TOKEN_KEY, data?.accessToken);
    localStorage.setItem(Constatnt.REFRESH_TOKEN_KEY, data?.refreshToken);
    localStorage.setItem(Constatnt.AUTH_KEY, JSON.stringify(data));
}

export const logoutRedirection = () => {
    // const navigate = useNavigate();
    localStorage.removeItem(Constatnt.LOGIN_KEY);
    localStorage.removeItem(Constatnt.ROLE_KEY);
    localStorage.removeItem(Constatnt.ACCESS_TOKEN_KEY);
    localStorage.removeItem(Constatnt.REFRESH_TOKEN_KEY);
    localStorage.removeItem(Constatnt.AUTH_KEY);
    // navigate('/login');
}

export const ExportToCSV = (data, fileName) => {
    try {
        let csvContent = '';
        if (Array.isArray(data) && data.length > 0) {
            if (Array.isArray(data[0])) {
                csvContent = data.map(row => row.join(",")).join("\n");
            } else if (typeof data[0] === 'object') {
                const headers = Object.keys(data[0]);
                csvContent += headers.join(",") + "\n";
                csvContent += data.map(row =>
                    headers.map(header => row[header]).join(",")
                ).join("\n");
            }
        }
        const blob = new Blob([csvContent], { type: 'text/csv' });

        if (window.navigator.msSaveBlob) {
            window.navigator.msSaveBlob(blob, `${fileName}.csv`);
        } else {
            const link = document.createElement("a");
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", `${fileName}.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            } else {
                TOAST_ERROR('Your browser does not support downloading files');
            }
        }
    } catch (error) {
        TOAST_ERROR(error);
    }
};

export const ExportToExcel = (data, fileName) => {
    try {
        const columns = Object.keys(data[0])?.map(item => item?.replace('_', ' ')?.toUpperCase());
        const columns1 = Object.keys(data[0]);

        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet('Sheet 1');

        ws.addRow(columns);

        data.forEach(item => {
            const row = [];
            columns1.forEach(column => {
                row.push(item[column]);
            });
            ws.addRow(row);
        });
        wb.xlsx.writeBuffer().then(buffer => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.setAttribute('download', `${fileName}.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    } catch (error) {
        TOAST_ERROR(error);
    }
};

export const ExportToPdf = (data, fileName, header) => {
    try {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(header, 14, 10);
        doc.setLineWidth(0.5);
        doc.line(14, 12, 196, 12);
        doc.setFontSize(18);

        const columns = Object.keys(data[0])?.map(item => item?.replace('_', ' ')?.toUpperCase());
        const tableData = data.map(item => Object.values(item));
        doc.autoTable(columns, tableData);
        doc.save(`${fileName}.pdf`);
    } catch (error) {
        TOAST_ERROR(error);
    }
};

export const TOAST_ERROR = (message) => {
    return toast.error(message);
};

export const convertToBase64 = async (file) => {
    if (file.type.includes("video")) return URL.createObjectURL(file);
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = () => {
            resolve(fileReader.result);
        };
        fileReader.onerror = reject;
        file && fileReader.readAsDataURL(file);
    });
};

export const addArray = (oldArray, addObject) => {
    const uniqueId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newObject = { ...addObject, id: uniqueId };
    const updatedArray = [...oldArray, newObject];

    return updatedArray;
}

export const updateArray = (oldArray, updateObject, id) => {

    const updatedImages = oldArray.map(data => {
        if (data.id === id) {
            // Update the selected image object with new data
            return updateObject;
        }
        return data;
    });

    return updatedImages
}

export const removeArray = (oldArray, id) => {
    const updatedData = oldArray.filter(data => data.id !== id);
    return updatedData

}

export const findIndexArray = (oldArray, id) => {
    const indexToEdit = oldArray.findIndex(data => data.id === id);
    if (indexToEdit !== -1) {
        return true;
    } else {
        return false;
    }
}

export const selectOption = (option) => {
    const optionData = option?.map((option, index) => (
        <option key={option.id} value={option.id}>
            {
                option.name
            }
        </option>
    ))
    return optionData;
}

export const closeModel = (dispatch) => {
    dispatch(setModalStatus({ modalType: '', isOpen: false, }))
}

export const openModel = (dispatch, type) => {
    dispatch(setModalStatus({ modalType: type, isOpen: true, }))
}

export const momentTimeFormate = (time, timeFormate) => {
    return moment(time && time).format(timeFormate)
}

// --------------------------------- Input validation ------------------------------------

export const handelInputText = (event) => {
    const { value, name } = event.target;
    console.log('-----------------  name  --------------------->', name);
    const input = String.fromCharCode(event.which);
    isValidInput(name, input, event)
}

export const isValidInput = (inputType, text, event) => {

    var pattern = /^[A-Za-z]+$/;

    if (inputType === InputTypesEnum.FIRSTNAME || inputType === InputTypesEnum.LASTNAME) {

        pattern = InputRegex.FIRSTNAME_REGEX;
    } else if (inputType === InputTypesEnum.EMAIL) {

        pattern = InputRegex.EMAIL_REGEX;

    } else if (inputType === InputTypesEnum.ONCHANGEEMAIL) {

        pattern = InputRegex.ONCHANGEEMAIL_REGEX;

    } else if (inputType === InputTypesEnum.MOBILE) {

        pattern = InputRegex.MOBILE_REGEX;

    } else if (inputType === InputTypesEnum.PASSWORD || InputTypesEnum.OLDPASSWORD || InputTypesEnum.NEWPASSWORD) {

        pattern = InputRegex.PASSWORD_REGEX;

    } else if (inputType === InputTypesEnum.ONCHANGEPASSWORD) {

        pattern = /^[A-Za-z0-9!@#$%&*]+$/;

    } else if (inputType === InputTypesEnum.ADDRESS) {

        pattern = InputRegex.ADDRESS_REGEX;

    } else if (inputType === InputTypesEnum.CITY || inputType === InputTypesEnum.COUNTRY || inputType === InputTypesEnum.NAME) {

        pattern = InputRegex.CHAR_REGEX;

    } else if (inputType === InputTypesEnum.ZIPCODE) {

        pattern = InputRegex.NUMBER_REGEX;
    }

    if (pattern.test(text) && text !== ' ') {
        return pattern.test(text);
    } else {
        event.preventDefault();
    }
};

export const textValidation = (inputType, value) => {

    // console.log('textValidation inputType', inputType);
    if (inputType === InputTypesEnum.FIRSTNAME) {
        return ({
            required: "Enter first name",
            minLength: {
                value: 2,
                message: "Invalid first name."
            },
            pattern: {
                value: InputRegex.FIRSTNAME_REGEX,
                message: "First name should only contain letters"
            }
        })
    }

    if (inputType === InputTypesEnum.LASTNAME) {
        return ({
            required: "Enter last name",
            minLength: {
                value: 2,
                message: "Invalid last name."
            },
            pattern: {
                value: InputRegex.FIRSTNAME_REGEX,
                message: "Last name should only contain letters"
            }
        })
    }

    if (inputType === InputTypesEnum.EMAIL) {

        return ({ required: Language('enterEmailAddress'), pattern: { value: InputRegex.EMAIL_REGEX, message: Language('enterValidEmail'), }, })
    }

    if (inputType === InputTypesEnum.PASSWORD) {
        return ({
            required: Language('enterPassword'),
            pattern: {
                value: InputRegex.PASSWORD_REGEX,
                message: Language('passwordValidation'),
            },
        })
    }

    if (inputType === InputTypesEnum.OLDPASSWORD) {
        return ({
            required: "Enter old password",
            pattern: {
                value: InputRegex.PASSWORD_REGEX,
                message: Language('passwordValidation'),
            },
        })
    }

    if (inputType === InputTypesEnum.NEWPASSWORD) {
        return ({
            required: "Enter new password",
            pattern: {
                value: InputRegex.PASSWORD_REGEX,
                message: Language('passwordValidation'),
            },
        })
    }

    if (inputType === InputTypesEnum.CONFIRM_PASSWORD) {
        return ({
            required: "Enter confirm password",
            pattern: {
                value: InputRegex.PASSWORD_REGEX,
                message: Language('passwordValidation'),
            },
            validate: (v) => v === value || "Password do not match"
        })
    }

}

// export const textInputValidation = (inputType, error) => {

//     if (inputType === InputTypesEnum.CATEGORY_EN
//         || inputType === InputTypesEnum.CATEGORY_AR ||
//         inputType === InputTypesEnum.SUB_CATEGORY_AR || inputType === InputTypesEnum.SUB_CATEGORY_EN || inputType === InputTypesEnum.SUB_CATEGORY_TOKEN || inputType === InputTypesEnum.NAME_EN || inputType === InputTypesEnum.NAME_AR || inputType === InputTypesEnum.TOKEN || inputType === InputTypesEnum.DESCRIPTION_EN || inputType === InputTypesEnum.DESCRIPTION_AR) {
//         return ({
//             required: error,
//         })
//     }
// }

export const textInputValidation = (inputType, error) => {
    if (inputType === AstroInputTypesEnum.BLANK_SPACE) {
        return ({
            required: false,
        })
    } else {
        return ({
            required: error,
        })
    }
}

export const truncateWords = (text, wordLimit = 3) => {
    if (!text) return '-';
    const words = text.split(' ');
    return words.length > wordLimit
        ? words.slice(0, wordLimit).join(' ') + '...'
        : text;
};

// export const Codes = {
//     SUCCESS: 1,
//     INVALID_OR_FAIL: 0,
//     NO_DATA_FOUND: 2,
//     DELETE_ACCOUNT: 3,
//     USER_SESSION_EXPIRE: -1,
// };

export const validateFileType = (file) => {
    const isAllowed = allowedTypes.includes(file.type);
    return isAllowed || false;
};
// --------------------------------- input validation ------------------------------------
