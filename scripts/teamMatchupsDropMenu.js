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

function getNextMatchNumber(currentMatchNumber) {
    const nextMatchNumbers = {
        1: 5,
        2: 5,
        3: 6,
        4: 6,
        5: 7,
        6: 7,
        7: 15,
        8: 12,
        9: 12,
        10: 13,
        11: 13,
        12: 14,
        13: 14,
        14: 15
    };
    return nextMatchNumbers[currentMatchNumber] || null;
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

        // Find the current match
        const currentMatch = data.matchups.find(match =>
            (match.team1_id === team1Seed && match.team2_id === team2Seed) ||
            (match.team1_id === team2Seed && match.team2_id === team1Seed)
        );

        // Display the current matchup
        const row = document.createElement('tr');
        const team1Cell = document.createElement('td');
        const team2Cell = document.createElement('td');
        const matchDateCell = document.createElement('td');

        team1Cell.textContent = team1 ? team1.name : 'Unknown Team 1';
        team2Cell.textContent = team2 ? team2.name : 'Unknown Team 2';
        matchDateCell.textContent = currentMatch ? currentMatch.match_date : 'Upcoming';

        row.appendChild(team1Cell);
        row.appendChild(team2Cell);
        row.appendChild(matchDateCell);
        tableBody.appendChild(row);

        // Display match history if available
        const historyMatches = data.matchups.filter(match =>
            (match.team1_id === team1Seed || match.team2_id === team1Seed || match.team1_id === team2Seed || match.team2_id === team2Seed)
            && match.match_id < (currentMatch ? currentMatch.match_id : Number.MAX_SAFE_INTEGER)
        );

        historyMatches.forEach(match => {
            const historyRow = document.createElement('tr');
            const historyTeam1Cell = document.createElement('td');
            const historyTeam2Cell = document.createElement('td');
            const historyDateCell = document.createElement('td');
            const historyScoreCell = document.createElement('td');

            const historyTeam1 = data.teams.find(team => team.seed_number === match.team1_id);
            const historyTeam2 = data.teams.find(team => team.seed_number === match.team2_id);

            historyTeam1Cell.textContent = historyTeam1 ? historyTeam1.name : 'Unknown';
            historyTeam2Cell.textContent = historyTeam2 ? historyTeam2.name : 'Unknown';
            historyDateCell.textContent = match.match_date || 'Unknown Date';
            historyScoreCell.textContent = match.score || 'No Score';

            historyRow.appendChild(historyTeam1Cell);
            historyRow.appendChild(historyTeam2Cell);
            historyRow.appendChild(historyDateCell);
            historyRow.appendChild(historyScoreCell);
            tableBody.appendChild(historyRow);
        });

        // Show the next match if the current match has a result
        if (currentMatch && currentMatch.score) {
            const nextMatchNumber = getNextMatchNumber(currentMatch.match_id);
            const nextMatch = data.matchups.find(match => match.match_id === nextMatchNumber);

            if (nextMatch) {
                const nextRow = document.createElement('tr');
                const nextTeam1Cell = document.createElement('td');
                const nextTeam2Cell = document.createElement('td');
                const nextMatchDateCell = document.createElement('td');

                const nextOpponentSeed = nextMatch.team1_id === team1Seed ? nextMatch.team2_id : nextMatch.team1_id;
                const nextOpponent = data.teams.find(team => team.seed_number === nextOpponentSeed);

                nextTeam1Cell.textContent = team1 ? team1.name : 'Unknown';
                nextTeam2Cell.textContent = nextOpponent ? nextOpponent.name : 'Unknown';
                nextMatchDateCell.textContent = nextMatch.match_date || 'Upcoming';

                nextRow.appendChild(nextTeam1Cell);
                nextRow.appendChild(nextTeam2Cell);
                nextRow.appendChild(nextMatchDateCell);
                tableBody.appendChild(nextRow);
            }
        }
    } catch (error) {
        console.error('Error filtering matches:', error);
    }
}

// Initialize dropdown and table on page load
document.addEventListener('DOMContentLoaded', populateTeamSelect);
