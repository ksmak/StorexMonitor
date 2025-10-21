"use client";

import { useEffect, useState } from "react";
import ServerItem from "./serveritem";

const Monitoring = ({ srvs }: { srvs: ServerInfo[] }) => {
  const [servers, setServers] = useState<ServerInfo[]>(srvs);

  useEffect(() => {
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}`);
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
