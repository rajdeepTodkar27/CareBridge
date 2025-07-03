import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AnnouncementCard } from "@/libs/ui/components/AnnouncementCard";
import { connect } from "@/dbconfig/dbconfig";
import Announcement from "@/models/Announcement";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session ) {
    return <div className="p-4 text-red-500">Unauthorized</div>;
  }

  await connect();
  const announcements = await Announcement.find()
    .sort({ timestamp: -1 })
    .populate("sendersProfileId");

  return (
    <main className="h-screen bg-gray-50 flex flex-col">
      <h1 className="text-3xl font-bold text-gray-800 text-center py-6 px-4 border-b border-gray-200">
        Announcements & Community
      </h1>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-6 max-w-2xl mx-auto">
          {announcements.length === 0 ? (
            <p className="text-gray-500 text-center">No announcements yet.</p>
          ) : (
            announcements.map((a: any) => (
              <AnnouncementCard
                key={a._id}
                text={a.text}
                link={a.link}
                senderName={a.sendersProfileId?.fullName || "Unknown"}
                senderRole={a.senderModel.replace("Profile", "")}
                timestamp={a.timestamp}
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
}

// const page = () => {
//   return (
    
//       <main className="h-screen bg-gray-50 flex flex-col">
//       <h1 className="text-3xl font-bold text-gray-800 text-center py-6 px-4 border-b border-gray-200">
//         Announcements & Community 
//       </h1>

//       <div className="flex-1 overflow-y-auto px-4 py-6">
//         <div className="space-y-6 max-w-2xl mx-auto">
//           <AnnouncementCard
//         text="Blood donation camp this Sunday from 9 AM to 2 PM in the main lobby."
//         link="https://hospital.org/blood-camp"
//         senderName="Dr. John Smith"
//         senderRole="Doctor"
//         timestamp="2025-07-01T15:30:00Z"
//       />

//       <div className="my-6" />

//         </div>
//       </div>
//     </main>
//   )
// }

// export default page

