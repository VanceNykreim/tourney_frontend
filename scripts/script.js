// scripts/script.js

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

document.addEventListener('DOMContentLoaded', () => {
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

    var webAuth = new auth0.WebAuth({
        domain: 'tournament-volleyball-byui-team1.us.auth0.com',
        clientID: 'GNnS4UxzQOzUvM6HVBuXxXuySZVd34ej',
        redirectUri: 'http://tournamentpageteam1bestteam.s3-website-us-east-1.amazonaws.com/callback',
        responseType: 'token id_token',
        scope: 'openid profile email'
      });
      
      function login() {
        webAuth.authorize();
      }
      
      function authenticateAndRedirect(url) {
        if (isAuthenticated()) {
          window.location.href = url;
        } else {
          login();
        }
      }
      
      function isAuthenticated() {
        var idToken = localStorage.getItem('idToken');
        return idToken ? true : false;
      }
      
      window.onload = function() {
        if (window.location.pathname === '/callback') {
          handleAuthCallback();
        }
      };
      
      function handleAuthCallback() {
        webAuth.parseHash(function(err, authResult) {
          if (authResult && authResult.accessToken && authResult.idToken) {
            window.location.hash = '';
            localStorage.setItem('accessToken', authResult.accessToken);
            localStorage.setItem('idToken', authResult.idToken);
            window.location.href = '/';
          } else if (err) {
            console.log(err);
          }
        });
      }
      
    
});
