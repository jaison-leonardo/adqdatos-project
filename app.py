from flask import Flask, request, jsonify, render_template
import plotly.graph_objs as go
import os
from flask_cors import CORS
import datetime
import json
from datetime import datetime, timedelta, timezone

# Simulación en memoria
sensor_data = {
    "humedad_suelo": [],
    "temperatura": [],
    "humedad_ambiente": [],
    "timestamps": []
}

dispositivos_activos = {}
historial_dispositivos = {}
HISTORIAL_FILE = "dispositivos.json"
riego_manual = set()  # Guarda los device_id que deben activar riego manual

# Flask app
server = Flask(__name__)
CORS(server)

def cargar_todos_los_dispositivos():
    if os.path.exists(HISTORIAL_FILE):
        with open(HISTORIAL_FILE, "r") as f:
            return set(json.load(f))
    return set()

def guardar_todos_los_dispositivos(device_ids):
    with open(HISTORIAL_FILE, "w") as f:
        json.dump(list(device_ids), f)

@server.route('/')
def index():
    return render_template('welcome.html')

@server.route('/login')
def login():
    return render_template('login.html')

@server.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@server.route('/dispositivos')
def dispositivos():
    return render_template('devices.html')

@server.route('/configuracion')
def configuracion():
    return render_template('config.html')

@server.route('/api/sensor_data', methods=['GET'])
def obtener_datos_dispositivos():
    return jsonify(historial_dispositivos)

@server.route('/api/sensores', methods=['POST'])
def recibir_datos():
    data = request.get_json()
    device_id = data.get('device_id', 'unknown')
    temperatura = data.get('temperatura')
    humedad_ambiente = data.get('humedad_ambiente')
    humedad_suelo = data.get('humedad_suelo')
    now = datetime.now(timezone.utc).isoformat()

    # Inicializa historial si no existe
    if device_id not in historial_dispositivos:
        historial_dispositivos[device_id] = {
            "timestamps": [],
            "temperature": [],
            "ambientHumidity": [],
            "soilHumidity": []
        }

    # Agrega los datos
    historial = historial_dispositivos[device_id]
    historial["timestamps"].append(now)
    historial["temperature"].append(temperatura)
    historial["ambientHumidity"].append(humedad_ambiente)
    historial["soilHumidity"].append(humedad_suelo)

    # Limita el historial a los últimos 50 datos
    max_len = 50
    for key in historial:
        if len(historial[key]) > max_len:
            historial[key].pop(0)

    return jsonify({"status": "OK"})

@server.route('/api/riego_manual', methods=['POST'])
def activar_riego_manual():
    data = request.get_json()
    device_id = data.get('device_id')
    if device_id:
        riego_manual.add(device_id)
        return jsonify({"status": "ok"}), 200
    return jsonify({"status": "error", "message": "No device_id"}), 400

@server.route('/api/riego_manual', methods=['GET'])
def consultar_riego_manual():
    device_id = request.args.get('device_id')
    if device_id and device_id in riego_manual:
        riego_manual.remove(device_id)
        return jsonify({"riego": True})
    return jsonify({"riego": False})

# Guardar o actualizar umbrales
@server.route('/api/umbrales', methods=['POST', 'PUT'])
def actualizar_umbrales():
    try:
        data = request.get_json()
        
        # Validaciones básicas
        if 'umbrales' in data:
            umbrales = data['umbrales']
            if umbrales.get('humedad_min', 0) >= umbrales.get('humedad_max', 100):
                return jsonify({"status": "error", "message": "Humedad mínima debe ser menor que máxima"}), 400
            if umbrales.get('temperatura_min', 0) >= umbrales.get('temperatura_max', 50):
                return jsonify({"status": "error", "message": "Temperatura mínima debe ser menor que máxima"}), 400
        
        # Leer configuración actual o crear nueva si no existe
        try:
            with open("parametros.json", 'r') as file:
                parametros = json.load(file)
        except FileNotFoundError:
            parametros = {}
        
        # Actualizar con los nuevos datos
        if 'umbrales' in data:
            parametros['umbrales'] = data['umbrales']
        if 'otros_parametros' in data:
            parametros['otros_parametros'] = data['otros_parametros']
        
        # Guardar
        with open("parametros.json", 'w') as file:
            json.dump(parametros, file, indent=2)
        
        return jsonify({"status": "OK", "message": "Configuración actualizada exitosamente"}), 200
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# Obtener umbrales
@server.route('/api/umbrales', methods=['GET'])
def obtener_umbrales():
    try:
        with open("parametros.json", 'r') as file:
            parametros = json.load(file)
        return jsonify(parametros)
    except FileNotFoundError:
        parametros_default = {
            "umbrales": {
                "humedad_min": 30,
                "humedad_max": 80,
                "temperatura_min": 15,
                "temperatura_max": 35,
                "intervalo_riego": 10
            },
            "otros_parametros": {
                "modo_automatico": True
            }
        }
        with open("parametros.json", 'w') as file:
            json.dump(parametros_default, file)
        return jsonify(parametros_default)

@server.route('/api/ping', methods=['POST'])
def ping_dispositivo():
    data = request.get_json()
    device_id = data.get('device_id')
    if device_id:
        dispositivos_activos[device_id] = {
            "last_ping": datetime.now(timezone.utc),
            "device_name": data.get("device_name"),
            "firmware": data.get("firmware"),
            "rssi": data.get("rssi"),
            "uptime": data.get("uptime")
        }
        # Actualizar archivo de dispositivos conocidos
        conocidos = cargar_todos_los_dispositivos()
        conocidos.add(device_id)
        guardar_todos_los_dispositivos(conocidos)
        return jsonify({"status": "ok"}), 200
    return jsonify({"status": "error", "message": "No device_id"}), 400

@server.route('/api/dispositivos_activos', methods=['GET'])
def obtener_dispositivos_activos():
    ahora = datetime.now(timezone.utc)
    activos = []
    for device_id, info in dispositivos_activos.items():
        if ahora - info["last_ping"] < timedelta(minutes=10):
            activos.append({
                "device_id": device_id,
                "device_name": info.get("device_name"),
                "firmware": info.get("firmware"),
                "rssi": info.get("rssi"),
                "uptime": info.get("uptime"),
                "last_ping": info.get("last_ping").isoformat()
            })
    # Cargar todos los dispositivos conocidos
    todos = cargar_todos_los_dispositivos()
    online_ids = set(d["device_id"] for d in activos)
    offline = list(todos - online_ids)
    return jsonify({
        "activos": activos,
        "offline": offline,
        "total": len(todos)
    })

# Ruta de inicio
@server.route('/')
def home():
    return "Sistema IOT de Monitoreo y Riego Inteligente - Ir a /dashboard para ver el panel"

if __name__ == '__main__':
    server.run(debug=True, host='0.0.0.0', port=5000)
