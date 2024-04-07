"use client";

import { useEffect, useState } from "react";

const DateTimeConverter = (date: string) => {
  const [localDate, setLocalDate] = useState("");

  useEffect(() => {
    const adjustedDate = new Date(date);
    setLocalDate(adjustedDate.toLocaleString());
  }, [date]);

  return { localDate };
};

export default DateTimeConverter;
