// Variables globales para almacenar datos
let devicesData = {};
let selectedDevice = null;

// Función para crear partículas animadas
function createParticles() {
    const particles = document.getElementById('particles');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        particles.appendChild(particle);
    }
}

// Función para actualizar indicadores principales
function updateMainIndicators(data) {
    const activeDevices = Object.keys(data).length;
    document.getElementById('activeDevices').textContent = activeDevices;

    // Calcular uptime promedio (en %)
    let totalUptime = 0;
    let count = 0;
    Object.values(data).forEach(device => {
        if (device.uptime && device.uptime > 0) {
            // Suponiendo que el periodo de referencia es 24 horas (86400 segundos)
            totalUptime += Math.min(device.uptime / 86400, 1);
            count++;
        }
    });
    const avgUptime = count > 0 ? (totalUptime / count) * 100 : 0;
    document.getElementById('uptime').textContent = avgUptime.toFixed(1) + '%';
}

// Función para crear gráfico de temperatura
function createTemperatureChart(data) {
    const traces = [];
    
    Object.keys(data).forEach(deviceId => {
        const deviceData = data[deviceId];
        traces.push({
            x: deviceData.timestamps,
            y: deviceData.temperature,
            type: 'scatter',
            mode: 'lines+markers',
            name: `Dispositivo ${deviceId}`,
            line: {
                width: 3,
                shape: 'spline'
            },
            marker: {
                size: 6
            }
        });
    });

    const layout = {
        title: {
            text: 'Temperatura por Dispositivo',
            font: { color: '#00d4ff' }
        },
        xaxis: {
            title: 'Tiempo',
            color: '#ffffff',
            gridcolor: 'rgba(255,255,255,0.1)'
        },
        yaxis: {
            title: 'Temperatura (°C)',
            color: '#ffffff',
            gridcolor: 'rgba(255,255,255,0.1)'
        },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#ffffff' },
        legend: {
            font: { color: '#ffffff' }
        }
    };

    Plotly.newPlot('temperatureChart', traces, layout, {responsive: true});
}

// Función para crear gráfico de humedad ambiente
function createAmbientHumidityChart(data) {
    const traces = [];
    
    Object.keys(data).forEach(deviceId => {
        const deviceData = data[deviceId];
        traces.push({
            x: deviceData.timestamps,
            y: deviceData.ambientHumidity,
            type: 'scatter',
            mode: 'lines+markers',
            name: `Dispositivo ${deviceId}`,
            line: {
                width: 3,
                shape: 'spline'
            },
            marker: {
                size: 6
            }
        });
    });

    const layout = {
        title: {
            text: 'Humedad Ambiente por Dispositivo',
            font: { color: '#00d4ff' }
        },
        xaxis: {
            title: 'Tiempo',
            color: '#ffffff',
            gridcolor: 'rgba(255,255,255,0.1)'
        },
        yaxis: {
            title: 'Humedad (%)',
            color: '#ffffff',
            gridcolor: 'rgba(255,255,255,0.1)'
        },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#ffffff' },
        legend: {
            font: { color: '#ffffff' }
        }
    };

    Plotly.newPlot('ambientHumidityChart', traces, layout, {responsive: true});
}

// Función para crear gráfico de humedad de suelo
function createSoilHumidityChart(data) {
    const traces = [];
    
    Object.keys(data).forEach(deviceId => {
        const deviceData = data[deviceId];
        traces.push({
            x: deviceData.timestamps,
            y: deviceData.soilHumidity,
            type: 'scatter',
            mode: 'lines+markers',
            name: `Dispositivo ${deviceId}`,
            line: {
                width: 3,
                shape: 'spline'
            },
            marker: {
                size: 6
            }
        });
    });

    const layout = {
        title: {
            text: 'Humedad del Suelo por Dispositivo',
            font: { color: '#00d4ff' }
        },
        xaxis: {
            title: 'Tiempo',
            color: '#ffffff',
            gridcolor: 'rgba(255,255,255,0.1)'
        },
        yaxis: {
            title: 'Humedad (%)',
            color: '#ffffff',
            gridcolor: 'rgba(255,255,255,0.1)'
        },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#ffffff' },
        legend: {
            font: { color: '#ffffff' }
        }
    };

    Plotly.newPlot('soilHumidityChart', traces, layout, {responsive: true});
}

// Función para crear tacómetro
function createGauge(elementId, value, title, unit, min = 0, max = 100) {
    const data = [{
        type: "indicator",
        mode: "gauge+number",
        value: value,
        title: { text: title, font: { color: '#ffffff' } },
        gauge: {
            axis: { range: [min, max], tickcolor: '#ffffff' },
            bar: { color: '#00d4ff' },
            bgcolor: "rgba(0,0,0,0.1)",
            borderwidth: 2,
            bordercolor: "rgba(0,212,255,0.3)",
            steps: [
                { range: [min, max * 0.3], color: "rgba(0,255,136,0.3)" },
                { range: [max * 0.3, max * 0.7], color: "rgba(255,170,0,0.3)" },
                { range: [max * 0.7, max], color: "rgba(255,68,68,0.3)" }
            ],
            threshold: {
                line: { color: "red", width: 4 },
                thickness: 0.75,
                value: max * 0.9
            }
        }
    }];

    const layout = {
        width: 300,
        height: 300,
        margin: { t: 50, r: 50, l: 50, b: 50 },
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        font: { color: '#ffffff' }
    };

    Plotly.newPlot(elementId, data, layout, {responsive: true});
}

// Función para actualizar tacómetros
function updateGauges(deviceId) {
    if (!devicesData[deviceId]) return;

    const deviceData = devicesData[deviceId];
    const latestIndex = deviceData.timestamps.length - 1;

    if (latestIndex >= 0) {
        const currentTemp = deviceData.temperature[latestIndex];
        const currentAmbHum = deviceData.ambientHumidity[latestIndex];
        const currentSoilHum = deviceData.soilHumidity[latestIndex];

        createGauge('ambientHumidityGauge', currentAmbHum, 'Humedad Ambiente %', '%', 0, 100);
        createGauge('temperatureGauge', currentTemp, 'Temperatura °C', '°C', 0, 50);
        createGauge('soilHumidityGauge', currentSoilHum, 'Humedad Suelo %', '%', 0, 100);
    }
}

// Función para poblar el selector de dispositivos
function populateDeviceSelector(data) {
    const selector = document.getElementById('deviceSelector');
    selector.innerHTML = '<option value="">Seleccionar dispositivo...</option>';
    
    Object.keys(data).forEach(deviceId => {
        const option = document.createElement('option');
        option.value = deviceId;
        option.textContent = `Dispositivo ${deviceId}`;
        selector.appendChild(option);
    });
}

// Event listener para el selector de dispositivos
document.getElementById('deviceSelector').addEventListener('change', function() {
    const selectedDeviceId = this.value;
    if (selectedDeviceId) {
        updateGauges(selectedDeviceId);
    }
});

// Función principal para actualizar el dashboard
function updateDashboard(data) {
    devicesData = data;
    updateMainIndicators(data);
    createTemperatureChart(data);
    createAmbientHumidityChart(data);
    createSoilHumidityChart(data);
    populateDeviceSelector(data);
}

// Función para obtener datos de Flask (placeholder)
async function fetchDataFromFlask() {
    try {
        // Aquí harías la llamada real a tu endpoint de Flask
        const response = await fetch('/api/sensor_data');
        const data = await response.json();
        // Actualizar el dashboard con los datos obtenidos
        updateDashboard(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    fetchDataFromFlask();
    
    // Actualizar datos cada 30 segundos
    setInterval(fetchDataFromFlask, 30000);
});
