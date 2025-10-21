import Monitoring from "./components/montoring";

export default async function Page() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const servers = await fetch(`${baseUrl}/api/ws`).then((res) =>
    res.json()
  );

  return (
    <div>
      <Monitoring srvs={servers} />
    </div>
  );
}
