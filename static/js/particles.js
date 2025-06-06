// Crear partículas animadas
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

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

// Inicializar partículas cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
});

// Efecto de parallax sutil al mover el mouse
document.addEventListener('mousemove', function(e) {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
        const speed = (index % 3 + 1) * 0.5;
        particle.style.transform = `translate(${mouseX * speed}px, ${mouseY * speed}px)`;
    });
});