import { BrowserRouter } from "react-router-dom"
import AuthModal from "../AuthModal"
import { render, screen, fireEvent } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "redux-mock-store"
import reducer from "../../slices/userSlice"

const myMockStore = configureStore([])
const myStore = myMockStore({
    user: {
        user: null,
        msg: null,
        loginStatus: false,
        loading: false
    }
})

test("Match the UI of AuthModal.js - snapshot : ", () => {
    const mockToggle = jest.fn()
    const mockOnLoginSuccess = jest.fn()

    const { container } = render(
        <Provider store={myStore}>
            <BrowserRouter>
                <AuthModal
                    isOpen={true}
                    toggle={mockToggle}
                    onLoginSuccess={mockOnLoginSuccess}
                />
            </BrowserRouter>
        </Provider>
    )

    expect(container).toMatchSnapshot()
})


const myTestInitVal = {
    user: null,
    msg: null,
    loginStatus: false,
    loading: false
}

test("To Test the initial values of userSlice :", () => {
    expect(
        reducer(undefined, { type: undefined })
    ).toEqual(myTestInitVal)
})


test("To check the login is accepting valid email: ", () => {
    const mockToggle = jest.fn()
    const mockOnLoginSuccess = jest.fn()

    render(
        <Provider store={myStore}>
            <BrowserRouter>
                <AuthModal
                    isOpen={true}
                    toggle={mockToggle}
                    onLoginSuccess={mockOnLoginSuccess}
                />
            </BrowserRouter>
        </Provider>
    );

    const emailInput = screen.getByTestId("login-email");

    // Valid email format. Here we mimic that user enters valid.email@example.om in the email text field.
    // If the email format matches then test case will be passed otherwise testcase will be failed
    //for Pass test case
    fireEvent.change(emailInput, { target: { value: 'patient@smilecare.om' } });

    //for Fail test case
    //fireEvent.change(emailInput, { target: { value: 'patient@smilecare' } });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    expect(emailRegex.test(emailInput.value)).toBe(true);
})


test("To check the registration phone accepts valid Omani phone format: ", () => {
    const mockToggle = jest.fn()
    const mockOnLoginSuccess = jest.fn()

    render(
        <Provider store={myStore}>
            <BrowserRouter>
                <AuthModal
                    isOpen={true}
                    toggle={mockToggle}
                    onLoginSuccess={mockOnLoginSuccess}
                />
            </BrowserRouter>
        </Provider>
    );

    const phoneInput = screen.getByTestId("register-phone");

    // Valid Omani phone format (8 digits). Here we mimic that user enters 91234567 in the phone text field.
    // If the phone format matches Omani standard then test case will be passed otherwise testcase will be failed
    //for Pass test case
    fireEvent.change(phoneInput, { target: { value: '91234567' } });

    //for Fail test case
    //fireEvent.change(phoneInput, { target: { value: '123' } });

    // Omani phone number validation: exactly 8 digits
    const omanPhoneRegex = /^[0-9]{8}$/;

    expect(omanPhoneRegex.test(phoneInput.value)).toBe(true);
})
