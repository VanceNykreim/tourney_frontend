document.addEventListener('DOMContentLoaded', async () => {
    const tournamentIdInput = document.getElementById('tournament-id');
    tournamentIdInput.addEventListener('change', fetchTeams);
});

async function fetchTeams() {
    const tournamentId = document.getElementById('tournament-id').value;
    const team1Select = document.getElementById('team1-id');
    const team2Select = document.getElementById('team2-id');

    if (tournamentId) {
        const response = await fetch(`https://yutztibim3.execute-api.us-east-1.amazonaws.com/dev/get-teams?tournamentId=${tournamentId}`);
        if (response.ok) {
            const teams = await response.json();
            team1Select.innerHTML = '';
            team2Select.innerHTML = '';
            teams.forEach(team => {
                const option1 = document.createElement('option');
                option1.value = team.id;
                option1.textContent = team.name;
                team1Select.appendChild(option1);

                const option2 = document.createElement('option');
                option2.value = team.id;
                option2.textContent = team.name;
                team2Select.appendChild(option2);
            });
        } else {
            alert('Failed to fetch teams.');
        }
    }
}

async function submitForm() {
    const form = document.getElementById('scorekeeper-form');
    const formData = new FormData(form);

    const data = {
        scorekeeperName: formData.get('scorekeeper-name'),
        matchDate: formData.get('match-date'),
        tournamentId: formData.get('tournament-id'),
        courtNumber: formData.get('court-number'),
        team1Id: formData.get('team1-id'),
        team2Id: formData.get('team2-id'),
        scores: [
            { team: 'team1', set1: formData.get('team1-set1'), set2: formData.get('team1-set2'), set3: formData.get('team1-set3') || null },
            { team: 'team2', set1: formData.get('team2-set1'), set2: formData.get('team2-set2'), set3: formData.get('team2-set3') || null },
        ],
        comments: formData.get('comments'),
    };

    const response = await fetch('https://yutztibim3.execute-api.us-east-1.amazonaws.com/dev/submit-scorekeeper-form', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (response.ok) {
        alert('Form submitted successfully!');
    } else {
        alert('Failed to submit form.');
    }
}
