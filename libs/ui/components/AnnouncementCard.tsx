"use client";

import { CalendarClock, Link as LinkIcon } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import Link from "next/link";

type AnnouncementCardProps = {
  text: string;
  link?: string;
  senderName: string;
  senderRole: string;
  timestamp: string;
};

export const AnnouncementCard = ({
  text,
  link,
  senderName,
  senderRole,
  timestamp,
}: AnnouncementCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white shadow-md rounded-2xl p-5 border border-gray-200 w-full max-w-xl mx-auto"
    >
      <div className="flex justify-between items-start gap-3">
        <div>
          <p className="text-gray-800 font-medium text-base">{text}</p>
          {link && (
            <Link
              href={link}
              target="_blank"
              className="text-blue-600 text-sm mt-1 inline-flex items-center hover:underline"
            >
              <LinkIcon size={16} className="mr-1" />
              Visit Link
            </Link>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
        <span>
          By <strong>{senderName}</strong> ({senderRole})
        </span>
        <span className="flex items-center gap-1">
          <CalendarClock size={14} />
          {format(new Date(timestamp), "dd MMM yyyy, h:mm a")}
        </span>
      </div>
    </motion.div>
  );
};
