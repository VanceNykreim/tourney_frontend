// teamMatchupsDropMenu.js

async function fetchTableData() {
    const response = await fetch('https://yutztibim3.execute-api.us-east-1.amazonaws.com/dev/table-build');
    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }
    return await response.json();
}

async function populateTeamSelect() {
    try {
        const data = await fetchTableData();
        const teamSelect = document.getElementById('teamSelect');
        const teams = new Set();

        data.forEach(match => {
            teams.add(match.team1);
            teams.add(match.team2);
        });

        teams.forEach(team => {
            const option = document.createElement('option');
            option.value = team;
            option.textContent = team;
            teamSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching table data:', error);
    }
}

async function filterMatches() {
    const selectedTeam = document.getElementById('teamSelect').value;
    const tableBody = document.getElementById('matchTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear the table

    if (selectedTeam === '') {
        return;
    }

    try {
        const data = await fetchTableData();
        const filteredMatches = data.filter(match => match.team1 === selectedTeam || match.team2 === selectedTeam);

        filteredMatches.forEach(match => {
            const row = document.createElement('tr');
            const team1Cell = document.createElement('td');
            const team2Cell = document.createElement('td');
            const matchDateCell = document.createElement('td');

            team1Cell.textContent = match.team1;
            team2Cell.textContent = match.team2;
            matchDateCell.textContent = match.date;

            row.appendChild(team1Cell);
            row.appendChild(team2Cell);
            row.appendChild(matchDateCell);
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error filtering matches:', error);
    }
}

// Initialize dropdown and table on page load
document.addEventListener('DOMContentLoaded', populateTeamSelect);
