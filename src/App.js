import React, { useState, useEffect } from 'react';
import { Calendar, Users, Building2, Pill, FileText, Plus, Search, Edit, Trash2, Eye, X, Save } from 'lucide-react';

const MedipolHospitalSystem = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // State for all data
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [medications, setMedications] = useState([]);

  // Form states - Individual states to prevent re-render issues
  const [appointmentPatient, setAppointmentPatient] = useState('');
  const [appointmentDoctor, setAppointmentDoctor] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [appointmentStatus, setAppointmentStatus] = useState('Scheduled');

  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientAddress, setPatientAddress] = useState('');

  const [medicationName, setMedicationName] = useState('');
  const [medicationQuantity, setMedicationQuantity] = useState('');
  const [medicationType, setMedicationType] = useState('');
  const [medicationDescription, setMedicationDescription] = useState('');

  // Mock API functions
  const mockAPI = {
    getAppointments: async () => {
      return [
        { id: 1, patient: 'John Smith', doctor: 'Dr. Johnson', date: '2025-05-30', time: '10:00', status: 'Scheduled' },
        { id: 2, patient: 'Emily Davis', doctor: 'Dr. Wilson', date: '2025-05-30', time: '14:30', status: 'Completed' },
        { id: 3, patient: 'Michael Brown', doctor: 'Dr. Anderson', date: '2025-05-31', time: '09:15', status: 'Scheduled' }
      ];
    },
    createAppointment: async (data) => {
      const newAppointment = { id: Date.now(), ...data };
      return newAppointment;
    },
    updateAppointment: async (id, data) => {
      return { id, ...data };
    },
    deleteAppointment: async (id) => {
      return { success: true, id };
    },
    getPatients: async () => {
      return [
        { id: 1, name: 'John Smith', age: 45, phone: '+90 532 123 4567', address: 'Istanbul, Turkey', lastVisit: '2025-05-25' },
        { id: 2, name: 'Emily Davis', age: 32, phone: '+90 532 234 5678', address: 'Ankara, Turkey', lastVisit: '2025-05-28' },
        { id: 3, name: 'Michael Brown', age: 28, phone: '+90 532 345 6789', address: 'Izmir, Turkey', lastVisit: '2025-05-29' }
      ];
    },
    createPatient: async (data) => {
      const newPatient = { 
        id: Date.now(), 
        ...data, 
        lastVisit: new Date().toISOString().split('T')[0] 
      };
      return newPatient;
    },
    updatePatient: async (id, data) => {
      return { id, ...data };
    },
    deletePatient: async (id) => {
      return { success: true, id };
    },
    getMedications: async () => {
      return [
        { id: 1, name: 'Aspirin', quantity: 500, type: 'Tablet', description: 'Pain reliever and anti-inflammatory' },
        { id: 2, name: 'Amoxicillin', quantity: 200, type: 'Capsule', description: 'Antibiotic for bacterial infections' },
        { id: 3, name: 'Lisinopril', quantity: 150, type: 'Tablet', description: 'Blood pressure medication' }
      ];
    },
    createMedication: async (data) => {
      const newMedication = { id: Date.now(), ...data };
      return newMedication;
    },
    updateMedication: async (id, data) => {
      return { id, ...data };
    },
    deleteMedication: async (id) => {
      return { success: true, id };
    },
    getDoctors: async () => {
      return [
        { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Cardiology', department: 'Cardiovascular', experience: '15 years', phone: '+90 532 111 2233' },
        { id: 2, name: 'Dr. Michael Wilson', specialty: 'Neurology', department: 'Neuroscience', experience: '12 years', phone: '+90 532 444 5566' },
        { id: 3, name: 'Dr. Emily Anderson', specialty: 'Pediatrics', department: 'Children Health', experience: '8 years', phone: '+90 532 777 8899' }
      ];
    },
    getDepartments: async () => {
      return [
        { name: 'Cardiovascular', capacity: 50, currentPatients: 32, head: 'Dr. Johnson' },
        { name: 'Neuroscience', capacity: 30, currentPatients: 18, head: 'Dr. Wilson' },
        { name: 'Children Health', capacity: 40, currentPatients: 25, head: 'Dr. Anderson' }
      ];
    }
  };

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [appointmentsData, patientsData, medicationsData, doctorsData, departmentsData] = await Promise.all([
          mockAPI.getAppointments(),
          mockAPI.getPatients(),
          mockAPI.getMedications(),
          mockAPI.getDoctors(),
          mockAPI.getDepartments()
        ]);
        
        setAppointments(appointmentsData);
        setPatients(patientsData);
        setMedications(medicationsData);
        setDoctors(doctorsData);
        setDepartments(departmentsData);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    loadData();
  }, []);

  // CRUD Operations
  const handleCreate = async (type, data) => {
    try {
      let newItem;
      switch (type) {
        case 'appointment':
          newItem = await mockAPI.createAppointment(data);
          setAppointments(prev => [...prev, newItem]);
          break;
        case 'patient':
          newItem = await mockAPI.createPatient(data);
          setPatients(prev => [...prev, newItem]);
          break;
        case 'medication':
          newItem = await mockAPI.createMedication(data);
          setMedications(prev => [...prev, newItem]);
          break;
        default:
          break;
      }
      setShowModal(false);
      resetForms();
    } catch (error) {
      console.error('Failed to create:', error);
    }
  };

  const handleUpdate = async (type, id, data) => {
    try {
      let updatedItem;
      switch (type) {
        case 'appointment':
          updatedItem = await mockAPI.updateAppointment(id, data);
          setAppointments(prev => prev.map(item => item.id === id ? updatedItem : item));
          break;
        case 'patient':
          updatedItem = await mockAPI.updatePatient(id, data);
          setPatients(prev => prev.map(item => item.id === id ? updatedItem : item));
          break;
        case 'medication':
          updatedItem = await mockAPI.updateMedication(id, data);
          setMedications(prev => prev.map(item => item.id === id ? updatedItem : item));
          break;
        default:
          break;
      }
      setShowModal(false);
      setEditingItem(null);
      resetForms();
    } catch (error) {
      console.error('Failed to update:', error);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      switch (type) {
        case 'appointment':
          await mockAPI.deleteAppointment(id);
          setAppointments(prev => prev.filter(item => item.id !== id));
          break;
        case 'patient':
          await mockAPI.deletePatient(id);
          setPatients(prev => prev.filter(item => item.id !== id));
          break;
        case 'medication':
          await mockAPI.deleteMedication(id);
          setMedications(prev => prev.filter(item => item.id !== id));
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const resetForms = () => {
    // Reset appointment form
    setAppointmentPatient('');
    setAppointmentDoctor('');
    setAppointmentDate('');
    setAppointmentTime('');
    setAppointmentStatus('Scheduled');
    
    // Reset patient form
    setPatientName('');
    setPatientAge('');
    setPatientPhone('');
    setPatientAddress('');
    
    // Reset medication form
    setMedicationName('');
    setMedicationQuantity('');
    setMedicationType('');
    setMedicationDescription('');
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    
    if (item) {
      switch (type) {
        case 'appointment':
          setAppointmentPatient(item.patient || '');
          setAppointmentDoctor(item.doctor || '');
          setAppointmentDate(item.date || '');
          setAppointmentTime(item.time || '');
          setAppointmentStatus(item.status || 'Scheduled');
          break;
        case 'patient':
          setPatientName(item.name || '');
          setPatientAge(item.age || '');
          setPatientPhone(item.phone || '');
          setPatientAddress(item.address || '');
          break;
        case 'medication':
          setMedicationName(item.name || '');
          setMedicationQuantity(item.quantity || '');
          setMedicationType(item.type || '');
          setMedicationDescription(item.description || '');
          break;
        default:
          break;
      }
    } else {
      resetForms();
    }
    
    setShowModal(true);
  };

  const Logo = () => (
    <div className="flex items-center space-x-3">
      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
        <div className="w-8 h-8 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white rounded-full opacity-80"></div>
            <div className="absolute w-4 h-4 bg-white rounded-full"></div>
          </div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-3 bg-white rounded-t"></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-3 bg-white rounded-b"></div>
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-3 h-2 bg-white rounded-l"></div>
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-2 bg-white rounded-r"></div>
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-blue-800">MEDIPOL</h1>
        <p className="text-sm text-gray-600">Hospital Management System</p>
      </div>
    </div>
  );

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
    </div>
  );

  const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );

  const ActionButton = ({ icon: Icon, label, variant = 'primary', onClick, disabled = false }) => {
    const variants = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
      danger: 'bg-red-600 hover:bg-red-700 text-white'
    };
    
    return (
      <button 
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </button>
    );
  };

  const Modal = ({ title, children }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button
            onClick={() => {
              setShowModal(false);
              setEditingItem(null);
              resetForms();
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    let formData;
    switch (modalType) {
      case 'appointment':
        formData = {
          patient: appointmentPatient,
          doctor: appointmentDoctor,
          date: appointmentDate,
          time: appointmentTime,
          status: appointmentStatus
        };
        break;
      case 'patient':
        formData = {
          name: patientName,
          age: patientAge,
          phone: patientPhone,
          address: patientAddress
        };
        break;
      case 'medication':
        formData = {
          name: medicationName,
          quantity: medicationQuantity,
          type: medicationType,
          description: medicationDescription
        };
        break;
      default:
        return;
    }

    if (editingItem) {
      handleUpdate(modalType, editingItem.id, formData);
    } else {
      handleCreate(modalType, formData);
    }
  };

  const HomePage = () => (
    <div className="space-y-8">
      {/* About Section */}
      <section className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">About MEDIPOL Hospital Database System</h2>
        <p className="text-gray-600 leading-relaxed">
          Welcome to the MEDIPOL Hospital Management System - an optimized database solution designed to streamline 
          hospital operations and enhance patient care. Our comprehensive system manages patient records, doctor schedules, 
          appointments, treatments, and departmental resources with efficiency and security at its core.
        </p>
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-800">Patient Management</h3>
            <p className="text-sm text-gray-600">Comprehensive patient records and history</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-800">Appointment Scheduling</h3>
            <p className="text-sm text-gray-600">Efficient booking and scheduling system</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold text-gray-800">Treatment Tracking</h3>
            <p className="text-sm text-gray-600">Complete treatment and medication records</p>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard title="Total Patients" value={patients.length.toString()} icon={Users} color="border-blue-500" />
        <StatCard title="Active Doctors" value={doctors.length.toString()} icon={Users} color="border-green-500" />
        <StatCard title="Departments" value={departments.length.toString()} icon={Building2} color="border-purple-500" />
        <StatCard title="Today's Appointments" value={appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]).length.toString()} icon={Calendar} color="border-orange-500" />
      </div>

      {/* Quick Actions */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => openModal('appointment')}
            className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left"
          >
            <Calendar className="w-6 h-6 text-blue-600 mb-2" />
            <h4 className="font-medium text-gray-800">Schedule Appointment</h4>
            <p className="text-sm text-gray-600">Book new patient appointment</p>
          </button>
          <button 
            onClick={() => openModal('patient')}
            className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left"
          >
            <Users className="w-6 h-6 text-green-600 mb-2" />
            <h4 className="font-medium text-gray-800">Add Patient</h4>
            <p className="text-sm text-gray-600">Register new patient</p>
          </button>
          <button 
            onClick={() => setActiveTab('doctors')}
            className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left"
          >
            <Users className="w-6 h-6 text-purple-600 mb-2" />
            <h4 className="font-medium text-gray-800">Doctor Schedule</h4>
            <p className="text-sm text-gray-600">View doctor availability</p>
          </button>
          <button 
            onClick={() => openModal('medication')}
            className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-left"
          >
            <Pill className="w-6 h-6 text-orange-600 mb-2" />
            <h4 className="font-medium text-gray-800">Add Medication</h4>
            <p className="text-sm text-gray-600">Manage medication inventory</p>
          </button>
        </div>
      </section>
    </div>
  );

  const AppointmentsPage = () => {
    const filteredAppointments = appointments.filter(apt =>
      apt.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.doctor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Appointments ({appointments.length})</h2>
          <div className="flex space-x-3">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <ActionButton icon={Plus} label="New Appointment" onClick={() => openModal('appointment')} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appointment.patient}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.doctor}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.date} at {appointment.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      appointment.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                      appointment.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <ActionButton icon={Edit} label="Edit" variant="secondary" onClick={() => openModal('appointment', appointment)} />
                    <ActionButton icon={Trash2} label="Cancel" variant="danger" onClick={() => handleDelete('appointment', appointment.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const PatientsPage = () => {
    const filteredPatients = patients.filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm)
    );

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Patients ({patients.length})</h2>
          <div className="flex space-x-3">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <ActionButton icon={Plus} label="Add Patient" onClick={() => openModal('patient')} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patient.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.age}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.lastVisit}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <ActionButton icon={Edit} label="Edit" variant="secondary" onClick={() => openModal('patient', patient)} />
                    <ActionButton icon={Calendar} label="Book" variant="primary" onClick={() => openModal('appointment', { patient: patient.name })} />
                    <ActionButton icon={Trash2} label="Delete" variant="danger" onClick={() => handleDelete('patient', patient.id)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const MedicationsPage = () => {
    const filteredMedications = medications.filter(med =>
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Medications ({medications.length})</h2>
          <div className="flex space-x-3">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search medications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <ActionButton icon={Plus} label="Add Medication" onClick={() => openModal('medication')} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedications.map((medication) => (
            <div key={medication.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Pill className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{medication.name}</h3>
                    <p className="text-sm text-gray-600">{medication.type}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  medication.quantity > 100 ? 'bg-green-100 text-green-800' :
                  medication.quantity > 50 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {medication.quantity} units
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">{medication.description}</p>
              <div className="flex space-x-2">
                <ActionButton icon={Edit} label="Edit" variant="secondary" onClick={() => openModal('medication', medication)} />
                <ActionButton icon={Trash2} label="Delete" variant="danger" onClick={() => handleDelete('medication', medication.id)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const DoctorsPage = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Doctors ({doctors.length})</h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{doctor.name}</h3>
                <p className="text-sm text-gray-600">{doctor.specialty}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Department:</span> {doctor.department}</p>
              <p><span className="font-medium">Experience:</span> {doctor.experience}</p>
              <p><span className="font-medium">Phone:</span> {doctor.phone}</p>
            </div>
            <div className="mt-4 flex space-x-2">
              <ActionButton 
                icon={Eye} 
                label="View" 
                variant="secondary" 
                onClick={() => alert(`Viewing details for ${doctor.name}\n\nSpecialty: ${doctor.specialty}\nDepartment: ${doctor.department}\nExperience: ${doctor.experience}\nPhone: ${doctor.phone}`)}
              />
              <ActionButton 
                icon={Calendar} 
                label="Schedule" 
                variant="primary" 
                onClick={() => {
                  setActiveTab('appointments');
                  openModal('appointment', { doctor: doctor.name });
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const DepartmentsPage = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Departments ({departments.length})</h2>
        <ActionButton icon={Plus} label="Add Department" onClick={() => alert('Add Department functionality - coming soon!')} />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div key={dept.name} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">{dept.name}</h3>
              <Building2 className="w-6 h-6 text-gray-400" />
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Capacity</span>
                  <span>{dept.currentPatients}/{dept.capacity}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{width: `${(dept.currentPatients / dept.capacity) * 100}%`}}
                  ></div>
                </div>
              </div>
              <p className="text-sm"><span className="font-medium">Head:</span> {dept.head}</p>
            </div>
            <div className="mt-4 flex space-x-2">
              <ActionButton 
                icon={Eye} 
                label="View" 
                variant="secondary" 
                onClick={() => alert(`Department: ${dept.name}\n\nCapacity: ${dept.currentPatients}/${dept.capacity} patients\nHead: ${dept.head}\nOccupancy: ${Math.round((dept.currentPatients / dept.capacity) * 100)}%`)}
              />
              <ActionButton 
                icon={Edit} 
                label="Manage" 
                variant="secondary" 
                onClick={() => alert(`Managing ${dept.name} Department\n\nThis would open department management interface:\n- Update capacity\n- Assign staff\n- View patient list\n- Generate reports`)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ReportsPage = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Reports</h2>
        <ActionButton 
          icon={Plus} 
          label="Generate Report" 
          onClick={() => {
            const reportData = {
              totalPatients: patients.length,
              totalDoctors: doctors.length,
              totalAppointments: appointments.length,
              totalMedications: medications.length,
              todayAppointments: appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]).length,
              completedAppointments: appointments.filter(apt => apt.status === 'Completed').length,
              scheduledAppointments: appointments.filter(apt => apt.status === 'Scheduled').length
            };
            
            alert(`📊 MEDIPOL Hospital System Report\n\n` +
                  `📅 Generated: ${new Date().toLocaleDateString()}\n\n` +
                  `👥 Total Patients: ${reportData.totalPatients}\n` +
                  `👨‍⚕️ Active Doctors: ${reportData.totalDoctors}\n` +
                  `📋 Total Appointments: ${reportData.totalAppointments}\n` +
                  `💊 Medications in Stock: ${reportData.totalMedications}\n\n` +
                  `📈 Today's Statistics:\n` +
                  `• Today's Appointments: ${reportData.todayAppointments}\n` +
                  `• Completed: ${reportData.completedAppointments}\n` +
                  `• Scheduled: ${reportData.scheduledAppointments}\n\n` +
                  `🏥 System Status: Operational\n` +
                  `📊 Report Type: Executive Summary`);
          }}
        />
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Patient Report</h3>
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-sm text-gray-600 mb-4">Comprehensive patient statistics and demographics</p>
          <ActionButton 
            icon={FileText} 
            label="Generate" 
            variant="secondary" 
            onClick={() => alert(`👥 Patient Report Generated!\n\nTotal Patients: ${patients.length}\nAverage Age: ${Math.round(patients.reduce((sum, p) => sum + parseInt(p.age), 0) / patients.length)} years\nMost Recent Visit: ${patients.sort((a, b) => new Date(b.lastVisit) - new Date(a.lastVisit))[0]?.lastVisit}`)}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Appointment Report</h3>
            <Calendar className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-sm text-gray-600 mb-4">Appointment analytics and scheduling insights</p>
          <ActionButton 
            icon={FileText} 
            label="Generate" 
            variant="secondary" 
            onClick={() => {
              const completed = appointments.filter(apt => apt.status === 'Completed').length;
              const scheduled = appointments.filter(apt => apt.status === 'Scheduled').length;
              const cancelled = appointments.filter(apt => apt.status === 'Cancelled').length;
              alert(`📅 Appointment Report\n\n✅ Completed: ${completed}\n📋 Scheduled: ${scheduled}\n❌ Cancelled: ${cancelled}\n\nCompletion Rate: ${Math.round((completed / appointments.length) * 100)}%`);
            }}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Department Report</h3>
            <Building2 className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-sm text-gray-600 mb-4">Department capacity and utilization metrics</p>
          <ActionButton 
            icon={FileText} 
            label="Generate" 
            variant="secondary" 
            onClick={() => {
              const totalCapacity = departments.reduce((sum, dept) => sum + dept.capacity, 0);
              const totalOccupied = departments.reduce((sum, dept) => sum + dept.currentPatients, 0);
              const utilizationRate = Math.round((totalOccupied / totalCapacity) * 100);
              alert(`🏥 Department Report\n\nTotal Capacity: ${totalCapacity} beds\nCurrently Occupied: ${totalOccupied} beds\nUtilization Rate: ${utilizationRate}%\n\nDepartment Breakdown:\n${departments.map(d => `• ${d.name}: ${d.currentPatients}/${d.capacity} (${Math.round((d.currentPatients/d.capacity)*100)}%)`).join('\n')}`);
            }}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Medication Report</h3>
            <Pill className="w-6 h-6 text-orange-600" />
          </div>
          <p className="text-sm text-gray-600 mb-4">Medication inventory and stock levels</p>
          <ActionButton 
            icon={FileText} 
            label="Generate" 
            variant="secondary" 
            onClick={() => {
              const lowStock = medications.filter(med => med.quantity < 50);
              const totalMeds = medications.reduce((sum, med) => sum + parseInt(med.quantity), 0);
              alert(`💊 Medication Report\n\nTotal Medications: ${medications.length} types\nTotal Units: ${totalMeds}\n\n⚠️ Low Stock Alerts (< 50 units):\n${lowStock.length > 0 ? lowStock.map(med => `• ${med.name}: ${med.quantity} units`).join('\n') : 'No low stock items'}\n\n📊 Stock Status:\n${medications.map(med => `• ${med.name}: ${med.quantity} ${med.type}s`).join('\n')}`);
            }}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Doctor Report</h3>
            <Users className="w-6 h-6 text-red-600" />
          </div>
          <p className="text-sm text-gray-600 mb-4">Doctor workload and specialization analysis</p>
          <ActionButton 
            icon={FileText} 
            label="Generate" 
            variant="secondary" 
            onClick={() => {
              const specialties = doctors.reduce((acc, doc) => {
                acc[doc.specialty] = (acc[doc.specialty] || 0) + 1;
                return acc;
              }, {});
              alert(`👨‍⚕️ Doctor Report\n\nTotal Doctors: ${doctors.length}\n\nSpecialties:\n${Object.entries(specialties).map(([specialty, count]) => `• ${specialty}: ${count} doctor(s)`).join('\n')}\n\nDepartments:\n${doctors.map(doc => `• ${doc.name} - ${doc.department}`).join('\n')}`);
            }}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">System Report</h3>
            <FileText className="w-6 h-6 text-gray-600" />
          </div>
          <p className="text-sm text-gray-600 mb-4">Overall system health and performance metrics</p>
          <ActionButton 
            icon={FileText} 
            label="Generate" 
            variant="secondary" 
            onClick={() => alert(`🖥️ System Health Report\n\n✅ Database Status: Online\n✅ All Modules: Operational\n✅ Data Integrity: Verified\n\n📊 System Usage:\n• Active Sessions: 1\n• Data Records: ${patients.length + doctors.length + appointments.length + medications.length}\n• Last Backup: ${new Date().toLocaleDateString()}\n• Uptime: 99.9%\n\n🔒 Security Status: Secure`)}
          />
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomePage />;
      case 'appointments': return <AppointmentsPage />;
      case 'doctors': return <DoctorsPage />;
      case 'departments': return <DepartmentsPage />;
      case 'patients': return <PatientsPage />;
      case 'medications': return <MedicationsPage />;
      case 'reports': return <ReportsPage />;
      default: return <HomePage />;
    }
  };

  const renderModalContent = () => {
    switch (modalType) {
      case 'appointment':
        return (
          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
              <input
                type="text"
                value={appointmentPatient}
                onChange={(e) => setAppointmentPatient(e.target.value)}
                placeholder="Enter patient name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
              <input
                type="text"
                value={appointmentDoctor}
                onChange={(e) => setAppointmentDoctor(e.target.value)}
                placeholder="Enter doctor name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input
                type="time"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={appointmentStatus}
                onChange={(e) => setAppointmentStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex space-x-3">
              <button type="submit" className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white">
                <Save className="w-4 h-4" />
                <span>{editingItem ? "Update" : "Create"}</span>
              </button>
              <button 
                type="button"
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors bg-gray-100 hover:bg-gray-200 text-gray-700"
                onClick={() => {
                  setShowModal(false);
                  setEditingItem(null);
                  resetForms();
                }}
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        );

      case 'patient':
        return (
          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Enter patient full name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input
                type="number"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
                placeholder="Enter age"
                required
                min="1"
                max="120"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                placeholder="+90 532 123 4567"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                value={patientAddress}
                onChange={(e) => setPatientAddress(e.target.value)}
                placeholder="Enter address"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex space-x-3">
              <button type="submit" className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white">
                <Save className="w-4 h-4" />
                <span>{editingItem ? "Update" : "Create"}</span>
              </button>
              <button 
                type="button"
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors bg-gray-100 hover:bg-gray-200 text-gray-700"
                onClick={() => {
                  setShowModal(false);
                  setEditingItem(null);
                  resetForms();
                }}
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        );

      case 'medication':
        return (
          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Medication Name</label>
              <input
                type="text"
                value={medicationName}
                onChange={(e) => setMedicationName(e.target.value)}
                placeholder="Enter medication name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                value={medicationQuantity}
                onChange={(e) => setMedicationQuantity(e.target.value)}
                placeholder="Enter quantity"
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <input
                type="text"
                value={medicationType}
                onChange={(e) => setMedicationType(e.target.value)}
                placeholder="e.g., Tablet, Capsule, Syrup"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={medicationDescription}
                onChange={(e) => setMedicationDescription(e.target.value)}
                placeholder="Enter description"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex space-x-3">
              <button type="submit" className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white">
                <Save className="w-4 h-4" />
                <span>{editingItem ? "Update" : "Create"}</span>
              </button>
              <button 
                type="button"
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors bg-gray-100 hover:bg-gray-200 text-gray-700"
                onClick={() => {
                  setShowModal(false);
                  setEditingItem(null);
                  resetForms();
                }}
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Logo />
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-800">Admin User</p>
                <p className="text-xs text-gray-600">System Administrator</p>
              </div>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2 py-4 overflow-x-auto">
            <TabButton id="home" label="Home" icon={Building2} isActive={activeTab === 'home'} onClick={() => setActiveTab('home')} />
            <TabButton id="appointments" label="Appointments" icon={Calendar} isActive={activeTab === 'appointments'} onClick={() => setActiveTab('appointments')} />
            <TabButton id="doctors" label="Doctors" icon={Users} isActive={activeTab === 'doctors'} onClick={() => setActiveTab('doctors')} />
            <TabButton id="departments" label="Departments" icon={Building2} isActive={activeTab === 'departments'} onClick={() => setActiveTab('departments')} />
            <TabButton id="patients" label="Patients" icon={Users} isActive={activeTab === 'patients'} onClick={() => setActiveTab('patients')} />
            <TabButton id="medications" label="Medications" icon={Pill} isActive={activeTab === 'medications'} onClick={() => setActiveTab('medications')} />
            <TabButton id="reports" label="Reports" icon={FileText} isActive={activeTab === 'reports'} onClick={() => setActiveTab('reports')} />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Modal */}
      {showModal && (
        <Modal title={`${editingItem ? 'Edit' : 'Add'} ${modalType.charAt(0).toUpperCase() + modalType.slice(1)}`}>
          {renderModalContent()}
        </Modal>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">© 2025 MEDIPOL Hospital Management System. All rights reserved.</p>
            <p className="text-sm text-gray-600">Optimized Database Hospital System</p>
          </div>
        </div>
      </footer>
    </div>
  );
  };

  export default MedipolHospitalSystem;