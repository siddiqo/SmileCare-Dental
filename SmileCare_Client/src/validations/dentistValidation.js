import * as yup from "yup"

const dentistFormValidationSchema = yup.object().shape(
    {
        name: yup.string().required("Name cant be empty!"),
        email: yup.string().required("Email cant be empty!").email("Enter a valid email!"),
        specialty: yup.string().required("Specialty cant be empty!"),
        phone: yup.string().matches(/^[0-9]{8}$/, "Enter valid Omani phone number (8 digits)!")
    }
)

export default dentistFormValidationSchema
