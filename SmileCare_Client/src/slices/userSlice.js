import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"

export const registerUserThunk = createAsyncThunk("userSlice/registerUserThunk", async (userData) => {
    try {
        const newRegistration = await axios.post("http://localhost:5000/userRegister", userData)
        return (newRegistration.data)
    } catch (err) {
        console.log(err)
    }
})

export const loginThunk = createAsyncThunk("userSlice/loginThunk", async (userData) => {
    try {
        const loginUser = await axios.post("http://localhost:5000/userLogin", userData)
        return (loginUser.data)
    } catch (err) {
        console.log(err)
    }
})

export const logoutThunk = createAsyncThunk("userSlice/logoutThunk", async () => {
    try {
        localStorage.removeItem('smileCareUser')
        return true
    } catch (err) {
        console.log(err)
    }
})

const userInitialState = {
    user: null,
    msg: null,
    loading: false,
    loginStatus: false,
    registerStatus: false
}

const userSlice = createSlice(
    {
        name: "userSlice",
        initialState: userInitialState,
        reducers: {
            resetRegisterStatus: (state) => {
                state.registerStatus = false
                state.msg = null
            }
        },
        extraReducers: (builder) => {

            //register new user
            builder.addCase(registerUserThunk.pending, (state, action) => {
                state.loading = true
            })

            builder.addCase(registerUserThunk.fulfilled, (state, action) => {
                state.msg = action.payload.serverMsg
                state.loading = false
                state.registerStatus = action.payload.flag || false
            })

            builder.addCase(registerUserThunk.rejected, (state, action) => {
                state.msg = action.error.message
                state.loading = false
                state.registerStatus = false
            })

            // login check
            builder.addCase(loginThunk.pending, (state, action) => {
                state.loading = true
            })

            builder.addCase(loginThunk.fulfilled, (state, action) => {
                state.msg = action.payload.serverMsg
                state.user = action.payload.user
                state.loginStatus = action.payload.loginStatus
                state.loading = false
                // Store user in localStorage
                if (action.payload.loginStatus) {
                    localStorage.setItem('smileCareUser', JSON.stringify(action.payload.user))
                }
            })

            builder.addCase(loginThunk.rejected, (state, action) => {
                state.msg = action.error.message
                state.loading = false
                state.loginStatus = false
            })

            //Logout
            builder.addCase(logoutThunk.pending, (state, action) => {
                state.loading = true;
            })
            builder.addCase(logoutThunk.fulfilled, (state, action) => {
                state.user = null;
                state.loading = false;
                state.loginStatus = false;
                state.msg = null;
            })
            builder.addCase(logoutThunk.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
                state.loginStatus = false;
            })
        }
    }
)

export const { resetRegisterStatus } = userSlice.actions
export default userSlice.reducer
