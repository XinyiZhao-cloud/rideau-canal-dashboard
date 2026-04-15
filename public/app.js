let iceChart;

function statusClass(status) {
    return status.toLowerCase();
}

function renderCards(data) {
    const cardsContainer = document.getElementById("cards");
    cardsContainer.innerHTML = "";

    let overallStatus = "Safe";

    data.forEach(item => {
        if (item.safetyStatus === "Unsafe") {
            overallStatus = "Unsafe";
        } else if (item.safetyStatus === "Caution" && overallStatus !== "Unsafe") {
            overallStatus = "Caution";
        }

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
      <h3>${item.location}</h3>
      <div class="badge ${statusClass(item.safetyStatus)}">${item.safetyStatus}</div>
      <p><strong>Avg Ice Thickness:</strong> ${item.avgIceThickness} cm</p>
      <p><strong>Ice Range:</strong> ${item.minIceThickness} - ${item.maxIceThickness} cm</p>
      <p><strong>Avg Surface Temp:</strong> ${item.avgSurfaceTemperature} °C</p>
      <p><strong>Snow Accumulation:</strong> ${item.maxSnowAccumulation} cm</p>
      <p><strong>Avg External Temp:</strong> ${item.avgExternalTemperature} °C</p>
      <p><strong>Reading Count:</strong> ${item.readingCount}</p>
      <p><strong>Last Updated:</strong> ${new Date(item.timestamp).toLocaleString()}</p>
    `;

        cardsContainer.appendChild(card);
    });

    document.getElementById("system-status").textContent =
        `Overall System Status: ${overallStatus}`;
}

function renderChart(history) {
    const ctx = document.getElementById("iceChart").getContext("2d");

    const dowsLake = history.filter(x => x.location === "Dow's Lake");
    const fifthAvenue = history.filter(x => x.location === "Fifth Avenue");
    const nac = history.filter(x => x.location === "NAC");

    const labels = dowsLake.map(x =>
        new Date(x.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );

    if (iceChart) {
        iceChart.destroy();
    }

    iceChart = new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [
                {
                    label: "Dow's Lake",
                    data: dowsLake.map(x => x.avgIceThickness)
                },
                {
                    label: "Fifth Avenue",
                    data: fifthAvenue.map(x => x.avgIceThickness)
                },
                {
                    label: "NAC",
                    data: nac.map(x => x.avgIceThickness)
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true
        }
    });
}

async function loadDashboard() {
    const latestResponse = await fetch("/api/latest");
    const latestData = await latestResponse.json();
    renderCards(latestData);

    const historyResponse = await fetch("/api/history");
    const historyData = await historyResponse.json();
    renderChart(historyData);
}

loadDashboard();
setInterval(loadDashboard, 30000);