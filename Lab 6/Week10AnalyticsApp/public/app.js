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

// Track button clicks
async function trackButtonClick(buttonId) {
    try {
        const response = await fetch('/api/track-button', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                buttonId,
                username,
                timestamp: new Date()
            })
        });
        if (response.ok) {
            fetchAnalytics();
        }
    } catch (error) {
        console.error('Error tracking button click:', error);
    }
}

// Fetch analytics data
async function fetchAnalytics() {
    try {
        const [pageData, buttonData] = await Promise.all([
            fetch('/analytics').then(res => res.json()),
            fetch('/api/button-analytics').then(res => res.json())
        ]);

        displayPageAnalytics(pageData);
        displayButtonAnalytics(buttonData);
    } catch (error) {
        console.error('Error fetching analytics:', error);
    }
}

// Display page analytics
function displayPageAnalytics(data) {
    const container = document.getElementById('pageHits');
    container.innerHTML = data.map(item => `
        <div class="analytics-item">
            <strong>Endpoint:</strong> ${item.endpoint}<br>
            <strong>Total Hits:</strong> ${item.hits}<br>
            <strong>Last Visit:</strong> ${new Date(item.timestamps[item.timestamps.length - 1]).toLocaleString()}
        </div>
    `).join('');
}

// Display button analytics
function displayButtonAnalytics(data) {
    const container = document.getElementById('buttonClicks');
    container.innerHTML = data.map(item => `
        <div class="analytics-item">
            <strong>Button:</strong> ${item.buttonId}<br>
            <strong>Clicked by:</strong> ${item.username || 'Anonymous'}<br>
            <strong>Time:</strong> ${new Date(item.timestamp).toLocaleString()}
        </div>
    `).join('');
}

// Initial fetch
fetchAnalytics();
// Refresh every 30 seconds
setInterval(fetchAnalytics, 30000);