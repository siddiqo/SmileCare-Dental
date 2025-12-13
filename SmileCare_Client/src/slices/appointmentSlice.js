import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"

export const showAppointmentsThunk = createAsyncThunk("appointmentSlice/showAppointmentsThunk", async () => {
    try {
        const showAppointments = await axios.get("http://localhost:5000/appointments")
        return (showAppointments.data)
    } catch (err) {
        console.log(err)
    }
})

export const newAppointmentThunk = createAsyncThunk("appointmentSlice/newAppointmentThunk", async (appointmentData) => {
    try {
        const newAppointment = await axios.post("http://localhost:5000/appointments", appointmentData)
        return (newAppointment.data)
    } catch (err) {
        console.log(err)
    }
})

export const editAppointmentThunk = createAsyncThunk("appointmentSlice/editAppointmentThunk", async (appointmentData) => {
    try {
        const appointmentId = appointmentData.appointmentId
        const editAppointmentData = {
            patientName: appointmentData.patientName,
            patientId: appointmentData.patientId,
            dentistName: appointmentData.dentistName,
            dentistId: appointmentData.dentistId,
            date: appointmentData.date,
            time: appointmentData.time,
            service: appointmentData.service,
            status: appointmentData.status,
            notes: appointmentData.notes,
            lat: appointmentData.lat || null,
            lon: appointmentData.lon || null
        }
        const editAppointment = await axios.put("http://localhost:5000/appointments/" + appointmentId, editAppointmentData)
        return (editAppointment.data)
    } catch (err) {
        console.log(err)
    }
})

export const delAppointmentThunk = createAsyncThunk("appointmentSlice/delAppointmentThunk", async (appointmentId) => {
    try {
        const delAppointment = await axios.delete("http://localhost:5000/appointments/" + appointmentId)
        return (delAppointment.data)
    } catch (err) {
        console.log(err)
    }
})

const appointmentInitialState = {
    appointments: [],
    msg: null,
    loading: false
}

const appointmentSlice = createSlice(
    {
        name: "appointmentSlice",
        initialState: appointmentInitialState,
        reducers: {},
        extraReducers: (builder) => {

            //Show all appointments
            builder.addCase(showAppointmentsThunk.pending, (state, action) => {
                state.loading = true
            })

            builder.addCase(showAppointmentsThunk.fulfilled, (state, action) => {
                state.appointments = action.payload.appointments
                state.loading = false

            })

            builder.addCase(showAppointmentsThunk.rejected, (state, action) => {
                state.msg = action.error.message
                state.loading = false
            })

            //Insert new appointment
            builder.addCase(newAppointmentThunk.pending, (state, action) => {
                state.loading = true
            })

            builder.addCase(newAppointmentThunk.fulfilled, (state, action) => {
                state.msg = action.payload.serverMsg
                state.loading = false

            })

            builder.addCase(newAppointmentThunk.rejected, (state, action) => {
                state.msg = action.error.message
                state.loading = false
            })

            //Edit appointment
            builder.addCase(editAppointmentThunk.pending, (state, action) => {
                state.loading = true
            })

            builder.addCase(editAppointmentThunk.fulfilled, (state, action) => {
                state.msg = action.payload.serverMsg
                state.loading = false

            })

            builder.addCase(editAppointmentThunk.rejected, (state, action) => {
                state.msg = action.error.message
                state.loading = false
            })

            //Delete appointment
            builder.addCase(delAppointmentThunk.pending, (state, action) => {
                state.loading = true
            })

            builder.addCase(delAppointmentThunk.fulfilled, (state, action) => {
                state.msg = action.payload.serverMsg
                state.loading = false

            })

            builder.addCase(delAppointmentThunk.rejected, (state, action) => {
                state.msg = action.error.message
                state.loading = false
            })

        }
    }
)

export default appointmentSlice.reducer
