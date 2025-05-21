from flask import Flask, request, jsonify
from dash import Dash, html, dcc
import plotly.graph_objs as go
import datetime

# Configuracion Flask + Dash
server = Flask(__name__)
app = Dash(__name__, server=server, url_base_pathname='/')

# Simulacion de datos recibidos
sensor_data = {
    "soil": [],
    "temp": [],
    "humidity": [],
    "timestamps": []
}

# Layout del dashboard
app.layout = html.Div([
    html.H1("🌱 Sistema IoT de Riego Inteligente"),

    dcc.Graph(id='temp-chart'),
    dcc.Graph(id='humidity-chart'),
    dcc.Graph(id='soil-chart'),

    dcc.Interval(id='update-interval', interval=3000, n_intervals=0)
])

# Callbacks para actualizar gráficos
def create_graph(data, name, ytitle):
    return {
        'data': [go.Scatter(x=sensor_data['timestamps'], y=data, mode='lines+markers', name=name)],
        'layout': go.Layout(title=name, yaxis={'title': ytitle})
    }

@app.callback(
    dash.dependencies.Output('temp-chart', 'figure'),
    [dash.dependencies.Input('update-interval', 'n_intervals')]
)
def update_temp(n):
    return create_graph(sensor_data['temp'], "Temperatura (°C)", "°C")

@app.callback(
    dash.dependencies.Output('humidity-chart', 'figure'),
    [dash.dependencies.Input('update-interval', 'n_intervals')]
)
def update_humidity(n):
    return create_graph(sensor_data['humidity'], "Humedad Ambiente (%)", "%")

@app.callback(
    dash.dependencies.Output('soil-chart', 'figure'),
    [dash.dependencies.Input('update-interval', 'n_intervals')]
)
def update_soil(n):
    return create_graph(sensor_data['soil'], "Humedad del Suelo", "ADC")

# Endpoint para recibir datos desde ESP32
@server.route('/api/sensores', methods=['POST'])
def recibir_datos():
    data = request.json
    ts = datetime.datetime.now().strftime('%H:%M:%S')

    sensor_data['temp'].append(data.get('temp', 0))
    sensor_data['humidity'].append(data.get('humidity', 0))
    sensor_data['soil'].append(data.get('soil', 0))
    sensor_data['timestamps'].append(ts)

    # Limitar a 50 puntos
    for key in sensor_data:
        if len(sensor_data[key]) > 50:
            sensor_data[key] = sensor_data[key][-50:]

    return jsonify({"status": "ok"})

if __name__ == '__main__':
    app.run(debug=True)