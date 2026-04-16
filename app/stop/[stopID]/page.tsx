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
      <div className="bg-white h-[100px] p-10 text-black">
        Stop Does Not Exist
      </div>
    );
  }

  return <ClientComponent stopID={stopID} />;
}