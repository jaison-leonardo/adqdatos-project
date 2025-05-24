from flask import Flask, request, jsonify, render_template
from dash import Dash, dcc, html
from dash.dependencies import Input, Output
import plotly.graph_objs as go
from flask_cors import CORS
import datetime

# Simulación en memoria
sensor_data = {
    "humedad_suelo": [],
    "temperatura": [],
    "humedad_ambiente": [],
    "timestamps": []
}

# Flask app
server = Flask(__name__)
CORS(server)

# Dash app integrada a Flask
app = Dash(__name__, server=server, url_base_pathname='/dashboard/')

# Layout de Dash
app.layout = html.Div([
    html.H1("Dashboard de Sensores IOT"),
    dcc.Graph(id='graph-temp'),
    dcc.Graph(id='graph-humedad'),
    dcc.Interval(
        id='interval-component',
        interval=5*1000,  # cada 5 segundos
        n_intervals=0
    )
])

# Callback para actualizar gráficas
@app.callback(
    Output('graph-temp', 'figure'),
    Output('graph-humedad', 'figure'),
    Input('interval-component', 'n_intervals')
)
def update_graphs(n):
    timestamps = sensor_data['timestamps']
    temperatura = sensor_data['temperatura']
    humedad_ambiente = sensor_data['humedad_ambiente']
    humedad_suelo = sensor_data['humedad_suelo']

    fig_temp = go.Figure()
    fig_temp.add_trace(go.Scatter(x=timestamps, y=temperatura, mode='lines+markers', name='Temperatura °C'))
    fig_temp.update_layout(title='Temperatura', xaxis_title='Tiempo', yaxis_title='°C')

    fig_humedad = go.Figure()
    fig_humedad.add_trace(go.Scatter(x=timestamps, y=humedad_ambiente, mode='lines+markers', name='Humedad Ambiente %'))
    fig_humedad.add_trace(go.Scatter(x=timestamps, y=humedad_suelo, mode='lines+markers', name='Humedad Suelo %'))
    fig_humedad.update_layout(title='Humedades', xaxis_title='Tiempo', yaxis_title='%')

    return fig_temp, fig_humedad

# Ruta API para recibir datos desde ESP32
@server.route('/api/sensores', methods=['POST'])
def recibir_datos():
    data = request.get_json()

    temperatura = data.get('temperatura')
    humedad_ambiente = data.get('humedad_ambiente')
    humedad_suelo = data.get('humedad_suelo')

    now = datetime.datetime.now().strftime("%H:%M:%S")

    sensor_data['temperatura'].append(temperatura)
    sensor_data['humedad_ambiente'].append(humedad_ambiente)
    sensor_data['humedad_suelo'].append(humedad_suelo)
    sensor_data['timestamps'].append(now)

    # Limitar tamaño de historial
    max_len = 50
    for key in sensor_data:
        if len(sensor_data[key]) > max_len:
            sensor_data[key].pop(0)

    return jsonify({"status": "OK"})

# Ruta de inicio
@server.route('/')
def home():
    return "Sistema IOT de Monitoreo y Riego Inteligente - Ir a /dashboard para ver el panel"

if __name__ == '__main__':
    server.run(debug=True, host='0.0.0.0', port=5000)
