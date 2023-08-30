import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { isSameDay } from "date-fns";
import React, { useState } from "react";

// Define the structure of each date entry
interface DateEntry {
  date: string;
  status: "h" | "i" | "s" | "a"; // Possible status values
}

// Define the props for the Calendar component
interface CalendarProps {
  year: number;
  month: number;
  dates?: DateEntry[]; // Optional array of DateEntry
}

const Calendar: React.FC<CalendarProps> = ({ year, month, dates = [] }) => {
  // Input validation: Ensure month is between 1 and 12
  if (month < 1 || month > 12) {
    throw new Error("Month must be between 1 and 12.");
  }

  // State to keep track of the current month being displayed
  const [currentMonth, setCurrentMonth] = useState(month);

  // Calculate important date values
  const firstDay = new Date(year, currentMonth - 1, 1);
  const lastDay = new Date(year, currentMonth, 0);
  const daysInMonth = lastDay.getDate();
  const startDay = firstDay.getDay();

  // Map status values to background colors
  const getStatusColor = (status: "h" | "i" | "s" | "a"): string => {
    switch (status) {
      case "h":
        return "bg-green-500";
      case "i":
        return "bg-orange-500";
      case "s":
        return "bg-yellow-500";
      case "a":
        return "bg-red-500";
      default:
        return "";
    }
  };

  // Render the weekday labels
  const renderWeekdays = (): JSX.Element[] => {
    const weekdays = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
    return weekdays.map((day) => (
      <div key={day} className='font-medium'>
        {day}
      </div>
    ));
  };

  // Render the days of the month
  const renderDays = (): JSX.Element[] => {
    const days: JSX.Element[] = [];
    const currentDate = new Date(year, currentMonth - 1, new Date().getDate()); // Get the current date

    let dayCounter = 1;
    let prevMonthDays = new Date(year, currentMonth - 1, 0).getDate();

    // Loop through each week (rows)
    for (let i = 0; i < 6; i++) {
      const week: JSX.Element[] = [];
      // Loop through each day in the week (columns)
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < startDay) {
          // Render days from the previous month
          week.push(
            <div
              key={`prev-${j}`}
              className={`py-0.5 rounded relative text-gray-400`}>
              {prevMonthDays - startDay + j + 1}
            </div>
          );
        } else if (dayCounter <= daysInMonth) {
          // Calculate the date string in the format 'YYYY-MM-DD'
          const dateStr = `${year}-${currentMonth
            .toString()
            .padStart(2, "0")}-${dayCounter.toString().padStart(2, "0")}`;
          // Find a matching date entry from the dates prop
          const dateEntry = dates.find((d) => d.date === dateStr);
          // Get the background color class based on the status
          const statusClass = dateEntry ? getStatusColor(dateEntry.status) : "";
          const isCurrentDate = isSameDay(
            currentDate,
            new Date(year, currentMonth - 1, dayCounter)
          ); // Check if it's the current date

          // Render the day element
          week.push(
            <div
              key={dayCounter}
              className={`py-0.5 rounded relative ${
                j === 6
                  ? "text-red-500"
                  : isCurrentDate
                  ? "font-bold text-blue-500"
                  : "text-black"
              } ${statusClass}`}>
              {dayCounter}
            </div>
          );
          dayCounter++;
        } else {
          // Render days from the next month
          week.push(
            <div
              key={`next-${j}`}
              className={`py-0.5 rounded relative text-gray-400`}>
              {dayCounter - daysInMonth}
            </div>
          );
          dayCounter++;
        }
      }
      // Push the week element to the days array
      days.push(
        <div key={i} className='grid grid-cols-7 gap-4 mt-1 text-center'>
          {week}
        </div>
      );
      // Break if all days have been rendered
      if (dayCounter > daysInMonth + 1) {
        break;
      }
    }

    return days;
  };

  // Function to navigate to the previous month
  const goToPreviousMonth = (): void => {
    setCurrentMonth((prevMonth) => prevMonth - 1);
  };

  // Function to navigate to the next month
  const goToNextMonth = (): void => {
    setCurrentMonth((prevMonth) => prevMonth + 1);
  };

  // Component rendering
  return (
    <div className='calendar'>
      <div className='text-xl font-bold mb-4 text-center flex justify-between items-center'>
        <button onClick={goToPreviousMonth} className='text-gray-600'>
          {/* using chevron */}
          <IconChevronLeft />
        </button>
        <div>
          {firstDay.toLocaleDateString("id-ID", {
            month: "long",
            year: "numeric",
          })}
        </div>
        <button onClick={goToNextMonth} className='text-gray-600'>
          <IconChevronRight />
        </button>
      </div>
      <div className='grid grid-cols-7 gap-4 mt-5 text-center'>
        {renderWeekdays()}
      </div>
      {renderDays()}
    </div>
  );
};

export default Calendar;
