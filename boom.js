let countdown = 4; // seconds
const clock = document.getElementById('clock');
const clockContainer = document.querySelector('.clock-container');
const explosionContainer = document.getElementById('explosion');
const fireCanvas = document.getElementById('fire-canvas');
const debrisCanvas = document.getElementById('debris-canvas');

const toggleEffects = (show, ...effectsCanvas) => {
    effectsCanvas.forEach((effectCanvas) => {
        effectCanvas.classList.toggle('effect-canvas', show);
        effectCanvas.style.display = show ? 'block' : 'none';
    });
};

setInterval(() => {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    clock.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    countdown--;

    if (countdown === -1) {
        explosionContainer.classList.add('explosion');
		toggleEffects(true, fireCanvas, debrisCanvas)
        clockContainer.style.opacity = 0; 
        drawFire(fireCanvas);
        drawDebris(debrisCanvas);

        setTimeout(() => {
            explosionContainer.classList.remove('explosion');
			toggleEffects(true, fireCanvas, debrisCanvas)
            clockContainer.style.opacity = 1; 
            alert('BOOM!');
            location.reload();
        }, 3000);
    }
}, 1000);


class ParticleEffect {
    constructor(canvas, options) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.particles = [];
        this.options = options;

        this.initParticles();
    }

    initParticles() {
        for (let i = 0; i < 100; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: Math.random() * this.options.vxRange - this.options.vxOffset,
                vy: Math.random() * this.options.vyRange - this.options.vyOffset,
                radius: Math.random() * this.options.radiusRange + this.options.radiusOffset,
                color: `hsl(${Math.random() * this.options.colorRange + (this.options.colorRangeOffset || 0)}, 100%, 50%)`
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.globalAlpha = 0.7;

        this.particles.forEach((particle) => {
            this.ctx.beginPath();
            if (this.options.shape === 'circle') {
                this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            } else {
                this.ctx.rect(particle.x, particle.y, particle.radius, particle.radius);
            }
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();

            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.y < 0) {
                particle.y = this.height;
                particle.x = Math.random() * this.width;
            } else if (particle.x < 0 || particle.x > this.width) {
                particle.vx *= -1;
            } else if (particle.y < 0 || particle.y > this.height) {
                particle.vy *= -1;
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Usage:
const drawFire = (canvas) => new ParticleEffect(canvas, {
    vxRange: 2,
    vxOffset: 1,
    vyRange: 5,
    vyOffset: 0,
    radiusRange: 5,
    radiusOffset: 2,
    colorRange: 30,
    colorRangeOffset: 30,
    shape: 'circle'
}).animate();

const drawDebris = (canvas) => new ParticleEffect(canvas, {
    vxRange: 5,
    vxOffset: 2.5,
    vyRange: 5,
    vyOffset: 2.5,
    radiusRange: 10,
    radiusOffset: 5,
    colorRange: 360,
    shape: 'rect'
}).animate();