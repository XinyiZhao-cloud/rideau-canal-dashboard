# CST8916: Final Project: Real-time Monitoring System for Rideau Canal Skateway

**Student Name**: Xinyi Zhao    
**Student ID**: 040953633    
**Course**: CST8916 Remote Data and Real-time Applications   
**Semester**: Winter 2026   

# Rideau Canal Skateway Monitoring Dashboard

## Overview

This project is a real-time monitoring system for the Rideau Canal skating conditions.  
It processes IoT sensor data using Azure services and visualizes the results through a web-based dashboard.  

The system provides insights into ice thickness, temperature, and safety conditions across multiple locations.  

## Dashboard Features
- Real-time system status updates
- Interactive charts showing ice thickness trends
- Location-based monitoring (Dow’s Lake, Fifth Avenue, NAC)
- Safety status indicators (Safe, Caution, Unsafe)
- Aggregated environmental metrics

## Technologies Used
- Node.js (Express)
- Azure Cosmos DB
- Azure Stream Analytics
- Azure IoT Hub
- Chart.js (data visualization)
- Azure Web App Service (deployment)

## Prerequisites
- Node.js (v20 or higher recommended)
- Azure Cosmos DB account
- Azure Stream Analytics job (running)
- Azure IoT Hub (for data ingestion)

## Installation
1. Get the GitHub repository ready in Visual Studio Code
```
git clone https://github.com/XinyiZhao-cloud/CST8916-Final-Project.git
cd CST8916-Final-Project
```
2.  Install dependencies
```
npm install
```
3. Configuration
Set the following environment variables (either locally or in Azure App Service):
```
PORT=3000
COSMOS_ENDPOINT=your_cosmos_endpoint
COSMOS_KEY=your_cosmos_key
COSMOS_DATABASE=RideauCanalDB
COSMOS_CONTAINER=SensorAggregations
```
⚠️ Note: _Sensitive credentials should not be committed to the repository._

## API Endpoints
### Get /api/latest
Returns the most recent aggregated data for each location.  
**Example Response**
```
[
  {
    "location": "Dow's Lake",
    "windowend": "2026-04-15T16:45:00Z",
    "avgicethickness": 30.5,
    "safetystatus": "Safe"
  }
]       
```
### GET /api/history
Returns historical data (last hour) for visualization.  
**Example Response**
```
[
  {
    "location": "Dow's Lake",
    "windowend": "2026-04-15T16:45:00Z",
    "avgicethickness": 30.5
  }
]
```

## Deployment to Azure App Service
### Step-by-step deployment
1. Create an Azure Web App
2.	Select Node.js runtime
3.	Connect the GitHub repository
4.	Configure environment variables in Azure
5.	Deploy using GitHub Actions

### Configuration Settings
In Azure App Service → Environment Variables:  
- COSMOS_ENDPOINT
- COSMOS_KEY
- COSMOS_DATABASE
- COSMOS_CONTAINER
- NODE_ENV
Ensure:  
- Node version is set correctly
- Startup command is configured:
```
node server.js
```

## Dashboard Features
### Real-time Updates
The dashboard refreshes data every 30 seconds using API calls to the backend.

### Charts and Visualizations
- Line chart displaying ice thickness trends over time
- Data grouped by location
- Rendered using Chart.js

### Safety Status Indicators
Safety status is calculated in Stream Analytics and displayed as:
- Green → Safe
- Yellow → Caution
- Red → Unsafe

The overall system status reflects the most critical condition among all locations.

### Troubleshooting

Issue: Dashboard shows no data
- Ensure Stream Analytics job is running
- Verify data exists in Cosmos DB
- Check API endpoints (/api/latest, /api/history)

### Issue: API errors
- Verify Cosmos DB connection settings
- Check environment variables
- Ensure backend server is running

## Issue: Deployment failure
- Check GitHub Actions logs
- Ensure Node version is supported
- Verify environment variables in Azure

## Notes
- Data is processed in real time using Azure Stream Analytics
- Cosmos DB is used for fast querying of aggregated results
- Blob Storage is used for historical data archiving
