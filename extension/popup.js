chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
  const url = tabs[0].url;
  document.getElementById('url').innerText = url;

  const statusEl = document.getElementById('status');
  statusEl.innerText = "🔍 AI Analyzing...";
  statusEl.className = "status loading";

  try {
    const response = await fetch('http://localhost:5001/api/analyze-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: url })
    });

    const data = await response.json();

    if (data.prediction === "Phishing") {
      statusEl.innerText = "❌ DANGER: PHISHING DETECTED!";
      statusEl.className = "status danger";
    } else {
      statusEl.innerText = "✅ SAFE: NO THREATS DETECTED";
      statusEl.className = "status safe";
    }
  } catch (err) {
    statusEl.innerText = "⚠️ Backend Offline";
    statusEl.className = "status suspicious";
  }
});
