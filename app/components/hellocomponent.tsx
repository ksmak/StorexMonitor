"use client";

import { useState, useEffect } from "react";

const HelloComponent = () => {
  type HelloData = { message: string };
  const [data, setData] = useState<HelloData[] | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/hello")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No profile data</p>;

  return (
    <div>
      {data.map((item, index) => (
        <div key={index}>{item.message}</div>
      ))}
    </div>
  );
};

export default HelloComponent;
