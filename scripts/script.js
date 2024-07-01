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
