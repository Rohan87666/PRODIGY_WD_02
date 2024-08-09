let timerInterval;
let milliseconds = 0;
let seconds = 0;
let isRunning = false;
let lapTimes = JSON.parse(localStorage.getItem('lapTimes')) || [];

const display = document.getElementById('display');
const lapList = document.getElementById('lapList');
const lapNameInput = document.getElementById('lapName');
const startButton = document.getElementById('start');

startButton.addEventListener('click', toggleTimer);
document.getElementById('reset').addEventListener('click', resetTimer);
document.getElementById('lap').addEventListener('click', recordLap);
document.getElementById('download').addEventListener('click', downloadLaps);

function updateDisplay() {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    // Create display text with necessary components
    let displayText = '';
    
    if (hours > 0) {
        displayText += `${hours}:`;
    }
    if (minutes > 0 || hours > 0) { // Only show minutes if hours are present
        displayText += `${minutes}:`;
    }
    displayText += `${secs}`;

    if (milliseconds > 0) {
        const ms = Math.floor(milliseconds / 10); // Get milliseconds in tenths of seconds
        displayText += `:${ms}`; // Append ms directly, no leading zero
    }

    display.textContent = displayText;
}

function toggleTimer() {
    if (!isRunning) {
        isRunning = true;
        startButton.textContent = 'Stop'; // Change button text to Stop
        timerInterval = setInterval(() => {
            milliseconds += 10; // Increment milliseconds
            if (milliseconds >= 1000) { // If milliseconds exceed 1000ms, increment seconds
                milliseconds = 0;
                seconds++;
            }
            updateDisplay();
        }, 10); // Update every 10 milliseconds
    } else {
        isRunning = false;
        startButton.textContent = 'Start'; // Change button text back to Start
        clearInterval(timerInterval);
    }
}

function resetTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    milliseconds = 0;
    seconds = 0;
    updateDisplay();
    lapList.innerHTML = ''; // Clear lap times
    localStorage.removeItem('lapTimes'); // Clear local storage
    lapTimes = [];
    startButton.textContent = 'Start'; // Reset button text to Start
}

function recordLap() {
    if (isRunning) {
        const lapName = lapNameInput.value || `Lap ${lapList.children.length + 1}`;
        const lapTime = display.textContent; // Format: hh:mm:ss:ms
        
        const lapEntry = `${lapName}: ${lapTime}`;
        lapTimes.push(lapEntry);
        localStorage.setItem('lapTimes', JSON.stringify(lapTimes));

        const lapItem = document.createElement('li');
        lapItem.textContent = lapEntry;
        lapList.appendChild(lapItem);
        
        lapNameInput.value = ''; // Clear input field
        playSound(); // Play sound on lap record
    }
}

function downloadLaps() {
    const blob = new Blob([lapTimes.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lap_times.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function playSound() {
    const audio = new Audio('https://www.soundjay.com/button/sounds/button-16.mp3'); // Sound effect URL
    audio.play();
}

// Load saved lap times on page load
function loadLapTimes() {
    lapTimes.forEach(lap => {
        const lapItem = document.createElement('li');
        lapItem.textContent = lap;
        lapList.appendChild(lapItem);
    });
}

loadLapTimes();
updateDisplay();
