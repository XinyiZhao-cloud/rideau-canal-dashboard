const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Temporary mock API for local development
app.get("/api/latest", (req, res) => {
    res.json([
        {
            location: "Dow's Lake",
            timestamp: new Date().toISOString(),
            avgIceThickness: 31.2,
            minIceThickness: 30.1,
            maxIceThickness: 32.4,
            avgSurfaceTemperature: -3.5,
            minSurfaceTemperature: -4.2,
            maxSurfaceTemperature: -2.8,
            maxSnowAccumulation: 2.1,
            avgExternalTemperature: -6.0,
            readingCount: 30,
            safetyStatus: "Safe"
        },
        {
            location: "Fifth Avenue",
            timestamp: new Date().toISOString(),
            avgIceThickness: 26.8,
            minIceThickness: 25.9,
            maxIceThickness: 27.5,
            avgSurfaceTemperature: -0.4,
            minSurfaceTemperature: -1.2,
            maxSurfaceTemperature: 0.3,
            maxSnowAccumulation: 4.6,
            avgExternalTemperature: -2.1,
            readingCount: 30,
            safetyStatus: "Caution"
        },
        {
            location: "NAC",
            timestamp: new Date().toISOString(),
            avgIceThickness: 22.3,
            minIceThickness: 21.8,
            maxIceThickness: 23.0,
            avgSurfaceTemperature: 1.5,
            minSurfaceTemperature: 0.9,
            maxSurfaceTemperature: 2.0,
            maxSnowAccumulation: 5.2,
            avgExternalTemperature: 1.8,
            readingCount: 30,
            safetyStatus: "Unsafe"
        }
    ]);
});

app.get("/api/history", (req, res) => {
    const now = Date.now();
    const history = [];

    const locations = [
        { name: "Dow's Lake", base: 31 },
        { name: "Fifth Avenue", base: 27 },
        { name: "NAC", base: 23 }
    ];

    for (const location of locations) {
        for (let i = 11; i >= 0; i--) {
            history.push({
                location: location.name,
                timestamp: new Date(now - i * 5 * 60 * 1000).toISOString(),
                avgIceThickness: Number((location.base + (Math.random() * 2 - 1)).toFixed(1)),
                avgSurfaceTemperature: Number((-3 + Math.random() * 5).toFixed(1)),
                safetyStatus:
                    location.base >= 30 ? "Safe" :
                        location.base >= 25 ? "Caution" : "Unsafe"
            });
        }
    }

    res.json(history);
});

app.listen(PORT, () => {
    console.log(`Dashboard server running on http://localhost:${PORT}`);
});