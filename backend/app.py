from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = psycopg2.connect(
        host=os.getenv('DB_HOST'),
        database=os.getenv('DB_NAME'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        port=os.getenv('DB_PORT')
    )
    return conn

def json_response(data=None, message="", status=200):
    return jsonify({
        "data": data,
        "message": message,
        "status": status
    }), status

# PATIENTS
@app.route('/api/patients', methods=['GET'])
def get_patients():
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute('SELECT * FROM Patient ORDER BY patient_id;')
    patients = cur.fetchall()
    
    cur.close()
    conn.close()
    return json_response(patients)

@app.route('/api/patients/<int:patient_id>', methods=['GET'])
def get_patient(patient_id):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute('SELECT * FROM Patient WHERE patient_id = %s;', (patient_id,))
    patient = cur.fetchone()
    
    cur.close()
    conn.close()
    
    if not patient:
        return json_response(None, "Patient not found", 404)
    return json_response(patient)

@app.route('/api/patients', methods=['POST'])
def create_patient():
    data = request.get_json()
    required = ['patient_id', 'patient_name', 'patient_surname']
    if not all(field in data for field in required):
        return json_response(None, "Missing required fields", 400)
    
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        cur.execute(
            'INSERT INTO Patient (patient_id, patient_name, patient_surname, birth_date, phone, address) '
            'VALUES (%s, %s, %s, %s, %s, %s) RETURNING *;',
            (data['patient_id'], data['patient_name'], data['patient_surname'],
             data.get('birth_date'), data.get('phone'), data.get('address'))
        new_patient = cur.fetchone()
        conn.commit()
        return json_response(new_patient, "Patient created", 201)
    except psycopg2.IntegrityError:
        conn.rollback()
        return json_response(None, "Patient ID already exists", 400)
    finally:
        cur.close()
        conn.close()

# DOCTORS
@app.route('/api/doctors', methods=['GET'])
def get_doctors():
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute('SELECT * FROM Doctor ORDER BY doctor_id;')
    doctors = cur.fetchall()
    
    cur.close()
    conn.close()
    return json_response(doctors)

# DEPARTMENTS
@app.route('/api/departments', methods=['GET'])
def get_departments():
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute('SELECT * FROM Department ORDER BY department_id;')
    departments = cur.fetchall()
    
    cur.close()
    conn.close()
    return json_response(departments)

# APPOINTMENTS
@app.route('/api/appointments', methods=['GET'])
def get_appointments():
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute('''
        SELECT a.*, p.patient_name, p.patient_surname, d.doctor_name, d.doctor_surname 
        FROM Appointment a
        JOIN Patient p ON a.patient_id = p.patient_id
        JOIN Assigned ass ON a.appointment_id = ass.appointment_id
        JOIN Doctor d ON ass.doctor_id = d.doctor_id
        ORDER BY a.appointment_date;
    ''')
    appointments = cur.fetchall()
    
    cur.close()
    conn.close()
    return json_response(appointments)

@app.route('/api/appointments', methods=['POST'])
def create_appointment():
    data = request.get_json()
    required = ['appointment_id', 'patient_id', 'doctor_id', 'appointment_date']
    if not all(field in data for field in required):
        return json_response(None, "Missing required fields", 400)
    
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        # Start transaction
        cur.execute('BEGIN')
        
        # Create appointment
        cur.execute(
            'INSERT INTO Appointment (appointment_id, patient_id, status, appointment_cost, appointment_date, diagnoses) '
            'VALUES (%s, %s, %s, %s, %s, %s) RETURNING *;',
            (data['appointment_id'], data['patient_id'], data.get('status', 'Scheduled'),
             data.get('appointment_cost'), data['appointment_date'], data.get('diagnoses'))
        )
        new_appointment = cur.fetchone()
        
        # Assign doctor
        cur.execute(
            'INSERT INTO Assigned (doctor_id, appointment_id) VALUES (%s, %s);',
            (data['doctor_id'], new_appointment['appointment_id'])
        )
        
        conn.commit()
        return json_response(new_appointment, "Appointment created", 201)
    except Exception as e:
        conn.rollback()
        return json_response(None, str(e), 400)
    finally:
        cur.close()
        conn.close()

# MEDICATIONS
@app.route('/api/medications', methods=['GET'])
def get_medications():
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    cur.execute('SELECT * FROM Medication ORDER BY medication_name;')
    medications = cur.fetchall()
    
    cur.close()
    conn.close()
    return json_response(medications)

if __name__ == '__main__':
    app.run(debug=True)
