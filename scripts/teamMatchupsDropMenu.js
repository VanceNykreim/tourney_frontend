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

const seedMatchups = {
    1: 16, 16: 1,
    2: 15, 15: 2,
    3: 14, 14: 3,
    4: 13, 13: 4,
    5: 9,  9: 5,
    6: 10, 10: 6,
    7: 11, 11: 7,
    8: 12, 12: 8
};

function getMatchupBySeed(seed) {
    const opponentSeed = seedMatchups[seed];
    return {
        team1Seed: seed,
        team2Seed: opponentSeed
    };
}

function getFirstMatchup() {
    return {
        team1Seed: 1,
        team2Seed: 16,
        match_date: '2024-07-18' // Example date, modify as needed
    };
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

        const { team1Seed, team2Seed } = getMatchupBySeed(teamData.seed_number);

        // Find the names of the teams based on their seeds
        const team1 = data.teams.find(team => team.seed_number === team1Seed);
        const team2 = data.teams.find(team => team.seed_number === team2Seed);

        const firstMatchup = getFirstMatchup();
        const matchDate = firstMatchup.match_date; // Use a default date if no matches are found

        const row = document.createElement('tr');
        const team1Cell = document.createElement('td');
        const team2Cell = document.createElement('td');
        const matchDateCell = document.createElement('td');

        team1Cell.textContent = team1 ? team1.name : 'Unknown Team 1';
        team2Cell.textContent = team2 ? team2.name : 'Unknown Team 2';
        matchDateCell.textContent = matchDate;

        row.appendChild(team1Cell);
        row.appendChild(team2Cell);
        row.appendChild(matchDateCell);
        tableBody.appendChild(row);
    } catch (error) {
        console.error('Error filtering matches:', error);
    }
}

// Initialize dropdown and table on page load
document.addEventListener('DOMContentLoaded', populateTeamSelect);
