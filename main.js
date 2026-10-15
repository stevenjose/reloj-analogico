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

function generateClockChallenge() {
    // Generar minutos (0, 15, 30, 45) como en el PDF
    const minutesOptions = [0, 15, 30, 45];
    const minute = minutesOptions[Math.floor(Math.random() * minutesOptions.length)];
    // Generar hora 24h (0 a 23)
    const hour24 = Math.floor(Math.random() * 24);
    
    // Mover manecillas visuales (formato 12h)
    const displayHour = hour24 % 12 || 12;
    const hourAngle = (displayHour * 30) + (minute * 0.5);
    const minuteAngle = minute * 6;
    
    document.getElementById('hour-hand').style.transform = `rotate(${hourAngle}deg)`;
    document.getElementById('min-hand').style.transform = `rotate(${minuteAngle}deg)`;

    // Formatear hora correcta ej: "15:30" o "08:15"
    currentCorrect = `${String(hour24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    
    // Generar 3 distractores
    let options = [currentCorrect];
    while(options.length < 4) {
        let fakeH = String(Math.floor(Math.random() * 24)).padStart(2, '0');
        let fakeM = String(minutesOptions[Math.floor(Math.random() * minutesOptions.length)]).padStart(2, '0');
        let fakeTime = `${fakeH}:${fakeM}`;
        if(!options.includes(fakeTime)) options.push(fakeTime);
    }
    
    options.sort(() => Math.random() - 0.5); // Barajar
    
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
        btnEl.style.background = "#22c55e"; // Verde acierto
        fb.style.color = "#4ade80";
        fb.textContent = "✅ ¡Perfecto! Esa es la hora.";
        robotSpeak("¡Muy bien!");
        setTimeout(generateClockChallenge, 1500);
    } else {
        btnEl.style.background = "#ef4444"; // Rojo fallo
        fb.style.color = "#f87171";
        fb.textContent = `❌ ¡Uy! La hora correcta era ${currentCorrect}.`;
        robotSpeak(`Casi... fíjate que la hora real era ${currentCorrect}. ¡Prueba con la siguiente!`);
        setTimeout(generateClockChallenge, 3000);
    }
}

// Iniciar
generateClockChallenge();