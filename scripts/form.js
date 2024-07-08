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
