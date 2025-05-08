import axios from "axios";

import React, { Component } from "react";
import { connect } from "react-redux";

class DisplayTimetable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    };
  }

  downloadCSV = () => {
    const { timeTable, maxPeriods } = this.props.timeTable;
    if (!timeTable || timeTable.length === 0) return;

    const days = this.state.days;
    const periods = Array.from({ length: maxPeriods }, (_, i) => `P${i + 1}`);

    let csv = "Days/Periods," + periods.join(",") + "\n";

    timeTable.forEach((classTimeTable, classIndex) => {
      // Find section name for the class
      const section = classTimeTable
        .flat()
        .find(cell => cell && cell.sections)?.sections?.[0] || `Class ${classIndex + 1}`;
      csv += `${section}\n`;

      classTimeTable.forEach((dayRow, dayIndex) => {
        let row = days[dayIndex];
        for (let i = 0; i < maxPeriods; i++) {
          const cell = dayRow[i];
          if (!cell || cell === 0) {
            row += ",-";
          } else {
            const subject = cell.subject || "Unknown";
            const teacher = cell.teacher || "Unknown";
            row += `,"${subject} (Faculty: ${teacher})"`;
          }
        }
        csv += row + "\n";
      });

      csv += "\n";
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "timetable.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  saveTimetableToDB = async () => {
    const { timeTable } = this.props.timeTable;
  
    if (!timeTable || timeTable.length === 0) {
      alert("No timetable to save.");
      return;
    }
  
    try {
      const response = await fetch("/api/timetable/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ timeTable })
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert("Timetable saved successfully!");
      } else {
        alert("Failed to save timetable: " + result.error);
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Error while saving timetable.");
    }
  };
  
  

  render() {
    const { timeTable } = this.props.timeTable;
    const periods = Array.from(Array(this.props.timeTable.maxPeriods).keys());
    const periodTimes = [
      "8:25AM - 9:30AM",
      "9:30AM - 10:25AM",
      "10:40AM - 11:35AM",
      "11:35AM - 12:30PM",
      "1:30PM - 2:25PM",
      "2:25PM - 3:20PM",
      "3:30PM - 4:25PM",
      "4:25PM - 5:20PM"
    ];

    const tt = timeTable ? (
      timeTable.map((el, index) => (
        <div key={index}>
          <h3>
            Class {
              el.map(row => row.find(cell => cell !== 0 && cell.sections && cell.sections[0]))
                .find(cell => cell)?.sections?.[0] || ""
            }
          </h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th style={{ fontSize: "25px" }}>Days/Periods</th>
                {periods.map(period => {
  return <th style={{ fontSize: "25px" }} key={period}>{periodTimes[period]}</th>
})}

              </tr>
            </thead>
            <tbody>
              {el.map((dayRow, dayIndex) => (
                <tr key={dayIndex}>
                  <th>{this.state.days[dayIndex]}</th>
                  {dayRow.map((cell, i) =>
                    cell === 0 ? (
                      <td key={i}>-</td>
                    ) : (
                      <td key={i}>
                        {cell.subject} (Faculty: {cell.teacher})
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={this.downloadCSV}
            className="btn btn-primary"
            style={{ marginBottom: "20px" }}
          >
            Download Timetable
          </button>
          <button
  onClick={this.saveTimetableToDB}
  className="btn btn-success"
  style={{ marginBottom: "20px", marginLeft: "10px" }}
>
  Save Timetable to DB
</button>

        </div>
      ))
    ) : (
      <div>
        <h3>Class</h3>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th style={{ fontSize: "25px" }}>Days/Periods</th>
              {["First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth"].map((label, i) => (
                <th key={i} style={{ fontSize: "25px" }}>{label}</th>
              ))}
            </tr>
          </thead>
          <tbody style={{ fontSize: "20px" }}>
            {this.state.days.map((day, i) => (
              <tr key={i}>
                <th>{day}</th>
                {Array(8).fill().map((_, j) => <td key={j}></td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    return (
      <div className="page display" style={{ marginTop: "100px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Timetables
        </h2>
        {tt}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  timeTable: state.timeTable,
  className: state.classes.className
});

export default connect(mapStateToProps, null)(DisplayTimetable);
