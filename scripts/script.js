// JavaScript for countdown timer
function updateCountdown() {
    const now = new Date().getTime();
    const eventDate = new Date("2024-07-04T00:00:00").getTime();
    const remainingTime = eventDate - now;

    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

    document.getElementById("countdown").innerHTML = `Starts in: ${days} days ${hours} hrs ${minutes} min ${seconds} sec`;

    if (remainingTime < 0) {
        document.getElementById("countdown").innerHTML = "Tournament Started";
    }
}

setInterval(updateCountdown, 1000);

// JavaScript for dark mode toggle
const toggleDarkMode = document.getElementById('toggle-dark-mode');

toggleDarkMode.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// JavaScript to dynamically insert pool play results and bracket seeding
const poolResults = [
    { pool: 'A', team: 'Team A', wins: 3, losses: 1, points: 10 },
    { pool: 'A', team: 'Team B', wins: 2, losses: 2, points: 6 },
    { pool: 'B', team: 'Team C', wins: 1, losses: 3, points: 3 },
    { pool: 'B', team: 'Team D', wins: 4, losses: 0, points: 12 }
];

const bracketSeeding = [
    { bracket: 'Gold', team: 'Team A', seed: 1 },
    { bracket: 'Gold', team: 'Team B', seed: 2 },
    { bracket: 'Silver', team: 'Team C', seed: 1 },
    { bracket: 'Silver', team: 'Team D', seed: 2 }
];

const poolResultsTable = document.getElementById('pool-results');
const bracketSeedingTable = document.getElementById('bracket-seeding');

poolResults.forEach(result => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${result.pool}</td>
        <td>${result.team}</td>
        <td>${result.wins}</td>
        <td>${result.losses}</td>
        <td>${result.points}</td>
    `;
    poolResultsTable.appendChild(row);
});

bracketSeeding.forEach(seeding => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${seeding.bracket}</td>
        <td>${seeding.team}</td>
        <td>${seeding.seed}</td>
    `;
    bracketSeedingTable.appendChild(row);
});
