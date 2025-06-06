// Crear partículas animadas
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 20; // Menos partículas para no sobrecargar el dashboard

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 5) + 's';
        
        particlesContainer.appendChild(particle);
    }
}

// Generar datos simulados para las gráficas
function generateTimeSeriesData(hours = 24, baseValue = 25, variance = 5) {
    const data = [];
    const now = new Date();
    
    for (let i = hours; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        const value = baseValue + (Math.random() - 0.5) * variance * 2;
        data.push({
            x: time,
            y: Math.round(value * 100) / 100
        });
    }
    return data;
}

// Crear gráfica de temperatura
function createTemperatureChart() {
    const sensor1 = generateTimeSeriesData(24, 25, 3);
    const sensor2 = generateTimeSeriesData(24, 22, 2);
    const sensor3 = generateTimeSeriesData(24, 28, 4);

    const data = [
        {
            x: sensor1.map(d => d.x),
            y: sensor1.map(d => d.y),
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Sensor 1',
            line: { color: '#00d4ff', width: 3 },
            marker: { size: 4 }
        },
        {
            x: sensor2.map(d => d.x),
            y: sensor2.map(d => d.y),
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Sensor 2',
            line: { color: '#00ff88', width: 3 },
            marker: { size: 4 }
        },
        {
            x: sensor3.map(d => d.x),
            y: sensor3.map(d => d.y),
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Sensor 3',
            line: { color: '#ffaa00', width: 3 },
            marker: { size: 4 }
        }
    ];

    const layout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#ffffff', family: 'Segoe UI' },
        xaxis: {
            gridcolor: 'rgba(255,255,255,0.1)',
            tickformat: '%H:%M'
        },
        yaxis: {
            gridcolor: 'rgba(255,255,255,0.1)',
            title: 'Temperatura (°C)'
        },
        margin: { t: 20, r: 20, b: 40, l: 50 },
        legend: { x: 0, y: 1.1, orientation: 'h' }
    };

    Plotly.newPlot('temperatureChart', data, layout, { responsive: true });
}

// Crear gráfica de humedad
function createHumidityChart() {
    const zones = ['Zona A', 'Zona B', 'Zona C', 'Zona D', 'Zona E'];
    const humidity = [65, 72, 58, 81, 69];
    const colors = ['#00d4ff', '#00ff88', '#ffaa00', '#ff6b6b', '#a855f7'];

    const data = [{
        x: zones,
        y: humidity,
        type: 'bar',
        marker: {
            color: colors,
            line: { color: 'rgba(255,255,255,0.2)', width: 1 }
        }
    }];

    const layout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#ffffff', family: 'Segoe UI' },
        xaxis: { gridcolor: 'rgba(255,255,255,0.1)' },
        yaxis: {
            gridcolor: 'rgba(255,255,255,0.1)',
            title: 'Humedad (%)'
        },
        margin: { t: 20, r: 20, b: 40, l: 50 }
    };

    Plotly.newPlot('humidityChart', data, layout, { responsive: true });
}

// Crear gráfica de consumo energético
function createEnergyChart() {
    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const consumption = [45, 52, 48, 61, 55, 38, 42];

    const data = [{
        x: days,
        y: consumption,
        type: 'scatter',
        mode: 'lines+markers',
        fill: 'tonexty',
        line: { color: '#00d4ff', width: 3 },
        marker: { size: 8, color: '#00d4ff' },
        fillcolor: 'rgba(0, 212, 255, 0.1)'
    }];

    const layout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#ffffff', family: 'Segoe UI' },
        xaxis: { gridcolor: 'rgba(255,255,255,0.1)' },
        yaxis: {
            gridcolor: 'rgba(255,255,255,0.1)',
            title: 'kWh'
        },
        margin: { t: 20, r: 20, b: 40, l: 50 }
    };

    Plotly.newPlot('energyChart', data, layout, { responsive: true });
}

// Crear gráfica de estado de dispositivos
function createDeviceStatusChart() {
    const data = [{
        values: [18, 4, 2],
        labels: ['Activos', 'Inactivos', 'Error'],
        type: 'pie',
        marker: {
            colors: ['#00ff88', '#ffaa00', '#ff4444']
        },
        textinfo: 'label+percent',
        textfont: { color: '#ffffff', size: 12 }
    }];

    const layout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#ffffff', family: 'Segoe UI' },
        margin: { t: 20, r: 20, b: 20, l: 20 },
        showlegend: false
    };

    Plotly.newPlot('deviceStatusChart', data, layout, { responsive: true });
}

// Crear gráfica de tráfico de red
function createNetworkChart() {
    const networkData = generateTimeSeriesData(12, 2.5, 1.5);

    const data = [{
        x: networkData.map(d => d.x),
        y: networkData.map(d => d.y),
        type: 'scatter',
        mode: 'lines',
        fill: 'tozeroy',
        line: { color: '#a855f7', width: 2 },
        fillcolor: 'rgba(168, 85, 247, 0.2)'
    }];

    const layout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#ffffff', family: 'Segoe UI' },
        xaxis: {
            gridcolor: 'rgba(255,255,255,0.1)',
            tickformat: '%H:%M'
        },
        yaxis: {
            gridcolor: 'rgba(255,255,255,0.1)',
            title: 'MB/s'
        },
        margin: { t: 20, r: 20, b: 40, l: 50 }
    };

    Plotly.newPlot('networkChart', data, layout, { responsive: true });
}

// Cargar dispositivos conectados
function loadConnectedDevices() {
    const devices = [
        { name: 'Sensor Temperatura #1', status: 'Conectado', time: '2 min' },
        { name: 'Cámara Seguridad #3', status: 'Conectado', time: '5 min' },
        { name: 'Monitor Aire #2', status: 'Conectado', time: '8 min' },
        { name: 'Controlador LED #4', status: 'Conectado', time: '12 min' }
    ];

    const container = document.getElementById('connectedDevices');
    container.innerHTML = devices.map(device => `
        <div style="padding: 10px; border-left: 3px solid #00ff88; margin-bottom: 10px; background: rgba(0,255,136,0.05);">
            <div style="font-weight: 600; color: #ffffff; margin-bottom: 5px;">${device.name}</div>
            <div style="font-size: 0.8rem; color: #b0b0b0;">Hace ${device.time}</div>
        </div>
    `).join('');
}

// Cargar alertas
function loadAlerts() {
    const alerts = [
        { message: 'Temperatura alta en Zona C', type: 'warning', time: '1 min' },
        { message: 'Dispositivo desconectado: Sensor #7', type: 'error', time: '3 min' },
        { message: 'Consumo energético elevado', type: 'warning', time: '15 min' },
        { message: 'Mantenimiento programado mañana', type: 'info', time: '1 hora' }
    ];

    const container = document.getElementById('alertsList');
    container.innerHTML = alerts.map(alert => {
        const colors = {
            warning: '#ffaa00',
            error: '#ff4444',
            info: '#00d4ff'
        };
        return `
            <div style="padding: 10px; border-left: 3px solid ${colors[alert.type]}; margin-bottom: 10px; background: rgba(${alert.type === 'warning' ? '255,170,0' : alert.type === 'error' ? '255,68,68' : '0,212,255'},0.05);">
                <div style="font-weight: 600; color: #ffffff; margin-bottom: 5px;">${alert.message}</div>
                <div style="font-size: 0.8rem; color: #b0b0b0;">Hace ${alert.time}</div>
            </div>
        `;
    }).join('');
}

// Inicializar dashboard
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    
    // Crear todas las gráficas
    createTemperatureChart();
    createHumidityChart();
    createEnergyChart();
    createDeviceStatusChart();
    createNetworkChart();
    
    // Cargar datos dinámicos
    loadConnectedDevices();
    loadAlerts();
    
    // Actualizar datos cada 30 segundos
    setInterval(() => {
        createTemperatureChart();
        createNetworkChart();
    }, 30000);
});

// Parallax effect para partículas
document.addEventListener('mousemove', function(e) {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
        const speed = (index % 2 + 1) * 0.2;
        particle.style.transform = `translate(${mouseX * speed}px, ${mouseY * speed}px)`;
    });
});