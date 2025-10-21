"use client";

import { useEffect, useState } from "react";
import ServerItem from "./serveritem";

const Monitoring = ({ srvs }: { srvs: ServerInfo[] }) => {
  const [servers, setServers] = useState<ServerInfo[]>(srvs);

  useEffect(() => {
    const wsUrl =
      process.env.NEXT_PUBLIC_WS_URL ?? "wss://storexmonitor.onrender.com/";
    const ws = new WebSocket(`${wsUrl}api/ws`);
    ws.onopen = () => {
      console.log("Connected to WebSocket");
    };
    ws.onmessage = (event) => {
      console.log("Data received:", event.data);
      const msg = JSON.parse(event.data);
      if (msg.type === "update" && msg.data) {
        setServers(msg.data);
      }
    };
    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };
    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="p-4 flex gap-4 flex-wrap">
      {servers.map((server, index) => (
        <ServerItem key={index} srv={server} />
      ))}
    </div>
  );
};

export default Monitoring;
