/**
 * CST8916 Final Project - Dashboard Backend API
 *
 * Author: Xinyi Zhao
 * Student ID: 040953633
 * Course: CST8916 Remote Data and Real-time Applications
 * Semester: Winter 2026
 *
 * Description:
 * This server provides RESTful API endpoints for the Rideau Canal
 * real-time monitoring dashboard. It retrieves processed data from
 * Azure Cosmos DB and serves it to the frontend for visualization.
 *
 * Features:
 * - Retrieves latest aggregated data per location
 * - Provides historical data for chart visualization
 * - Connects to Azure Cosmos DB
 * - Serves static frontend files
 *
 * Note:
 * Sensitive credentials are stored in environment variables and are not included in this file.
 */
const express = require("express");
const path = require("path");
const { CosmosClient } = require("@azure/cosmos");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Cosmos DB client using environment variables
const cosmosClient = new CosmosClient({
    endpoint: process.env.COSMOS_ENDPOINT,
    key: process.env.COSMOS_KEY,
});

// Reference database and container
const database = cosmosClient.database(process.env.COSMOS_DATABASE);
const container = database.container(process.env.COSMOS_CONTAINER);

// Middleware setup
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

/**
 * GET /api/latest
 * Returns the most recent aggregated data for each location.
 */
app.get("/api/latest", async (req, res) => {
    try {
        // Query all data ordered by newest first
        const querySpec = {
            query: `
        SELECT * FROM c
        ORDER BY c.windowend DESC
      `
        };

        const { resources } = await container.items.query(querySpec).fetchAll();

        // Extract latest record per location
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

/**
 * GET /api/history
 * Returns recent historical data for visualization (latest 50 records).
 */
app.get("/api/history", async (req, res) => {
    try {
        // Query latest 50 records from Cosmos DB
        const querySpec = {
            query: `
                SELECT TOP 50
                    c.location,
                    c.windowend,
                    c.avgicethickness,
                    c.avgsurfacetemperature,
                    c.safetystatus
                FROM c
                ORDER BY c.windowend DESC
            `
        };

        const { resources } = await container.items.query(querySpec).fetchAll();

        // Sort results in ascending order for chart display
        const sorted = resources.sort(
            (a, b) => new Date(a.windowend) - new Date(b.windowend)
        );

        res.json(sorted);
    } catch (error) {
        console.error("Error fetching history data:", error.message);
        res.status(500).json({ error: "Failed to fetch history data" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Dashboard server running on http://localhost:${PORT}`);
});