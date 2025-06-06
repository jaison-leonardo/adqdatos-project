// Crear partículas animadas
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 15;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 5) + 's';
        
        particlesContainer.appendChild(particle);
    }
}

// Mostrar alerta
function showAlert(message, type = 'success') {
    const alertContainer = document.getElementById('alertContainer');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : '⚠️';
    alert.innerHTML = `<span>${icon}</span> ${message}`;
    
    alertContainer.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Cargar configuración actual
async function loadConfig() {
    try {
        const response = await fetch('/api/umbrales');
        const data = await response.json();
        
        // Cargar umbrales
        if (data.umbrales) {
            document.getElementById('humedad_min').value = data.umbrales.humedad_min || 30;
            document.getElementById('humedad_max').value = data.umbrales.humedad_max || 80;
            document.getElementById('temperatura_min').value = data.umbrales.temperatura_min || 15;
            document.getElementById('temperatura_max').value = data.umbrales.temperatura_max || 35;
            document.getElementById('intervalo_riego').value = data.umbrales.intervalo_riego || 10;
        }
        
        // Cargar otros parámetros
        if (data.otros_parametros) {
            document.getElementById('modo_automatico').checked = data.otros_parametros.modo_automatico || false;
        }
        
        updateSystemStatus(data);
        showAlert('Configuración cargada correctamente', 'success');
        
    } catch (error) {
        console.error('Error al cargar configuración:', error);
        showAlert('Error al cargar la configuración', 'error');
    }
}

// Actualizar estado del sistema
function updateSystemStatus(config) {
    const statusRiego = document.getElementById('statusRiego');
    const statusTemp = document.getElementById('statusTemp');
    const statusHumedad = document.getElementById('statusHumedad');
    
    if (config.otros_parametros?.modo_automatico) {
        statusRiego.innerHTML = `
            <strong style="color: #00ff88;">✅ Activo</strong><br>
            <small>Intervalo: ${config.umbrales?.intervalo_riego || 10} minutos</small>
        `;
    } else {
        statusRiego.innerHTML = `
            <strong style="color: #ffaa00;">⏸️ Manual</strong><br>
            <small>Riego controlado manualmente</small>
        `;
    }
    
    statusTemp.innerHTML = `
        <strong>Rango: ${config.umbrales?.temperatura_min || 15}°C - ${config.umbrales?.temperatura_max || 35}°C</strong><br>
        <small>Alertas activas fuera del rango</small>
    `;
    
    statusHumedad.innerHTML = `
        <strong>Rango: ${config.umbrales?.humedad_min || 30}% - ${config.umbrales?.humedad_max || 80}%</strong><br>
        <small>Riego automático cuando < ${config.umbrales?.humedad_min || 30}%</small>
    `;
}

// Restablecer valores por defecto
function resetToDefaults() {
    if (confirm('¿Estás seguro de que quieres restablecer los valores por defecto?')) {
        document.getElementById('humedad_min').value = 30;
        document.getElementById('humedad_max').value = 80;
        document.getElementById('temperatura_min').value = 15;
        document.getElementById('temperatura_max').value = 35;
        document.getElementById('intervalo_riego').value = 10;
        document.getElementById('modo_automatico').checked = true;
        
        showAlert('Valores restablecidos por defecto', 'warning');
    }
}

// Guardar configuración
async function saveConfig(event) {
    event.preventDefault();
    
    try {
        const formData = new FormData(event.target);
        const config = {
            umbrales: {
                humedad_min: parseInt(document.getElementById('humedad_min').value),
                humedad_max: parseInt(document.getElementById('humedad_max').value),
                temperatura_min: parseInt(document.getElementById('temperatura_min').value),
                temperatura_max: parseInt(document.getElementById('temperatura_max').value),
                intervalo_riego: parseInt(document.getElementById('intervalo_riego').value)
            },
            otros_parametros: {
                modo_automatico: document.getElementById('modo_automatico').checked
            }
        };
        
        // Validaciones
        if (config.umbrales.humedad_min >= config.umbrales.humedad_max) {
            throw new Error('La humedad mínima debe ser menor que la máxima');
        }
        
        if (config.umbrales.temperatura_min >= config.umbrales.temperatura_max) {
            throw new Error('La temperatura mínima debe ser menor que la máxima');
        }
        
        if (config.umbrales.intervalo_riego < 1) {
            throw new Error('El intervalo de riego debe ser mayor a 0');
        }
        
        const response = await fetch('/api/umbrales', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(config)
        });
        
        const result = await response.json();
        
        if (result.status === 'OK') {
            showAlert('✅ Configuración guardada exitosamente', 'success');
            updateSystemStatus(config);
        } else {
            throw new Error(result.message || 'Error desconocido');
        }
        
    } catch (error) {
        console.error('Error al guardar configuración:', error);
        showAlert(`Error: ${error.message}`, 'error');
    }
}

// Inicializar página
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    loadConfig();
    
    // Configurar formulario
    document.getElementById('configForm').addEventListener('submit', saveConfig);
});

// Efecto parallax para partículas
document.addEventListener('mousemove', function(e) {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
        const speed = (index % 2 + 1) * 0.2;
        particle.style.transform = `translate(${mouseX * speed}px, ${mouseY * speed}px)`;
    });
});