document.addEventListener('DOMContentLoaded', (event) => {
    // Dummy data for teams and matches
    const teams = [
        { id: 1, name: 'Team A' },
        { id: 2, name: 'Team B' },
        { id: 3, name: 'Team C' },
    ];

    const matches = [
        { id: 1, team1: 1, team2: 2, team1Name: 'Team A', team2Name: 'Team B', date: '2024-07-20' },
        { id: 2, team1: 2, team2: 3, team1Name: 'Team B', team2Name: 'Team C', date: '2024-07-21' },
        { id: 3, team1: 1, team2: 3, team1Name: 'Team A', team2Name: 'Team C', date: '2024-07-22' },
    ];

    const teamSelect = document.getElementById('teamSelect');
    const matchTableBody = document.querySelector('#matchTable tbody');

    // Populate the dropdown with teams
    teams.forEach(team => {
        const option = document.createElement('option');
        option.value = team.id;
        option.textContent = team.name;
        teamSelect.appendChild(option);
    });

    // Function to filter matches based on selected team
    window.filterMatches = function () {
        const selectedTeam = parseInt(teamSelect.value);
        matchTableBody.innerHTML = '';

        const filteredMatches = matches.filter(match => match.team1 === selectedTeam || match.team2 === selectedTeam);

        filteredMatches.forEach(match => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${match.team1Name}</td>
                <td>${match.team2Name}</td>
                <td>${new Date(match.date).toLocaleDateString()}</td>
            `;
            matchTableBody.appendChild(row);
        });
    };
});
