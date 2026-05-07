import ClientComponent from "./ClientComponent";

export default async function Page({
  params,
}: {
  params: Promise<{ stopID: string }>;
}) {
  const { stopID } = await params;

  console.log("Stop ID at page:", stopID);

  if (!stopID) {
    return (
      <div className="bg-slate-800 h-[100px] p-5 text-black">
        Stop Does Not Exist
      </div>
    );
  }

  return <ClientComponent stopID={stopID} />;
}