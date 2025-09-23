
// Discord invite URL - replace with your actual Discord invite link
const DISCORD_INVITE_URL = 'https://discord.gg/REPLACE-WITH-YOUR-INVITE-CODE';

// Get audio element
const audio = document.getElementById('backgroundMusic');

// Flag to track if music is playing
let musicPlaying = false;

// Function to play music
function playMusic() {
    if (!musicPlaying) {
        // Create a simple audio context for web audio
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Try to play the audio element first
        audio.play().catch(() => {
            // If audio element fails, create a simple beep sound
            createBeepSound(audioContext);
        });

        musicPlaying = true;
        console.log('Music started playing');
    }
}

// Function to create a simple beep sound using Web Audio API
function createBeepSound(audioContext) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1);
}

// Function to open Discord invite
function openDiscord() {
    window.open(DISCORD_INVITE_URL, '_blank');
    console.log('Discord invite opened');
}

// Add click event listener to the entire document
document.addEventListener('click', function(event) {
    // Prevent default behavior
    event.preventDefault();

    // Play music
    playMusic();

    // Open Discord invite
    openDiscord();

    // Add visual feedback
    document.body.style.transform = 'scale(0.98)';
    setTimeout(() => {
        document.body.style.transform = 'scale(1)';
    }, 100);
});

// Add some visual effects on mouse move
document.addEventListener('mousemove', function(event) {
    const container = document.querySelector('.container');
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    const rotateX = (y / rect.height) * 10;
    const rotateY = (x / rect.width) * 10;

    container.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
});

// Reset transform when mouse leaves
document.addEventListener('mouseleave', function() {
    const container = document.querySelector('.container');
    container.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
});

// Add keyboard support
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' || event.code === 'Enter') {
        event.preventDefault();
        playMusic();
        openDiscord();
    }
});

console.log('Site loaded! Click anywhere to play music and open Discord.');
