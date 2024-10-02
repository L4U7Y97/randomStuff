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

function drawFire(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const fireParticles = [];

    for (let i = 0; i < 100; i++) {
        fireParticles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: Math.random() * 2 - 1,
            vy: Math.random() * -5,
            radius: Math.random() * 5 + 2,
            color: `hsl(${Math.random() * 30 + 30}, 100%, 50%)`
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        ctx.globalAlpha = 0.7;

        fireParticles.forEach((particle) => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();

            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.y < 0) {
                particle.y = height;
                particle.x = Math.random() * width;
            }
        });

        requestAnimationFrame(animate);
    }

    animate();
}

function drawDebris(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const debrisParticles = [];

    for (let i = 0; i < 100; i++) {
        debrisParticles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: Math.random() * 5 - 2.5,
            vy: Math.random() * 5 - 2.5,
            radius: Math.random() * 10 + 5,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        ctx.globalAlpha = 0.7;

        debrisParticles.forEach((particle) => {
            ctx.beginPath();
            ctx.rect(particle.x, particle.y, particle.radius, particle.radius);
            ctx.fillStyle = particle.color;
            ctx.fill();

            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < 0 || particle.x > width) {
                particle.vx *= -1;
            }
            if (particle.y < 0 || particle.y > height) {
                particle.vy *= -1;
            }
        });

        requestAnimationFrame(animate);
    }

    animate();
}