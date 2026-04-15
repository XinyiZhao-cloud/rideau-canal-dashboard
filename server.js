const express = require("express");
const path = require("path");
const { CosmosClient } = require("@azure/cosmos");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const cosmosClient = new CosmosClient({
    endpoint: process.env.COSMOS_ENDPOINT,
    key: process.env.COSMOS_KEY,
});

const database = cosmosClient.database(process.env.COSMOS_DATABASE);
const container = database.container(process.env.COSMOS_CONTAINER);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/api/latest", async (req, res) => {
    try {
        const querySpec = {
            query: `
        SELECT * FROM c
        ORDER BY c.windowend DESC
      `
        };

        const { resources } = await container.items.query(querySpec).fetchAll();

        const latestMap = {};

        for (const item of resources) {
            if (!latestMap[item.location]) {
                latestMap[item.location] = item;
            }
        }

        res.json(Object.values(latestMap));
    } catch (error) {
        console.error("Error fetching latest data:", error.message);
        res.status(500).json({ error: "Failed to fetch latest data" });
    }
});


app.get("/api/history", async (req, res) => {
    try {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

        const querySpec = {
            query: `
        SELECT c.location, c.windowend, c.avgicethickness, c.avgsurfacetemperature, c.safetystatus
        FROM c
        WHERE c.windowend >= @oneHourAgo
        ORDER BY c.windowend ASC
      `,
            parameters: [
                { name: "@oneHourAgo", value: oneHourAgo }
            ]
        };

        const { resources } = await container.items.query(querySpec).fetchAll();
        res.json(resources);
    } catch (error) {
        console.error("Error fetching history data:", error.message);
        res.status(500).json({ error: "Failed to fetch history data" });
    }
});


app.listen(PORT, () => {
    console.log(`Dashboard server running on http://localhost:${PORT}`);
});