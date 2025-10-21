import type {
  WebSocket as WsWebSocket,
  WebSocketServer as WsWebSocketServer,
} from "ws";

export const runtime = "nodejs";

const servers: ServerInfo[] = [];

/**
 * UPGRADE handler — Next/next-ws style expects this signature:
 * UPGRADE(client: WebSocket, server: WebSocketServer)
 */
export function UPGRADE(client: WsWebSocket, server: WsWebSocketServer) {
  // уведомляем других клиентов, что подключился новый агент
  for (const other of server.clients) {
    // other имеет тип WebSocket | WebSocket-like
    // сравниваем ссылки и состояние
    if (
      other === client ||
      (other as WsWebSocket).readyState !== (client as WsWebSocket).OPEN
    )
      continue;

    try {
      (other as WsWebSocket).send(
        JSON.stringify({
          author: "System",
          content: "A new agent joined the monitoring",
        })
      );
    } catch (e) {
      // ignore send errors
    }
  }

  // Обработка входящих сообщений: используем стандартное событие "message"
  client.on("message", (raw) => {
    // raw может быть Buffer, ArrayBuffer или string
    let text: string;
    if (typeof raw === "string") text = raw;
    else if (raw instanceof Buffer) text = raw.toString("utf8");
    else text = Buffer.from(raw as ArrayBuffer).toString("utf8");

    let msg: any;
    try {
      msg = JSON.parse(text);
    } catch (err) {
      // Некорректный JSON — игнорируем
      console.error("WS: invalid JSON:", err);
      return;
    }

    // Ожидаем структуру: { type: "send_data", payload: { hostname, osType, ... } }
    if (msg?.type === "send_data" && msg.payload) {
      const body = msg.payload;

      // Небольшая валидация минимальных полей
      if (!body.hostname) {
        console.warn("WS: send_data without hostname, ignoring");
        return;
      }

      const newServer: ServerInfo = {
        hostname: body.hostname,
        osType: body.osType,
        cpu: body.cpu,
        totalMemory: body.totalMemory,
        disckFreeSpace: body.disckFreeSpace,
        uptime: body.uptime,
      };

      // Поиск по hostname и обновление / добавление
      const existIdx = servers.findIndex(
        (s) => s.hostname === newServer.hostname
      );
      if (existIdx >= 0) {
        servers[existIdx] = { ...servers[existIdx], ...newServer };
      } else {
        servers.push(newServer);
      }

      // Рассылаем обновление всем подключённым (включая самого отправителя, если нужно)
      for (const other of server.clients) {
        if ((other as WsWebSocket).readyState !== (client as WsWebSocket).OPEN)
          continue;
        try {
          (other as WsWebSocket).send(
            JSON.stringify({
              type: "update",
              data: servers,
            })
          );
        } catch (e) {
          // ignore
        }
      }

      return;
    }

    // Запрос списка серверов
    if (msg?.type === "request_list") {
      try {
        client.send(JSON.stringify({ type: "list", data: servers }));
      } catch (e) {}
    }
  });

  // При закрытии подключения — уведомляем других
  client.once("close", () => {
    for (const other of server.clients) {
      if (
        other === client ||
        (other as WsWebSocket).readyState !== (client as WsWebSocket).OPEN
      )
        continue;
      try {
        (other as WsWebSocket).send(
          JSON.stringify({
            author: "System",
            content: "An agent left the monitoring",
          })
        );
      } catch (e) {}
    }
  });
}

/**
 * REST GET: возвращает список известных серверов
 */
export async function GET(request: Request) {
  return new Response(JSON.stringify(servers), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
