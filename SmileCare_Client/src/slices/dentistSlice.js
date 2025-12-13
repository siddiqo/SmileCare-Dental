import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"

export const showDentistsThunk = createAsyncThunk("dentistSlice/showDentistsThunk", async () => {
    try {
        const showDentists = await axios.get("http://localhost:5000/dentists")
        return (showDentists.data)
    } catch (err) {
        console.log(err)
    }
})

export const newDentistThunk = createAsyncThunk("dentistSlice/newDentistThunk", async (dentistData) => {
    try {
        const newDentist = await axios.post("http://localhost:5000/dentists", dentistData)
        return (newDentist.data)
    } catch (err) {
        console.log(err)
    }
})

export const editDentistThunk = createAsyncThunk("dentistSlice/editDentistThunk", async (dentistData) => {
    try {
        const dentistId = dentistData.dentistId
        const editDentistData = {
            name: dentistData.name,
            email: dentistData.email,
            specialty: dentistData.specialty,
            phone: dentistData.phone,
            image: dentistData.image
        }
        const editDentist = await axios.put("http://localhost:5000/dentists/" + dentistId, editDentistData)
        return (editDentist.data)
    } catch (err) {
        console.log(err)
    }
})

export const delDentistThunk = createAsyncThunk("dentistSlice/delDentistThunk", async (dentistId) => {
    try {
        const delDentist = await axios.delete("http://localhost:5000/dentists/" + dentistId)
        return (delDentist.data)
    } catch (err) {
        console.log(err)
    }
})

const dentistInitialState = {
    dentists: [],
    msg: null,
    loading: false
}

const dentistSlice = createSlice(
    {
        name: "dentistSlice",
        initialState: dentistInitialState,
        reducers: {},
        extraReducers: (builder) => {

            //Show all dentists
            builder.addCase(showDentistsThunk.pending, (state, action) => {
                state.loading = true
            })

            builder.addCase(showDentistsThunk.fulfilled, (state, action) => {
                state.dentists = action.payload.dentists
                state.loading = false

            })

            builder.addCase(showDentistsThunk.rejected, (state, action) => {
                state.msg = action.error.message
                state.loading = false
            })

            //Insert new dentist
            builder.addCase(newDentistThunk.pending, (state, action) => {
                state.loading = true
            })

            builder.addCase(newDentistThunk.fulfilled, (state, action) => {
                state.msg = action.payload.serverMsg
                state.loading = false

            })

            builder.addCase(newDentistThunk.rejected, (state, action) => {
                state.msg = action.error.message
                state.loading = false
            })

            //Edit dentist
            builder.addCase(editDentistThunk.pending, (state, action) => {
                state.loading = true
            })

            builder.addCase(editDentistThunk.fulfilled, (state, action) => {
                state.msg = action.payload.serverMsg
                state.loading = false

            })

            builder.addCase(editDentistThunk.rejected, (state, action) => {
                state.msg = action.error.message
                state.loading = false
            })

            //Delete dentist
            builder.addCase(delDentistThunk.pending, (state, action) => {
                state.loading = true
            })

            builder.addCase(delDentistThunk.fulfilled, (state, action) => {
                state.msg = action.payload.serverMsg
                state.loading = false

            })

            builder.addCase(delDentistThunk.rejected, (state, action) => {
                state.msg = action.error.message
                state.loading = false
            })

        }
    }
)

export default dentistSlice.reducer
