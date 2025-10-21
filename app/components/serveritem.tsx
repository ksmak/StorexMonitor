"use client";

const ServerItem = ({ srv }: { srv: ServerInfo }) => {
  return (
    <div className="card bg-base-100 w-96 shadow-sm">
      <div className="card-body">
        <h2 className="card-title">{srv.hostname}</h2>
        <p>Дата последнего обновления: <span className="">{srv.uptime}</span></p>
        <p>
          Версия ОС: <span className="">{srv.osType}</span>
        </p>
        <p>
          CPU: <span className="">{srv.cpu}</span>
        </p>
        <p>
          Загрузка RAM: <span className="">{srv.totalMemory}</span>
        </p>
        <p>
          Кол-во свободного пространства:{" "}
          <span className="">{srv.disckFreeSpace}</span>
        </p>
      </div>
    </div>
  );
};

export default ServerItem;
