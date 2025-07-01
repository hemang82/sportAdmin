import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as API from '../../utils/api.services';

// ------------------------------------------------------ Sports Project -------------------------------------------------------------------------

export const getUserListThunk = createAsyncThunk("userList", async (submitData, { dispatch }) => {
    try {
        // dispatch(setLoader(true))
        const { data } = await API.customerList(submitData);
        // dispatch(setLoader(false))
        return data;
    } catch (error) {
        throw error;
    }
});

export const getCityListThunk = createAsyncThunk("cityList", async (submitData, { dispatch }) => {
    try {
        // dispatch(setLoader(true))
        const { data } = await API.cityList(submitData);
        // dispatch(setLoader(false))
        return data;
    } catch (error) {
        throw error;
    }
});

export const getGameListListThunk = createAsyncThunk("gameList", async (submitData, { dispatch }) => {
    try {
        // dispatch(setLoader(true))
        const { data } = await API.gameList(submitData);
        // dispatch(setLoader(false))
        return data;
    } catch (error) {
        throw error;
    }
});

export const getVenueListListThunk = createAsyncThunk("venueList", async (submitData, { dispatch }) => {
    try {
        // dispatch(setLoader(true))
        const { data } = await API.venueList(submitData);
        // dispatch(setLoader(false))
        return data;
    } catch (error) {
        throw error;
    }
});

export const getContactUSListThunk = createAsyncThunk("ContactUS", async (submitData, { dispatch }) => {
    try {
        // dispatch(setLoader(true))
        const { data } = await API.listContactUs(submitData);
        // dispatch(setLoader(false))
        return data;
    } catch (error) {
        throw error;
    }
});


export const getBannerListThunk = createAsyncThunk("bannerList", async (submitData, { dispatch }) => {
    try {
        // dispatch(setLoader(true))
        const { data } = await API.bannerList(submitData);
        // dispatch(setLoader(false))
        return data;
    } catch (error) {
        throw error;
    }
});

export const getbookingListThunk = createAsyncThunk("bookingList", async (submitData, { dispatch }) => {
    try {
        // dispatch(setLoader(true))
        const { data } = await API.bookingList(submitData);
        // dispatch(setLoader(false))
        return data;
    } catch (error) {
        throw error;
    }
});


const initialState = {

    isLoading: false,

    customModel: {
        isOpen: false,
        modalType: ''
    },

    // ----------------------- Sports ------------------------- 

    customerList: {
        data: [],
        error: null,
    },
    cityList: {
        data: [],
        error: null,
    },
    cityList: {
        data: [],
        error: null,
    },
    gameList: {
        data: [],
        error: null,
    },
    venueList: {
        data: [],
        error: null,
    },
    contactList: {
        data: [],
        error: null,
    },
    bannerList: {
        data: [],
        error: null,
    },
    bookingList: {
        data: [],
        error: null,
    },
    pageScroll: false
}

const masterSlice = createSlice({
    name: 'masterslice',
    initialState,
    reducers: {
        setLoader: (state, action) => {
            state.isLoading = action.payload;
        },

        setModalStatus: (state, action) => {
            const { modalType, isOpen, data } = action.payload;
            state.customModel.modalType = modalType;
            state.customModel.isOpen = isOpen;
        },

        updatePageScroll: (state, action) => {
            state.pageScroll = action.payload;
        },

        // ------------------ Sports --------------------

        updateCityList: (state, action) => {
            state.cityList.data = action.payload;
        },

        updateGameList: (state, action) => {
            state.gameList.data = action.payload;
        },
        updateVenueList: (state, action) => {
            state.venueList.data = action.payload;
        },
        updateBannerList: (state, action) => {
            state.venueList.data = action.payload;
        }

    },

    extraReducers: (builder) => {
        builder
            .addCase(getUserListThunk.fulfilled, (state, action) => {
                state.customerList.data = action.payload;
            })
            .addCase(getUserListThunk.rejected, (state, action) => {
                state.customerList.error = action.error.message;
            })

            .addCase(getCityListThunk.fulfilled, (state, action) => {
                state.cityList.data = action.payload;
            })
            .addCase(getCityListThunk.rejected, (state, action) => {
                state.cityList.error = [];
            })

            .addCase(getGameListListThunk.fulfilled, (state, action) => {
                state.gameList.data = action.payload;
            })
            .addCase(getGameListListThunk.rejected, (state, action) => {
                state.gameList.data = [];
            })

            .addCase(getVenueListListThunk.fulfilled, (state, action) => {
                state.venueList.data = action.payload;
            })
            .addCase(getVenueListListThunk.rejected, (state, action) => {
                state.venueList.data = [];
            })

            .addCase(getContactUSListThunk.fulfilled, (state, action) => {
                state.contactList.data = action.payload;
            })
            .addCase(getContactUSListThunk.rejected, (state, action) => {
                state.contactList.data = [];
            })

            .addCase(getBannerListThunk.fulfilled, (state, action) => {
                state.bannerList.data = action.payload;
            })
            .addCase(getBannerListThunk.rejected, (state, action) => {
                state.bannerList.data = [];
            })

            .addCase(getbookingListThunk.fulfilled, (state, action) => {
                state.bookingList.data = action.payload;
            })
            .addCase(getbookingListThunk.rejected, (state, action) => {
                state.bookingList.data = [];
            })

        // ------------------------------------------------ Sports ------------------------------------
    },
});

export const { setLoader, setModalStatus, updatePageScroll, updateCityList, updateGameList, updateVenueList, updateBannerList } = masterSlice.actions;
export default masterSlice.reducer;