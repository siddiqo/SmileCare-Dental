import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import smileCareStore from './store/smileCareStore';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Appointments from './pages/Appointments';
import DentistManagement from './pages/admin/DentistManagement';
import PatientManagement from './pages/admin/PatientManagement';
import AppointmentManagement from './pages/admin/AppointmentManagement';
import './App.css';

function App() {
  return (
    <Provider store={smileCareStore}>
      <Router>
      <div className="App">
        <Routes>
          {/* Public Routes with Navigation and Footer */}
          <Route path="/" element={
            <>
              <Navigation />
              <Home />
              <Footer />
            </>
          } />
          <Route path="/services" element={
            <>
              <Navigation />
              <Services />
              <Footer />
            </>
          } />
          <Route path="/contact" element={
            <>
              <Navigation />
              <Contact />
              <Footer />
            </>
          } />
          <Route path="/appointments" element={
            <>
              <Navigation />
              <Appointments />
              <Footer />
            </>
          } />

          {/* Admin Routes without Navigation and Footer */}
          <Route path="/admin/appointments" element={<AppointmentManagement />} />
          <Route path="/admin/dentists" element={<DentistManagement />} />
          <Route path="/admin/patients" element={<PatientManagement />} />
        </Routes>
      </div>
    </Router>
    </Provider>
  );
}

export default App;
