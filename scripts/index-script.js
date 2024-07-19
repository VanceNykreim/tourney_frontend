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

        // Call the function to update the team tables on the page
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