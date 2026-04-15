let iceChart;

function statusClass(status) {
    return (status || "").toLowerCase();
}

function normalizeItem(item) {
    return {
        location: item.location,
        timestamp: item.windowend || item.windowEnd,
        avgIceThickness: item.avgicethickness ?? item.avgIceThickness,
        minIceThickness: item.minicethickness ?? item.minIceThickness,
        maxIceThickness: item.maxicethickness ?? item.maxIceThickness,
        avgSurfaceTemperature: item.avgsurfacetemperature ?? item.avgSurfaceTemperature,
        minSurfaceTemperature: item.minsurfacetemperature ?? item.minSurfaceTemperature,
        maxSurfaceTemperature: item.maxsurfacetemperature ?? item.maxSurfaceTemperature,
        maxSnowAccumulation: item.maxsnowaccumulation ?? item.maxSnowAccumulation,
        avgExternalTemperature: item.avgexternaltemperature ?? item.avgExternalTemperature,
        readingCount: item.readingcount ?? item.readingCount,
        safetyStatus: item.safetystatus ?? item.safetyStatus
    };
}

function renderCards(data) {
    const cardsContainer = document.getElementById("cards");
    cardsContainer.innerHTML = "";

    let overallStatus = "Safe";

    data.forEach(raw => {
        const item = normalizeItem(raw);

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
      <p><strong>Ice Range:</strong> ${item.minIceThickness.toFixed(2)} - ${item.maxIceThickness} cm</p>
      <p><strong>Avg Surface Temp:</strong> ${item.avgSurfaceTemperature.toFixed(2)} °C</p>
      <p><strong>Snow Accumulation:</strong> ${item.maxSnowAccumulation} cm</p>
      <p><strong>Avg External Temp:</strong> ${item.avgExternalTemperature.toFixed(2)} °C</p>
      <p><strong>Reading Count:</strong> ${item.readingCount}</p>
      <p><strong>Last Updated:</strong> ${new Date(item.timestamp).toLocaleString()}</p>
    `;

        cardsContainer.appendChild(card);
    });

    document.getElementById("system-status").textContent =
        `Overall System Status: ${overallStatus}`;
}

function renderChart(history) {
    const normalized = history.map(normalizeItem);
    const ctx = document.getElementById("iceChart").getContext("2d");

    const dowsLake = normalized.filter(x => x.location === "Dow's Lake");
    const fifthAvenue = normalized.filter(x => x.location === "Fifth Avenue");
    const nac = normalized.filter(x => x.location === "NAC");

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
    try {
        const latestResponse = await fetch("/api/latest");
        const latestData = await latestResponse.json();
        renderCards(latestData);

        const historyResponse = await fetch("/api/history");
        const historyData = await historyResponse.json();
        renderChart(historyData);
    } catch (error) {
        console.error("Dashboard load failed:", error);
        document.getElementById("system-status").textContent =
            "Failed to load dashboard data.";
    }
}

loadDashboard();
setInterval(loadDashboard, 30000);