import * as yup from "yup"

const patientFormValidationSchema = yup.object().shape(
    {
        name: yup.string().required("Name cant be empty!"),
        email: yup.string().required("Email cant be empty!").email("Enter a valid email!"),
        phone: yup.string().required("Phone cant be empty!").matches(/^[0-9]{8}$/, "Enter valid Omani phone number (8 digits)!")
    }
)

export default patientFormValidationSchema
