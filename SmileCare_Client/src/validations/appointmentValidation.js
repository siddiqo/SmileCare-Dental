import * as yup from "yup"

const appointmentFormValidationSchema = yup.object().shape(
    {
        firstName: yup.string().required("First name cant be empty!"),
        lastName: yup.string().required("Last name cant be empty!"),
        email: yup.string().required("Email cant be empty!").email("Enter a valid email!"),
        phone: yup.string().required("Phone cant be empty!").matches(/^[0-9]{8}$/, "Enter valid Omani phone number (8 digits)!"),
        service: yup.string().required("Service cant be empty!"),
        dentist: yup.string().required("Dentist cant be empty!"),
        date: yup.string().required("Date cant be empty!"),
        time: yup.string().required("Time cant be empty!"),
        agreeToTerms: yup.boolean().oneOf([true], "You must agree to the terms!")
    }
)

export default appointmentFormValidationSchema
