from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

# Database connection
def get_db_connection():
    conn = psycopg2.connect(
        host=os.getenv('DB_HOST'),
        database=os.getenv('DB_NAME'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        port=os.getenv('DB_PORT')
    )
    return conn

# Helper function for API responses
def json_response(data=None, message="", status=200):
    return jsonify({
        "data": data,
        "message": message,
        "status": status
    })

# PATIENTS ENDPOINTS
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
    
    required_fields = ['patient_id', 'patient_name', 'patient_surname']
    if not all(field in data for field in required_fields):
        return json_response(None, "Missing required fields", 400)
    
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        cur.execute(
            'INSERT INTO Patient (patient_id, patient_name, patient_surname, birth_date, phone, address) '
            'VALUES (%s, %s, %s, %s, %s, %s) RETURNING *;',
            (data['patient_id'], data['patient_name'], data['patient_surname'],
             data.get('birth_date'), data.get('phone'), data.get('address'))
        )
        new_patient = cur.fetchone()
        conn.commit()
        
        return json_response(new_patient, "Patient created", 201)
    except psycopg2.IntegrityError as e:
        conn.rollback()
        return json_response(None, "Patient ID already exists", 400)
    finally:
        cur.close()
        conn.close()

# Similar endpoints for other tables (doctors, departments, etc.)
# ... (I'll provide the complete file at the end)

if __name__ == '__main__':
    app.run(debug=True)