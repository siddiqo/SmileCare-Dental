import * as yup from "yup"

const regFormValidationSchema = yup.object().shape(
    {
        fullName: yup.string().required("Name cant be empty!"),
        email: yup.string().required("Email cant be empty!").email("Enter a valid email!"),
        phone: yup.string().required("Phone cant be empty!").matches(/^[0-9]{8}$/, "Enter valid Omani phone number (8 digits)!"),
        dateOfBirth: yup.string().required("Date of Birth cant be empty!"),
        gender: yup.string().required("Gender cant be empty!").oneOf(['male', 'female'], "Select a valid gender!"),
        password: yup.string().required("Password cant be empty!").min(6, "Minimum 6 characters!")
    }
)

export default regFormValidationSchema
