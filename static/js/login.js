// Crear partículas animadas
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30; // Menos partículas para no distraer del formulario

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Posición aleatoria
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 5) + 's';
        
        particlesContainer.appendChild(particle);
    }
}

// Manejar el login
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simulación de validación (reemplazar con lógica real)
    if (username && password) {
        // Mostrar mensaje de carga
        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Verificando...';
        submitBtn.disabled = true;
        
        // Simular tiempo de respuesta del servidor
        setTimeout(() => {
            // Aquí iría la lógica de autenticación real
            // Por ahora, redirigir al dashboard
            window.location.href = DASHBOARD_URL;
        }, 1500);
    }
}

// Inicializar partículas cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    
    // Agregar animación de entrada al formulario
    const formContainer = document.querySelector('.form-container');
    formContainer.style.animation = 'fadeInUp 1s ease-out';
});

// Efecto de parallax sutil
document.addEventListener('mousemove', function(e) {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
        const speed = (index % 2 + 1) * 0.3; // Movimiento más sutil
        particle.style.transform = `translate(${mouseX * speed}px, ${mouseY * speed}px)`;
    });
});

// Validación en tiempo real
document.getElementById('username').addEventListener('input', function() {
    if (this.value.length > 0) {
        this.style.borderColor = '#00d4ff';
    } else {
        this.style.borderColor = 'rgba(255, 255, 255, 0.2)';
    }
});

document.getElementById('password').addEventListener('input', function() {
    if (this.value.length > 0) {
        this.style.borderColor = '#00d4ff';
    } else {
        this.style.borderColor = 'rgba(255, 255, 255, 0.2)';
    }
});