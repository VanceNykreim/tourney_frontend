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

const toggleDarkMode = document.getElementById('toggle-dark-mode');

toggleDarkMode.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

document.getElementById('add-player').addEventListener('click', function() {
    const playerCount = document.querySelectorAll('.player-entry').length + 1;
    const playerEntry = document.createElement('div');
    playerEntry.classList.add('player-entry');
    playerEntry.innerHTML = `
        <input type="number" name="jersey-number-${playerCount}" placeholder="Jersey Number" required>
        <input type="text" name="player-name-${playerCount}" placeholder="Player Name" pattern="\\w+ \\w+" title="Please enter first and last name" required>
    `;
    document.getElementById('players-list').appendChild(playerEntry);
});

document.getElementById('coach-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const coachName = document.getElementById('coach-name').value;
    const teamName = document.getElementById('team-name').value;
    const contactInfo = document.getElementById('contact-info').value;

    const players = [];
    document.querySelectorAll('.player-entry').forEach(entry => {
        const jerseyNumber = entry.querySelector('input[name^="jersey-number"]').value;
        const playerName = entry.querySelector('input[name^="player-name"]').value;
        const [firstName, lastName] = playerName.split(' ');
        if (!firstName || !lastName) {
            alert('Please enter both first and last name for each player.');
            return;
        }
        players.push({ jerseyNumber, firstName, lastName });
    });

    const data = {
        coachName,
        teamName,
        players,
        contactInfo
    };

    fetch('https://your-api-gateway-endpoint.amazonaws.com/your-lambda-function', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        alert('Team information submitted successfully!');
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred while submitting the information.');
    });
});
