let score = 0;
let streak = 1;
let currentCorrect = "";
const robot = document.getElementById('robo-mate');

function robotSpeak(text) {
    document.getElementById('robot-speech').innerHTML = text;
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 1.05;
    utterance.pitch = 1.15;
    utterance.onstart = () => robot.classList.add('speaking');
    utterance.onend = () => robot.classList.remove('speaking');
    window.speechSynthesis.speak(utterance);
}

// Generar dinámicamente los 12 números alrededor del reloj en círculo
function createClockNumbers() {
    const clock = document.getElementById('analog-clock');
    if (clock.querySelectorAll('.clock-num').length > 0) return;

    for (let i = 1; i <= 12; i++) {
        const numSpan = document.createElement('span');
        numSpan.className = 'clock-num';
        numSpan.textContent = i;
        
        // Rotamos cada número desde el centro del reloj y los empujamos hacia afuera
        const angle = i * 30; // 30 grados por número (360 / 12)
        numSpan.style.transform = `rotate(${angle}deg) translate(0, -68px) rotate(-${angle}deg)`;
        
        clock.appendChild(numSpan);
    }
}

function generateClockChallenge() {
    createClockNumbers();

    const minutesOptions = [0, 15, 30, 45];
    const minute = minutesOptions[Math.floor(Math.random() * minutesOptions.length)];
    
    // Generar hora aleatoria en 24h (0 a 23)
    const hour24 = Math.floor(Math.random() * 24);
    
    // Determinar parte del día para dar pista clara al niño
    let periodText = "";
    if (hour24 >= 6 && hour24 < 13) {
        periodText = "☀️ de la <strong>MAÑANA</strong>";
    } else if (hour24 >= 13 && hour24 < 20) {
        periodText = "🌤️ de la <strong>TARDE</strong>";
    } else {
        periodText = "🌙 de la <strong>NOCHE</strong>";
    }

    // Posición de las manecillas (en formato 12h)
    const displayHour = hour24 % 12 || 12;
    const hourAngle = (displayHour * 30) + (minute * 0.5);
    const minuteAngle = minute * 6;
    
    document.getElementById('hour-hand').style.transform = `rotate(${hourAngle}deg)`;
    document.getElementById('min-hand').style.transform = `rotate(${minuteAngle}deg)`;

    currentCorrect = `${String(hour24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    
    robotSpeak(`¿Qué hora es? Fíjate en las agujas... Es una hora ${periodText.replace(/<\/?[^>]+(>|$)/g, "")}.`);
    document.getElementById('robot-speech').innerHTML = `⏰ ¿Qué hora marca el reloj ${periodText}?`;

    // Generar 3 distractores lógicos (ej: confundir mañana con tarde o minutos)
    let options = [currentCorrect];
    while(options.length < 4) {
        let fakeH;
        // 50% de probabilidad de mantener la misma hora en otro momento (ej: 07:15 vs 19:15) o cambiar la hora
        if (Math.random() > 0.5) {
            fakeH = (hour24 + 12) % 24;
        } else {
            fakeH = Math.floor(Math.random() * 24);
        }
        let fakeM = minutesOptions[Math.floor(Math.random() * minutesOptions.length)];
        let fakeTime = `${String(fakeH).padStart(2, '0')}:${String(fakeM).padStart(2, '0')}`;
        
        if(!options.includes(fakeTime)) options.push(fakeTime);
    }
    
    options.sort(() => Math.random() - 0.5);
    
    const grid = document.getElementById('options-container');
    grid.innerHTML = "";
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'opt-btn';
        btn.textContent = opt;
        btn.onclick = () => checkAnswer(opt, btn);
        grid.appendChild(btn);
    });
    
    document.getElementById('feedback').textContent = "";
}

function checkAnswer(selected, btnEl) {
    const fb = document.getElementById('feedback');
    const allBtns = document.querySelectorAll('.opt-btn');
    allBtns.forEach(b => b.disabled = true);
    
    if (selected === currentCorrect) {
        score += 10;
        streak++;
        document.getElementById('score').textContent = score;
        document.getElementById('streak').textContent = streak;
        btnEl.style.background = "#22c55e";
        fb.style.color = "#4ade80";
        fb.textContent = "✅ ¡Exacto! ¡Muy bien visto!";
        robotSpeak("¡Muy bien!");
        setTimeout(generateClockChallenge, 1500);
    } else {
        btnEl.style.background = "#ef4444";
        fb.style.color = "#f87171";
        fb.textContent = `❌ Era las ${currentCorrect}. ¡Atención al formato 24h!`;
        robotSpeak(`Casi... la hora correcta era ${currentCorrect}. ¡Vamos a por la siguiente!`);
        setTimeout(generateClockChallenge, 3000);
    }
}

// Iniciar
generateClockChallenge();