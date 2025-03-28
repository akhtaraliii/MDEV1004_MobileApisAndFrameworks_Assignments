let username = localStorage.getItem('username') || '';

// Initialize username if stored
if (username) {
    document.getElementById('username').value = username;
}

// Set username
document.getElementById('setUsername').addEventListener('click', () => {
    username = document.getElementById('username').value;
    localStorage.setItem('username', username);
    fetchAnalytics();
});

// Function to track page visit without navigation
async function trackPageVisit(path) {
    try {
        await fetch(path);
        await trackButtonClick(path.substring(1) + '_visit'); // Track as a button click too
        fetchAnalytics(); // Refresh the analytics display
    } catch (error) {
        console.error('Error tracking page visit:', error);
    }
}

// Add click handlers to buttons
document.getElementById('homeBtn').addEventListener('click', async () => {
    await trackPageVisit('/hello');
});

document.getElementById('aboutBtn').addEventListener('click', async () => {
    await trackPageVisit('/about');
});

document.getElementById('refreshBtn').addEventListener('click', async () => {
    await trackButtonClick('refreshBtn');
    fetchAnalytics(); // Refresh the analytics display
});
