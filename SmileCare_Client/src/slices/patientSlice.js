import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"

export const showPatientsThunk = createAsyncThunk("patientSlice/showPatientsThunk", async () => {
    try {
        const showPatients = await axios.get("http://localhost:5000/patients")
        return (showPatients.data)
    } catch (err) {
        console.log(err)
    }
})

export const newPatientThunk = createAsyncThunk("patientSlice/newPatientThunk", async (patientData) => {
    try {
        const newPatient = await axios.post("http://localhost:5000/patients", patientData)
        return (newPatient.data)
    } catch (err) {
        console.log(err)
    }
})

export const editPatientThunk = createAsyncThunk("patientSlice/editPatientThunk", async (patientData) => {
    try {
        const patientId = patientData.patientId
        const editPatientData = {
            name: patientData.name,
            email: patientData.email,
            phone: patientData.phone,
            dateOfBirth: patientData.dateOfBirth,
            gender: patientData.gender,
            address: patientData.address,
            medicalHistory: patientData.medicalHistory
        }
        const editPatient = await axios.put("http://localhost:5000/patients/" + patientId, editPatientData)
        return (editPatient.data)
    } catch (err) {
        console.log(err)
    }
})

export const delPatientThunk = createAsyncThunk("patientSlice/delPatientThunk", async (patientId) => {
    try {
        const delPatient = await axios.delete("http://localhost:5000/patients/" + patientId)
        return (delPatient.data)
    } catch (err) {
        console.log(err)
    }
})

const patientInitialState = {
    patients: [],
    msg: null,
    loading: false
}

const patientSlice = createSlice(
    {
        name: "patientSlice",
        initialState: patientInitialState,
        reducers: {},
        extraReducers: (builder) => {

            //Show all patients
            builder.addCase(showPatientsThunk.pending, (state, action) => {
                state.loading = true
            })

            builder.addCase(showPatientsThunk.fulfilled, (state, action) => {
                state.patients = action.payload.patients
                state.loading = false

            })

            builder.addCase(showPatientsThunk.rejected, (state, action) => {
                state.msg = action.error.message
                state.loading = false
            })

            //Insert new patient
            builder.addCase(newPatientThunk.pending, (state, action) => {
                state.loading = true
            })

            builder.addCase(newPatientThunk.fulfilled, (state, action) => {
                state.msg = action.payload.serverMsg
                state.loading = false

            })

            builder.addCase(newPatientThunk.rejected, (state, action) => {
                state.msg = action.error.message
                state.loading = false
            })

            //Edit patient
            builder.addCase(editPatientThunk.pending, (state, action) => {
                state.loading = true
            })

            builder.addCase(editPatientThunk.fulfilled, (state, action) => {
                state.msg = action.payload.serverMsg
                state.loading = false

            })

            builder.addCase(editPatientThunk.rejected, (state, action) => {
                state.msg = action.error.message
                state.loading = false
            })

            //Delete patient
            builder.addCase(delPatientThunk.pending, (state, action) => {
                state.loading = true
            })

            builder.addCase(delPatientThunk.fulfilled, (state, action) => {
                state.msg = action.payload.serverMsg
                state.loading = false

            })

            builder.addCase(delPatientThunk.rejected, (state, action) => {
                state.msg = action.error.message
                state.loading = false
            })

        }
    }
)

export default patientSlice.reducer
