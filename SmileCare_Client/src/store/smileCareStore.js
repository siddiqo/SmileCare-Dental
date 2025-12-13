import { configureStore } from "@reduxjs/toolkit"
import userReducer from "../slices/userSlice"
import dentistReducer from "../slices/dentistSlice"
import patientReducer from "../slices/patientSlice"
import appointmentReducer from "../slices/appointmentSlice"

const smileCareStore = configureStore(
    {
        reducer: {
            user: userReducer,
            dentist: dentistReducer,
            patient: patientReducer,
            appointment: appointmentReducer

        }

    }
)

export default smileCareStore
