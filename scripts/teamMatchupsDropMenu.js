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

        data.teams.forEach(team => {
            teams.add(team.name);
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

function getMatchNumber(seed) {
    const matchNumbers = {
        1: 1, 16: 1,
        2: 8, 15: 8,
        3: 3, 14: 3,
        4: 10, 13: 10,
        5: 2, 12: 2,
        6: 9, 11: 9,
        7: 4, 10: 4,
        8: 11, 9: 11
    };
    return matchNumbers[seed] || null;
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
        const teamData = data.teams.find(team => team.name === selectedTeam);
        if (!teamData) {
            throw new Error('Selected team not found');
        }

        const matchNumber = getMatchNumber(teamData.seed_number);
        const filteredMatches = data.matchups.filter(match => match.match_id === matchNumber);

        if (filteredMatches.length === 0) {
            throw new Error('No matches found for the selected team');
        }

        filteredMatches.forEach(match => {
            const row = document.createElement('tr');
            const team1Cell = document.createElement('td');
            const team2Cell = document.createElement('td');
            const matchDateCell = document.createElement('td');

            const team1 = data.teams.find(team => team.team_id === match.team1_id);
            const team2 = data.teams.find(team => team.team_id === match.team2_id);

            team1Cell.textContent = team1.name;
            team2Cell.textContent = team2.name;
            matchDateCell.textContent = match.match_date;

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
