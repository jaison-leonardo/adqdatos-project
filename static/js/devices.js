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

// Formatear fecha
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Formatear tiempo de actividad
function formatUptime(seconds) {
    if (!seconds) return 'N/A';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else {
        return `${minutes}m`;
    }
}

// Formatear señal RSSI
function formatRSSI(rssi) {
    if (!rssi) return 'N/A';
    
    let quality = 'Excelente';
    let color = '#00ff88';
    
    if (rssi < -80) {
        quality = 'Débil';
        color = '#ff4444';
    } else if (rssi < -70) {
        quality = 'Regular';
        color = '#ffaa00';
    } else if (rssi < -50) {
        quality = 'Buena';
        color = '#00d4ff';
    }
    
    return `<span style="color: ${color}">${rssi} dBm (${quality})</span>`;
}

// Mostrar alerta
function showAlert(message, type = 'success') {
    const alertContainer = document.getElementById('alertContainer');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `<span>✓</span> ${message}`;
    
    alertContainer.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Activar riego manual
async function activarRiego(deviceId, button) {
    try {
        button.disabled = true;
        button.innerHTML = '<div class="loading"></div> Activando...';
        
        const response = await fetch('/api/riego_manual', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ device_id: deviceId })
        });
        
        const result = await response.json();
        
        if (result.status === 'ok') {
            showAlert(`Riego manual activado para dispositivo ${deviceId}`, 'success');
            button.innerHTML = '✓ Activado';
            
            setTimeout(() => {
                button.disabled = false;
                button.innerHTML = '💧 Regar Manualmente';
            }, 3000);
        } else {
            throw new Error(result.message || 'Error desconocido');
        }
    } catch (error) {
        console.error('Error al activar riego:', error);
        showAlert(`Error al activar riego: ${error.message}`, 'error');
        button.disabled = false;
        button.innerHTML = '💧 Regar Manualmente';
    }
}

// Cargar dispositivos
async function loadDevices() {
    try {
        const response = await fetch('/api/dispositivos_activos');
        const data = await response.json();
        
        const devices = data.activos || [];
        const tableBody = document.getElementById('devicesTableBody');
        
        // Actualizar estadísticas
        document.getElementById('totalDevices').textContent = data.total || 0;
        document.getElementById('onlineDevices').textContent = data.activos.length || 0;
        document.getElementById('offlineDevices').textContent = data.offline.length || 0;
        
        if (devices.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 2rem; color: rgba(255, 255, 255, 0.5);">
                        No hay dispositivos conectados
                    </td>
                </tr>
            `;
            return;
        }
        
        tableBody.innerHTML = devices.map(device => `
            <tr>
                <td>
                    <strong>${device.device_name || 'Dispositivo ESP32'}</strong>
                </td>
                <td>
                    <code style="background: rgba(255,255,255,0.1); padding: 0.25rem 0.5rem; border-radius: 4px;">
                        ${device.device_id}
                    </code>
                </td>
                <td>
                    <div class="status-online">
                        <div class="status-dot"></div>
                        En línea
                    </div>
                </td>
                <td>${device.firmware || 'N/A'}</td>
                <td>${formatRSSI(device.rssi)}</td>
                <td>${formatUptime(device.uptime)}</td>
                <td>${formatDate(device.last_ping)}</td>
                <td>
                    <button class="btn btn-success" onclick="activarRiego('${device.device_id}', this)">
                        💧 Regar Manualmente
                    </button>
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('Error al cargar dispositivos:', error);
        document.getElementById('devicesTableBody').innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 2rem; color: #ff4444;">
                    Error al cargar dispositivos: ${error.message}
                </td>
            </tr>
        `;
    }
}

// Inicializar página
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    loadDevices();
    
    // Actualizar cada 30 segundos
    setInterval(loadDevices, 30000);
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
