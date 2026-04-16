## CST8916: Final Project: Real-time Monitoring System for Rideau Canal Skateway
Student Name: Xinyi Zhao  
Student ID: 040953633  
Course: CST8916 Remote Data and Real-time Applications  
Semester: Winter 2026  

---
## Overview

| Endpoint  |   Returns  |
|:--| :---|
| /api/latest | 1 latest per location | 
| /api/history | multiple records over time | 

### GET /api/latest
Returns the most recent aggregated data for each location.

**Response Example:**
```json
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
Returns historical data for visualization.

**Response Example:**
```json
[
  {
    "location": "Dow's Lake",
    "windowend": "2026-04-15T16:30:00Z",
    "avgicethickness": 28.2
  },
  {
    "location": "Dow's Lake",
    "windowend": "2026-04-15T16:35:00Z",
    "avgicethickness": 29.1
  }
]
```




