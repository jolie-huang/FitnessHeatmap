import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import Heatmap from "react-calendar-heatmap";
import { Tooltip } from "react-tooltip";
import "react-calendar-heatmap/dist/styles.css";
import "react-tooltip/dist/react-tooltip.css";
import "./Heatmap.css";

const HeatmapComponent = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    //Loading and parsing csv file
    Papa.parse(process.env.PUBLIC_URL + "/data.csv", {
      download: true,
      header: true,
      complete: (result) => {
        const heatmapData = result.data.map((row) => ({
          date: row.Date,
          calories: parseInt(row.Calories, 10),
          steps: parseInt(row.Steps, 10),
          distance: parseFloat(row["Distance in miles"]),
        }));
        setData(heatmapData);
      },
    });
  }, []);

  const getClassForValue = (value) => {
    if (!value || value.calories === 0) return "color-empty";
    if (value.calories < 50) return "color-scale-1";
    if (value.calories < 100) return "color-scale-2";
    if (value.calories < 200) return "color-scale-3";
    return "color-scale-4";
  };

  const months = [
    "2023-10",
    "2023-11",
    "2023-12",
    "2024-01",
    "2024-02",
    "2024-03",
    "2024-04",
    "2024-05",
    "2024-06",
    "2024-07",
    "2024-08",
    "2024-09",
    "2024-10",
    "2024-11",
  ];

  return (
    <div className="heatmap-container">
      <h1>Activity Heatmap</h1>
      <div className="heatmap-grid">
        {months.map((month) => {
          const [year, monthNumber] = month.split("-");
          const startDate = new Date(year, parseInt(monthNumber) - 1, 1);
          const endDate = new Date(year, parseInt(monthNumber), 0); // Last day of the month

          return (
            <div key={month} className="month-heatmap">
              <h2>
                {startDate.toLocaleString("default", { month: "long" })}{" "}
                {startDate.getFullYear()}
              </h2>
              <Heatmap
                startDate={startDate}
                endDate={endDate}
                values={data.map((d) => ({
                  date: d.date,
                  calories: d.calories,
                  steps: d.steps,
                  distance: d.distance,
                }))}
                classForValue={getClassForValue}
                tooltipDataAttrs={(value) => {
                  if (!value) return null; // Handle empty values
                  return {
                    "data-tooltip-id": "heatmap-tooltip",
                    "data-tooltip-content": `
                      Date: ${value.date || "N/A"},
                      Calories: ${value.calories || 0},
                      Steps: ${value.steps || 0},
                      Distance: ${value.distance?.toFixed(2) || 0} mi
                    `,
                  };
                }}
              />
            </div>
          );
        })}
        <Tooltip id="heatmap-tooltip" />
      </div>
    </div>
  );
};

export default HeatmapComponent;

