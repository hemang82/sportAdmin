import { Encryption } from "../config/common";
import AxiosClientApi from "./axios.services";

/*==================================================== 
    Auth Routers                                                                              
====================================================== */

const CMS = "cms";
const CATEGORY = "category";
const POST = "post";
const STREAM = "stream";
const USER_REPORT = "user_report";
const GIFT = "gift";
const NOTIFICATION = "notification/";

// ----------------------- Astro ---------------------------------- 
const ADMIN = "admin";
const AUTH = "auth";
const COMMON = "common";
const GAME = "game";
const VENUE = "venue";

const BANNER = "banner";
const FILTER_CATEGORY = "filter_category";
const CUSTOMER = "customer";
const COUPON_CODE = 'couopon_code'
const BLOG = 'blog'
const OUR_CELEBRITY = 'our_celebrity'
const DASHBOARD = 'dashboard'
const ASTROLOGER = 'astrologer'
const NEWS = "news";


// ---------------- common use -----------------------

const APPLICATION = 'application'

export function addCategory(request) {
    return AxiosClientApi.post(`/${ADMIN}/${CATEGORY}/add_category`, Encryption(request, true))
}

export function categoryList(request) {
    return AxiosClientApi.post(`/${ADMIN}/${CATEGORY}/category_list`, Encryption(request, true))
}

export function categoryDetails(request) {
    return AxiosClientApi.post(`/${ADMIN}/${CATEGORY}/category_details`, Encryption(request, true))
}

export function exportCategoryList(request) {
    return AxiosClientApi.post(`/${ADMIN}/${CATEGORY}/export_category_list`, Encryption(request, true))
}

export function getUserList(request) {
    return AxiosClientApi.post(`/${ADMIN}/user/get_user_list`, Encryption(request, true))
}

export function editUserDetials(request) {
    return AxiosClientApi.post('/admin/user/edit_user_detials', Encryption(request, true))
}

// ------------------------------------------ astrologer list ------------------------------------------

export function login(request) {
    return AxiosClientApi.post(`/${ADMIN}/${AUTH}/login`, request, true)
}

export function ChangePassword(request) {
    return AxiosClientApi.post(`/${ADMIN}/${AUTH}/change_password`, request, true)
}

export function astrologerCategoryDropDown(request) {
    return AxiosClientApi.post(`/astrologer/auth/drop_down_list`, request, true)
}

export function updateToken(request) {
    return AxiosClientApi.post(`/${AUTH}/upd_refresh_token`, request, true)
}

export function getAstrologerList(request) {
    return AxiosClientApi.post('/astrologers/astrologers_listing', request)
}

export function getBlogList(request) {
    return AxiosClientApi.post('/blog/blog_listing', request)
}

export function getCouponCodeList(request) {
    return AxiosClientApi.post('/coupon_code/list_coupon_code', request)
}

export function CouponCodeDetails(request) {
    return AxiosClientApi.post('/coupon_code/coupon_code_details', request)
}

export function CouponCodeDelete(request) {
    return AxiosClientApi.post('/coupon_code/delete_coupon_code', request)
}

export function OurCelebrityList(request) {
    return AxiosClientApi.post('/common/list_celebritycustomer', request)
}

// ----------------------------------------  Banner Module ----------------------------

export function AddBanner(request) {
    return AxiosClientApi.post(`/${ADMIN}/${BANNER}/add_banner`, request)
}

export function BannerList(request) {
    return AxiosClientApi.post(`/${ADMIN}/${BANNER}/banner_listing`, request)
}

export function DeleteBanner(request) {
    return AxiosClientApi.post(`/${ADMIN}/${BANNER}/delete_banner`, request)
}

export function EditBanner(request) {
    return AxiosClientApi.post(`/${ADMIN}/${BANNER}/edit_banner`, request)
}

// ----------------------------------------  Banner Module ----------------------------

export function ListCategory(request) {
    return AxiosClientApi.post(`/${ADMIN}/${FILTER_CATEGORY}/list_category`, request)
}

export function AddCategory(request) {
    return AxiosClientApi.post(`/${ADMIN}/${FILTER_CATEGORY}/add_category`, request)
}

export function EditCategory(request) {
    return AxiosClientApi.post(`/${ADMIN}/${FILTER_CATEGORY}/edit_category`, request)
}

export function DeleteCategory(request) {
    return AxiosClientApi.post(`/${ADMIN}/${FILTER_CATEGORY}/delete_category`, request)
}


// --------------------------------------Filter Category Module --------------------------

export function addCategoryFilter(request) {
    return AxiosClientApi.post(`/${ADMIN}/${FILTER_CATEGORY}/add_filterdata`, request)
}

export function editCategoryFilter(request) {
    return AxiosClientApi.post(`/${ADMIN}/${FILTER_CATEGORY}/edit_filterdata`, request)
}

export function deleteCategoryFilter(request) {
    return AxiosClientApi.post(`/${ADMIN}/${FILTER_CATEGORY}/delete_filterdata`, request)
}

export function listCategoryFilter(request) {
    return AxiosClientApi.post(`/${ADMIN}/${FILTER_CATEGORY}/filterdata_listing`, request)
}

export function detailsCategoryFilter(request) {
    return AxiosClientApi.post(`/${ADMIN}/${FILTER_CATEGORY}/filterdata_details`, request)
}

// ---------------------------------------- Customer Module ----------------------------

export function customerList(request) {
    return AxiosClientApi.post(`/${ADMIN}/${COMMON}/user_listing`, request)
}

export function EditCustomer(request) {
    // return AxiosClientApi.post(`/${ADMIN}/${CUSTOMER}/edit_customer`, request)
}

export function CustomerDetails(request) {
    // return AxiosClientApi.post(`/${ADMIN}/${CUSTOMER}/customer_details`, request)
}

export function cityList(request) {
    return AxiosClientApi.post(`/${ADMIN}/${COMMON}/city_listing`, request)
}

export function addCity(request) {
    return AxiosClientApi.post(`/${ADMIN}/${COMMON}/add_city`, request)
}

export function editCity(request) {
    return AxiosClientApi.post(`/${ADMIN}/${COMMON}/edit_city`, request)
}

export function deleteCity(request) {
    return AxiosClientApi.post(`/${ADMIN}/${COMMON}/delete_city`, request)
}

export function gameList(request) {
    return AxiosClientApi.post(`/${ADMIN}/${GAME}/game_listing`, request)
}

export function addGame(request) {
    return AxiosClientApi.post(`/${ADMIN}/${GAME}/add_game`, request)
}

export function editGame(request) {
    return AxiosClientApi.post(`/${ADMIN}/${GAME}/edit_game`, request)
}

export function deleteGame(request) {
    return AxiosClientApi.post(`/${ADMIN}/${GAME}/delete_game`, request)
}

// ---------------------------------------- Venue Module -------------------------------

export function venueList(request) {
    return AxiosClientApi.post(`/${ADMIN}/${VENUE}/venue_listing`, request)
}

export function addVenue(request) {
    return AxiosClientApi.post(`/${ADMIN}/${VENUE}/add_venue`, request)
}

export function editVenue(request) {
    return AxiosClientApi.post(`/${ADMIN}/${VENUE}/edit_venue`, request)
}
export function detailsVenue(request) {
    return AxiosClientApi.post(`/${ADMIN}/${VENUE}/venue_details`, request)
}

export function delateVenue(request) {
    return AxiosClientApi.post(`/${ADMIN}/${VENUE}/delete_venue`, request)
}

export function listContactUs(request) {
    return AxiosClientApi.post(`/${ADMIN}/${COMMON}/contact_us_listing`, request)
}

export function bannerList(request) {
    return AxiosClientApi.post(`/${ADMIN}/${COMMON}/banner_listing`, request)
}

export function editBanner(request) {
    return AxiosClientApi.post(`/${ADMIN}/${COMMON}/edit_banner`, request)
}

export function addBanner(request) {
    return AxiosClientApi.post(`/${ADMIN}/${COMMON}/add_banner`, request)
}

export function bookingList(request) {
    return AxiosClientApi.post(`/${ADMIN}/${COMMON}/booking_listing`, request)
}

export function editCmsPages(request) {
    return AxiosClientApi.post(`/${ADMIN}/${COMMON}/edit_cms_pages`, request)
}

export function detailsCmsPages(request) {
    return AxiosClientApi.post(`/${ADMIN}/${COMMON}/cms_pages_listing`, request)
}

// ---------------------------------------- Dashboard Module -------------------------------

export function DashboardCount(request) {
    return AxiosClientApi.post(`/${ADMIN}/${DASHBOARD}/dashboard_count`, request)
}

export function FAQList(request) {
    return AxiosClientApi.post(`/${ADMIN}/${COMMON}/faqs_listing`, request)
}

export function AddFAQ(request) {
    return AxiosClientApi.post(`/${ADMIN}/${COMMON}/add_faqs`, request)
}

export function EditFAQ(request) {
    return AxiosClientApi.post(`/${ADMIN}/${COMMON}/edit_faqs`, request)
}

export function DeleteFAQ(request) {
    return AxiosClientApi.post(`/${ADMIN}/${COMMON}/delete_faqs`, request)
}

export function addSetting(request) {
    return AxiosClientApi.post(`/${ADMIN}/${COMMON}/add_setting`, request)
}

export function editSetting(request) {
    return AxiosClientApi.post(`/${ADMIN}/${COMMON}/edit_setting`, request)
}


export function listSetting(request) {
    return AxiosClientApi.post(`/${ADMIN}/${COMMON}/setting_listing`, request)
}

export function applyFreeChat(request) {
    return AxiosClientApi.post(`/${ADMIN}/${COMMON}/add_freechat`, request)
}


export function deleteContactUs(request) {
    return AxiosClientApi.post(`/${ADMIN}/${COMMON}/delete_contactus`, request)
}

export function editStaticContent(request) {
    return AxiosClientApi.post(`/${ADMIN}/${COMMON}/edit_static_content`, request)
}

export function listStaticContent(request) {
    return AxiosClientApi.post(`/${ADMIN}/${COMMON}/static_content_listing`, request)
}

export function listStaticContentDropdown(request) {
    return AxiosClientApi.post(`/${ADMIN}/${COMMON}/static_listarray_drop`, request)
}



export function addApiKey(request) {
    return AxiosClientApi.post(`/${ADMIN}/${COMMON}/add_astroapi_key`, request)
}






