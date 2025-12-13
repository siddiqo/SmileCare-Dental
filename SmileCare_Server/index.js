import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import bcrypt from "bcrypt"

import userModel from "./models/userModel.js"
import dentistModel from "./models/dentistModel.js"
import patientModel from "./models/patientModel.js"
import appointmentModel from "./models/appointmentModel.js"

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())

//Connection to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("✅ SmileCare Database Connected Successfully!")
        console.log("📊 Database:", process.env.MONGODB_URI.split('/')[3].split('?')[0])
    })
    .catch((err) => {
        console.error("❌ Database Connection Error:")
        console.error("Error:", err.message)
        console.error("\n⚠️  Please check:")
        console.error("1. MongoDB Atlas username and password are correct")
        console.error("2. Your IP address is whitelisted in Network Access")
        console.error("3. Database user has proper permissions")
        console.error("\nServer will continue running but database operations will fail.")
    })

// Handle MongoDB connection errors after initial connection
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err)
})

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected')
})

// Start Server
app.listen(process.env.PORT, () => {
    try {
        console.log(`SmileCare Server running on port ${process.env.PORT}`)
    } catch (err) {
        console.log(err)
    }
})

//Register a new user
app.post("/userRegister", async (req, res) => {
    try {
        const userExist = await userModel.findOne({ userEmail: req.body.email })
        if (userExist) {
            res.json({ serverMsg: "User already exists!", flag: false })
        } else {
            const encryptedPassword = await bcrypt.hash(req.body.password, 10)
            const newUser = {
                userName: req.body.fullName,
                userEmail: req.body.email,
                userPassword: encryptedPassword,
                userPhone: req.body.phone || "",
                dateOfBirth: req.body.dateOfBirth,
                gender: req.body.gender,
                role: req.body.role || 'user'
            }
            await userModel.create(newUser)

            // Automatically create a patient record for the new user
            const newPatient = {
                name: req.body.fullName,
                email: req.body.email,
                phone: req.body.phone || "",
                dateOfBirth: req.body.dateOfBirth,
                gender: req.body.gender,
                address: "",
                medicalHistory: ""
            }
            await patientModel.create(newPatient)

            res.json({ serverMsg: "Registration successful!", flag: true })
        }
    } catch (err) {
        console.log("Registration Error:", err)
        res.json({ serverMsg: "Registration failed!", flag: false })
    }
})


//Create Admin User (Run this once to create admin)
app.post("/createAdmin", async (req, res) => {
    try {
        const adminExist = await userModel.findOne({ userEmail: "admin@smilecare.com" })
        if (adminExist) {
            res.json({ serverMsg: "Admin already exists!", flag: false })
        } else {
            const encryptedPassword = await bcrypt.hash("***REMOVED***", 10)
            const adminUser = {
                userName: "Admin User",
                userEmail: "admin@smilecare.com",
                userPassword: encryptedPassword,
                userPhone: "",
                role: "admin"
            }
            await userModel.create(adminUser)
            res.json({ serverMsg: "Admin user created successfully!", flag: true })
        }
    } catch (err) {
        console.log("Create Admin Error:", err)
        res.json({ serverMsg: "Failed to create admin!", flag: false })
    }
})

//Login verification
app.post("/userLogin", async (req, res) => {
    try {
        const userExist = await userModel.findOne({ userEmail: req.body.email })
        if (!userExist) {
            res.json({ serverMsg: "User not found!", loginStatus: false })
        } else {
            const matchPassword = await bcrypt.compare(req.body.password, userExist.userPassword)
            if (!matchPassword) {
                res.json({ serverMsg: "Incorrect password!", loginStatus: false })
            } else {
                res.json({
                    serverMsg: "Welcome to SmileCare!",
                    loginStatus: true,
                    user: {
                        name: userExist.userName,
                        email: userExist.userEmail,
                        role: userExist.role
                    }
                })
            }
        }
    } catch (err) {
        console.log("Login Error:", err)
        res.json({ serverMsg: "Login failed!", loginStatus: false })
    }
})

// ==================== DENTIST MANAGEMENT ROUTES ====================

// Get all dentists
app.get("/dentists", async (req, res) => {
    try {
        const dentists = await dentistModel.find().sort({ createdAt: -1 })
        res.json({ dentists, flag: true })
    } catch (err) {
        console.log("Get Dentists Error:", err)
        res.json({ serverMsg: "Failed to fetch dentists", flag: false })
    }
})

// Get single dentist by ID
app.get("/dentists/:id", async (req, res) => {
    try {
        const dentist = await dentistModel.findById(req.params.id)
        if (!dentist) {
            res.json({ serverMsg: "Dentist not found", flag: false })
        } else {
            res.json({ dentist, flag: true })
        }
    } catch (err) {
        console.log("Get Dentist Error:", err)
        res.json({ serverMsg: "Failed to fetch dentist", flag: false })
    }
})

// Add new dentist
app.post("/dentists", async (req, res) => {
    try {
        const dentistExist = await dentistModel.findOne({ email: req.body.email })
        if (dentistExist) {
            res.json({ serverMsg: "Dentist with this email already exists!", flag: false })
        } else {
            const newDentist = {
                name: req.body.name,
                email: req.body.email,
                specialty: req.body.specialty,
                phone: req.body.phone || "",
                image: req.body.image || "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400"
            }
            await dentistModel.create(newDentist)
            res.json({ serverMsg: "Dentist added successfully!", flag: true })
        }
    } catch (err) {
        console.log("Add Dentist Error:", err)
        res.json({ serverMsg: "Failed to add dentist!", flag: false })
    }
})

// Update dentist
app.put("/dentists/:id", async (req, res) => {
    try {
        const dentist = await dentistModel.findById(req.params.id)
        if (!dentist) {
            res.json({ serverMsg: "Dentist not found", flag: false })
        } else {
            const updatedDentist = await dentistModel.findByIdAndUpdate(
                req.params.id,
                {
                    name: req.body.name,
                    email: req.body.email,
                    specialty: req.body.specialty,
                    phone: req.body.phone,
                    image: req.body.image
                },
                { new: true }
            )
            res.json({ serverMsg: "Dentist updated successfully!", dentist: updatedDentist, flag: true })
        }
    } catch (err) {
        console.log("Update Dentist Error:", err)
        res.json({ serverMsg: "Failed to update dentist!", flag: false })
    }
})

// Delete dentist
app.delete("/dentists/:id", async (req, res) => {
    try {
        const dentist = await dentistModel.findById(req.params.id)
        if (!dentist) {
            res.json({ serverMsg: "Dentist not found", flag: false })
        } else {
            await dentistModel.findByIdAndDelete(req.params.id)
            res.json({ serverMsg: "Dentist deleted successfully!", flag: true })
        }
    } catch (err) {
        console.log("Delete Dentist Error:", err)
        res.json({ serverMsg: "Failed to delete dentist!", flag: false })
    }
})

// ==================== PATIENT MANAGEMENT ROUTES ====================

// Get all patients
app.get("/patients", async (req, res) => {
    try {
        const patients = await patientModel.find().sort({ createdAt: -1 })
        res.json({ patients, flag: true })
    } catch (err) {
        console.log("Get Patients Error:", err)
        res.json({ serverMsg: "Failed to fetch patients", flag: false })
    }
})

// Get single patient by ID
app.get("/patients/:id", async (req, res) => {
    try {
        const patient = await patientModel.findById(req.params.id)
        if (!patient) {
            res.json({ serverMsg: "Patient not found", flag: false })
        } else {
            res.json({ patient, flag: true })
        }
    } catch (err) {
        console.log("Get Patient Error:", err)
        res.json({ serverMsg: "Failed to fetch patient", flag: false })
    }
})

// Add new patient
app.post("/patients", async (req, res) => {
    try {
        const patientExist = await patientModel.findOne({ email: req.body.email })
        if (patientExist) {
            res.json({ serverMsg: "Patient with this email already exists!", flag: false })
        } else {
            const newPatient = {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                dateOfBirth: req.body.dateOfBirth,
                address: req.body.address || "",
                medicalHistory: req.body.medicalHistory || ""
            }
            await patientModel.create(newPatient)
            res.json({ serverMsg: "Patient added successfully!", flag: true })
        }
    } catch (err) {
        console.log("Add Patient Error:", err)
        res.json({ serverMsg: "Failed to add patient!", flag: false })
    }
})

// Update patient
app.put("/patients/:id", async (req, res) => {
    try {
        const patient = await patientModel.findById(req.params.id)
        if (!patient) {
            res.json({ serverMsg: "Patient not found", flag: false })
        } else {
            const updatedPatient = await patientModel.findByIdAndUpdate(
                req.params.id,
                {
                    name: req.body.name,
                    email: req.body.email,
                    phone: req.body.phone,
                    dateOfBirth: req.body.dateOfBirth,
                    address: req.body.address,
                    medicalHistory: req.body.medicalHistory
                },
                { new: true }
            )
            res.json({ serverMsg: "Patient updated successfully!", patient: updatedPatient, flag: true })
        }
    } catch (err) {
        console.log("Update Patient Error:", err)
        res.json({ serverMsg: "Failed to update patient!", flag: false })
    }
})

// Delete patient
app.delete("/patients/:id", async (req, res) => {
    try {
        const patient = await patientModel.findById(req.params.id)
        if (!patient) {
            res.json({ serverMsg: "Patient not found", flag: false })
        } else {
            // Delete the patient record
            await patientModel.findByIdAndDelete(req.params.id)

            // Also delete the associated user account if it exists
            await userModel.findOneAndDelete({ userEmail: patient.email })

            // Delete all appointments associated with this patient
            await appointmentModel.deleteMany({ patientId: req.params.id })

            res.json({ serverMsg: "Patient and associated data deleted successfully!", flag: true })
        }
    } catch (err) {
        console.log("Delete Patient Error:", err)
        res.json({ serverMsg: "Failed to delete patient!", flag: false })
    }
})

// ==================== APPOINTMENT MANAGEMENT ROUTES ====================

// Get all appointments
app.get("/appointments", async (req, res) => {
    try {
        const appointments = await appointmentModel.find().sort({ createdAt: -1 })
        res.json({ appointments, flag: true })
    } catch (err) {
        console.log("Get Appointments Error:", err)
        res.json({ serverMsg: "Failed to fetch appointments", flag: false })
    }
})

// Get single appointment by ID
app.get("/appointments/:id", async (req, res) => {
    try {
        const appointment = await appointmentModel.findById(req.params.id)
        if (!appointment) {
            res.json({ serverMsg: "Appointment not found", flag: false })
        } else {
            res.json({ appointment, flag: true })
        }
    } catch (err) {
        console.log("Get Appointment Error:", err)
        res.json({ serverMsg: "Failed to fetch appointment", flag: false })
    }
})

// Add new appointment
app.post("/appointments", async (req, res) => {
    try {
        // Check if the dentist is already booked at this date and time
        const conflictingAppointment = await appointmentModel.findOne({
            dentistId: req.body.dentistId,
            date: req.body.date,
            time: req.body.time,
            status: { $ne: 'Cancelled' } // Ignore cancelled appointments
        })

        if (conflictingAppointment) {
            return res.json({
                serverMsg: "This time slot is already booked for this dentist. Please select a different time.",
                flag: false
            })
        }

        const newAppointment = {
            patientName: req.body.patientName,
            patientId: req.body.patientId,
            dentistName: req.body.dentistName,
            dentistId: req.body.dentistId,
            date: req.body.date,
            time: req.body.time,
            service: req.body.service,
            status: req.body.status || 'Pending',
            notes: req.body.notes || "",
            lat: req.body.lat || null,
            lon: req.body.lon || null
        }
        await appointmentModel.create(newAppointment)
        res.json({ serverMsg: "Appointment created successfully!", flag: true })
    } catch (err) {
        console.log("Add Appointment Error:", err)
        res.json({ serverMsg: "Failed to create appointment!", flag: false })
    }
})

// Update appointment
app.put("/appointments/:id", async (req, res) => {
    try {
        const appointment = await appointmentModel.findById(req.params.id)
        if (!appointment) {
            res.json({ serverMsg: "Appointment not found", flag: false })
        } else {
            // Check if the new time slot conflicts with another appointment
            const conflictingAppointment = await appointmentModel.findOne({
                _id: { $ne: req.params.id }, // Exclude current appointment
                dentistId: req.body.dentistId,
                date: req.body.date,
                time: req.body.time,
                status: { $ne: 'Cancelled' }
            })

            if (conflictingAppointment) {
                return res.json({
                    serverMsg: "This time slot is already booked for this dentist. Please select a different time.",
                    flag: false
                })
            }

            const updatedAppointment = await appointmentModel.findByIdAndUpdate(
                req.params.id,
                {
                    patientName: req.body.patientName,
                    patientId: req.body.patientId,
                    dentistName: req.body.dentistName,
                    dentistId: req.body.dentistId,
                    date: req.body.date,
                    time: req.body.time,
                    service: req.body.service,
                    status: req.body.status,
                    notes: req.body.notes,
                    lat: req.body.lat || null,
                    lon: req.body.lon || null
                },
                { new: true }
            )
            res.json({ serverMsg: "Appointment updated successfully!", appointment: updatedAppointment, flag: true })
        }
    } catch (err) {
        console.log("Update Appointment Error:", err)
        res.json({ serverMsg: "Failed to update appointment!", flag: false })
    }
})

// Delete appointment
app.delete("/appointments/:id", async (req, res) => {
    try {
        const appointment = await appointmentModel.findById(req.params.id)
        if (!appointment) {
            res.json({ serverMsg: "Appointment not found", flag: false })
        } else {
            await appointmentModel.findByIdAndDelete(req.params.id)
            res.json({ serverMsg: "Appointment deleted successfully!", flag: true })
        }
    } catch (err) {
        console.log("Delete Appointment Error:", err)
        res.json({ serverMsg: "Failed to delete appointment!", flag: false })
    }
})
