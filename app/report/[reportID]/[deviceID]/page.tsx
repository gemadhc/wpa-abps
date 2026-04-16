import ClientComponent from "./ClientComponent";

export default async function Page({
  params,
}: {
  params: Promise<{ reportID: string, deviceID:string }>;
}) {
  const { reportID, deviceID } = await params;

  console.log("Report ID at page:", reportID, deviceID);

  if (!reportID || !deviceID) {
    return (
      <div className="bg-white h-[100px] p-10 text-black">
        Report Not Found
      </div>
    );
  }

  return <ClientComponent reportID = {reportID} deviceID = { deviceID} />;
}