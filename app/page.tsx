import Monitoring from "./components/montoring";

export default async function Page() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://storexmonitor.onrender.com";
  //const servers = await fetch(`${baseUrl}/api/ws`).then((res) => res.json());
  console.log(baseUrl);
  return <div>{/* <Monitoring srvs={servers} /> */}</div>;
}
