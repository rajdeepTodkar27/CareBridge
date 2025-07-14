"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import axios from "axios";
import AnnouncementCard from "@/libs/ui/stitchUi/announcementcard";
import { AnnouncementForm } from "@/libs/ui/components/AnnouncementForm";

export default function Page() {
  const { data: session, status } = useSession();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get("/api/announcement");
      setAnnouncements(res.data.data); // adjust if shape differs
    } catch (err) {
      console.error("Failed to fetch announcements", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchAnnouncements();
    }
  }, [status]);

  return (
    <main className="min-h-screen bg-gray-100 py-6 px-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Announcements & Community
        </h1>
        <AnnouncementForm onPosted={fetchAnnouncements} />
      </div>

      {/* Announcements List */}
      <div className="max-w-4xl mx-auto space-y-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading announcements...</p>
        ) : announcements.length === 0 ? (
          <p className="text-center text-gray-500">No announcements yet.</p>
        ) : (
          announcements.map((a: any) => (
            <AnnouncementCard
              key={a._id}
              avatarImg={a.sendersProfileId?.avatarUrl || "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-social-media-user-vector-image-icon-default-avatar-profile-icon-social-media-user-vector-image-209162840.jpg"}
              senderName={a.sendersProfileId?.fullName || "Unknown"}
              senderRole={a.senderModel?.replace("Profile", "") || "Staff"}
              timestamp={a.timestamp}
              content={a.text}
              actionHref={a.link}
              actionText={a.link ? "View More" : undefined}
            />
          ))
        )}
      </div>
    </main>
  );
}
