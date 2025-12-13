import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginThunk, registerUserThunk } from '../slices/userSlice'
import { Modal, ModalBody, Form, FormGroup, Label, Input, Button, Nav, NavItem, NavLink, TabContent, TabPane, Alert } from 'reactstrap'
import { FaTooth, FaEnvelope, FaLock, FaUser, FaPhone, FaCalendar, FaMapMarkerAlt } from 'react-icons/fa'

export default function AuthModal({ isOpen, toggle, onLoginSuccess }) {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const msg = useSelector((state) => state.user.msg)
    const loginStatus = useSelector((state) => state.user.loginStatus)
    const loading = useSelector((state) => state.user.loading)

    const [activeTab, setActiveTab] = useState('login')
    const [loginEmail, setLoginEmail] = useState('')
    const [loginPassword, setLoginPassword] = useState('')
    const [registerName, setRegisterName] = useState('')
    const [registerEmail, setRegisterEmail] = useState('')
    const [registerPhone, setRegisterPhone] = useState('')
    const [registerDOB, setRegisterDOB] = useState('')
    const [registerGender, setRegisterGender] = useState('')
    const [registerPassword, setRegisterPassword] = useState('')

    const toggleTab = (tab) => {
        if (activeTab !== tab) setActiveTab(tab)
    }

    const handleLogin = (e) => {
        try {
            e.preventDefault()
            const loginData = {
                email: loginEmail,
                password: loginPassword
            }
            dispatch(loginThunk(loginData))
        } catch (err) {
            console.log(err)
        }
    }

    const handleRegister = (e) => {
        try {
            e.preventDefault()
            const regData = {
                fullName: registerName,
                email: registerEmail,
                phone: registerPhone,
                dateOfBirth: registerDOB,
                gender: registerGender,
                password: registerPassword
            }
            dispatch(registerUserThunk(regData))
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        if (loginStatus) {
            const user = JSON.parse(localStorage.getItem('smileCareUser'))
            if (user && user.role === 'admin') {
                navigate('/admin/appointments')
                toggle()
            } else {
                onLoginSuccess(user)
                toggle()
            }
        }
    }, [loginStatus])

    return (
        <Modal isOpen={isOpen} toggle={toggle} centered size="md" className="auth-modal">
            <button className="auth-modal-close" onClick={toggle}>×</button>
            <ModalBody className="p-0">
                <div className="auth-modal-header">
                    <div className="auth-logo-wrapper">
                        <FaTooth className="auth-logo-icon" />
                    </div>
                    <h4 className="auth-modal-title">Welcome to SmileCare</h4>
                    <p className="auth-modal-subtitle">Your dental health is our priority</p>
                </div>

                <div className="auth-tabs-wrapper">
                    <Nav tabs className="auth-tabs">
                        <NavItem className="flex-fill">
                            <NavLink className={activeTab === 'login' ? 'active' : ''} onClick={() => toggleTab('login')}>
                                Login
                            </NavLink>
                        </NavItem>
                        <NavItem className="flex-fill">
                            <NavLink className={activeTab === 'register' ? 'active' : ''} onClick={() => toggleTab('register')}>
                                Register
                            </NavLink>
                        </NavItem>
                    </Nav>

                    {msg && (
                        <Alert color={loginStatus ? 'success' : 'danger'} className="mx-3 mt-3 mb-0">
                            {msg}
                        </Alert>
                    )}

                    <TabContent activeTab={activeTab} className="auth-tab-content">
                        {/* Login Tab */}
                        <TabPane tabId="login">
                            <Form onSubmit={handleLogin} className="auth-form">
                                <FormGroup>
                                    <Label for="loginEmail">Email Address</Label>
                                    <div className="input-with-icon">
                                        <FaEnvelope className="input-icon" />
                                        <Input
                                            type="email"
                                            name="email"
                                            id="loginEmail"
                                            data-testid="login-email"
                                            placeholder="your.email@example.com"
                                            value={loginEmail}
                                            onChange={(e) => setLoginEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="loginPassword">Password</Label>
                                    <div className="input-with-icon">
                                        <FaLock className="input-icon" />
                                        <Input
                                            type="password"
                                            name="password"
                                            id="loginPassword"
                                            data-testid="login-password"
                                            placeholder="••••••••"
                                            value={loginPassword}
                                            onChange={(e) => setLoginPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </FormGroup>
                                <Button type="submit" color="info" className="auth-submit-btn w-100" disabled={loading}>
                                    {loading ? 'Signing In...' : 'Sign In'}
                                </Button>
                            </Form>
                        </TabPane>

                        {/* Register Tab */}
                        <TabPane tabId="register">
                            <Form onSubmit={handleRegister} className="auth-form">
                                <FormGroup>
                                    <Label for="registerName">Full Name</Label>
                                    <div className="input-with-icon">
                                        <FaUser className="input-icon" />
                                        <Input
                                            type="text"
                                            name="fullName"
                                            id="registerName"
                                            placeholder="Ahmed Al-Rashid"
                                            value={registerName}
                                            onChange={(e) => setRegisterName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="registerEmail">Email Address</Label>
                                    <div className="input-with-icon">
                                        <FaEnvelope className="input-icon" />
                                        <Input
                                            type="email"
                                            name="email"
                                            id="registerEmail"
                                            data-testid="register-email"
                                            placeholder="your.email@example.com"
                                            value={registerEmail}
                                            onChange={(e) => setRegisterEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="registerPhone">Phone Number</Label>
                                    <div className="input-with-icon">
                                        <FaPhone className="input-icon" />
                                        <Input
                                            type="tel"
                                            name="phone"
                                            id="registerPhone"
                                            data-testid="register-phone"
                                            placeholder="OM +968- 9XXXXXXX"
                                            value={registerPhone}
                                            onChange={(e) => setRegisterPhone(e.target.value)}
                                            required
                                        />
                                    </div>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="registerDOB">Date of Birth</Label>
                                    <div className="input-with-icon">
                                        <FaCalendar className="input-icon" />
                                        <Input
                                            type="date"
                                            name="dateOfBirth"
                                            id="registerDOB"
                                            value={registerDOB}
                                            onChange={(e) => setRegisterDOB(e.target.value)}
                                            required
                                        />
                                    </div>
                                </FormGroup>
                                <FormGroup>
                                    <Label>Gender</Label>
                                    <div className="d-flex gap-3 mt-2">
                                        <div className="form-check">
                                            <Input
                                                type="radio"
                                                name="gender"
                                                id="genderMale"
                                                value="male"
                                                checked={registerGender === 'male'}
                                                onChange={(e) => setRegisterGender(e.target.value)}
                                                required
                                                className="form-check-input"
                                            />
                                            <Label className="form-check-label" for="genderMale">Male</Label>
                                        </div>
                                        <div className="form-check">
                                            <Input
                                                type="radio"
                                                name="gender"
                                                id="genderFemale"
                                                value="female"
                                                checked={registerGender === 'female'}
                                                onChange={(e) => setRegisterGender(e.target.value)}
                                                required
                                                className="form-check-input"
                                            />
                                            <Label className="form-check-label" for="genderFemale">Female</Label>
                                        </div>
                                    </div>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="registerPassword">Password</Label>
                                    <div className="input-with-icon">
                                        <FaLock className="input-icon" />
                                        <Input
                                            type="password"
                                            name="password"
                                            id="registerPassword"
                                            data-testid="register-password"
                                            placeholder="••••••••"
                                            value={registerPassword}
                                            onChange={(e) => setRegisterPassword(e.target.value)}
                                            required
                                            minLength="6"
                                        />
                                    </div>
                                    <small className="text-muted">At least 6 characters</small>
                                </FormGroup>
                                <Button type="submit" color="info" className="auth-submit-btn w-100" disabled={loading}>
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                </Button>
                            </Form>
                        </TabPane>
                    </TabContent>
                </div>

                <div className="auth-modal-footer">
                    <FaMapMarkerAlt className="me-1" style={{ color: '#dc3545' }} />
                    <small>Based in Muscat, Oman 🇴🇲</small>
                </div>
            </ModalBody>
        </Modal>
    )
}
