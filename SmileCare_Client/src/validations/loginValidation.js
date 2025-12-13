import * as yup from "yup"

const loginFormValidationSchema = yup.object().shape(
    {
        email: yup.string().required("Email cant be empty!").email("Enter a valid email!"),
        password: yup.string().required("Password cant be empty!")
    }
)

export default loginFormValidationSchema
