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
    const playerCount = document.querySelectorAll('.player-entry').length;
    if (playerCount < 30) { // Limit to 30 players
        const playerEntry = document.createElement('div');
        playerEntry.classList.add('player-entry');
        playerEntry.innerHTML = `
            <input type="number" name="jersey-number-${playerCount + 1}" placeholder="Jersey Number">
            <input type="text" name="player-name-${playerCount + 1}" placeholder="Player Name" pattern="\\w+ \\w+" title="Please enter first and last name">
        `;
        document.getElementById('players-list').appendChild(playerEntry);
    } else {
        alert('Maximum number of players reached.');
    }
});

document.getElementById('remove-player').addEventListener('click', function() {
    const playerCount = document.querySelectorAll('.player-entry').length;
    if (playerCount > 6) { // Minimum of 6 players required
        document.getElementById('players-list').lastElementChild.remove();
    } else {
        alert('You must have at least 6 players.');
    }
});

document.getElementById('coach-form').addEventListener('submit', function(event) {
    const players = [];
    let valid = true;

    document.querySelectorAll('.player-entry').forEach(entry => {
        const jerseyNumber = entry.querySelector('input[name^="jersey-number"]').value;
        const playerName = entry.querySelector('input[name^="player-name"]').value;
        const [firstName, lastName] = playerName.split(' ');

        if (!firstName || !lastName) {
            valid = false;
            entry.querySelector('input[name^="player-name"]').setCustomValidity("Please enter both first and last name");
        } else {
            entry.querySelector('input[name^="player-name"]').setCustomValidity("");
            players.push({ jerseyNumber, firstName, lastName });
        }
    });

    if (!valid) {
        event.preventDefault();
        document.getElementById('coach-form').reportValidity();
        return;
    }

    const coachName = document.getElementById('coach-name').value;
    const teamName = document.getElementById('team-name').value;
    const contactInfo = document.getElementById('contact-info').value;

    const data = {
        coachName,
        teamName,
        players,
        contactInfo
    };

    fetch('https://yutztibim3.execute-api.us-east-1.amazonaws.com/dev/coach-form', {
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

    event.preventDefault();
});
// scripts/script.js

// Function to fetch team and player data
async function fetchTeamData() {
    try {
        const response = await fetch('https://yutztibim3.execute-api.us-east-1.amazonaws.com/dev/teams', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Assuming the data format is:
        // {
        //     "teams": [
        //         {
        //             "teamName": "Team A",
        //             "coachName": "Coach A",
        //             "players": [
        //                 {"jerseyNumber": 1, "name": "Player A1"},
        //                 {"jerseyNumber": 2, "name": "Player A2"},
        //                 ...
        //             ]
        //         },
        //         ...
        //     ]
        // }

        updateTeamTables(data.teams);
    } catch (error) {
        console.error('Error fetching team data:', error);
    }
}

// Function to update the team tables on the page
function updateTeamTables(teams) {
    const teamTablesContainer = document.querySelector('.team-tables');

    teamTablesContainer.innerHTML = ''; // Clear any existing content

    teams.forEach(team => {
        const teamTable = document.createElement('div');
        teamTable.className = 'team-table';

        const teamName = document.createElement('h3');
        teamName.textContent = team.name;

        const coachName = document.createElement('p');
        coachName.textContent = `Coach: ${team.coach_name}`;

        const table = document.createElement('table');

        const thead = document.createElement('thead');
        const headRow = document.createElement('tr');
        const th1 = document.createElement('th');
        th1.textContent = 'Jersey Number';
        const th2 = document.createElement('th');
        th2.textContent = 'Player Name';
        headRow.appendChild(th1);
        headRow.appendChild(th2);
        thead.appendChild(headRow);

        const tbody = document.createElement('tbody');
        team.players.forEach(player => {
            const row = document.createElement('tr');
            const td1 = document.createElement('td');
            td1.textContent = player.jersey_number;
            const td2 = document.createElement('td');
            td2.textContent = player.name;
            row.appendChild(td1);
            row.appendChild(td2);
            tbody.appendChild(row);
        });

        table.appendChild(thead);
        table.appendChild(tbody);

        teamTable.appendChild(teamName);
        teamTable.appendChild(coachName);
        teamTable.appendChild(table);

        teamTablesContainer.appendChild(teamTable);
    });
}

// Call the function to fetch and display team data when the page loads
fetchTeamData();

// Optional: Add event listener for the dark mode toggle
document.getElementById('toggle-dark-mode').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});
