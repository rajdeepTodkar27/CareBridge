import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { UserCircle2 } from "lucide-react";

// Define the nurse type
type Nurse = {
  fullName: string;
  gender: string;
  qualification: string;
  institute: string;
  administrativeTitle?: string;
  avtarImg?: string; // Optional image support
};

type StaffCardProps = {
  nurse: Nurse;
};

export default function StaffCard({ nurse }: StaffCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <li
        onClick={() => setIsOpen(true)}
        className="cursor-pointer p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition bg-white flex items-center gap-4"
      >
        {/* Avatar */}
        {nurse.avtarImg ? (
          <img
            src={nurse.avtarImg}
            alt={nurse.fullName}
            className="w-12 h-12 rounded-full object-cover border"
          />
        ) : (
          <UserCircle2 className="w-12 h-12 text-green-600" />
        )}

        {/* Basic info */}
        <div>
          <p className="font-semibold text-gray-800">{nurse.fullName}</p>
          <p className="text-sm text-gray-600">{nurse.qualification}</p>
        </div>
      </li>

      {/* Modal for full nurse info */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl space-y-3">
            <Dialog.Title className="text-lg font-bold text-gray-800">Nurse Details</Dialog.Title>
            <p><strong>Name:</strong> {nurse.fullName}</p>
            <p><strong>Gender:</strong> {nurse.gender}</p>
            <p><strong>Qualification:</strong> {nurse.qualification}</p>
            <p><strong>Institute:</strong> {nurse.institute}</p>
            {nurse.administrativeTitle && (
              <p><strong>Title:</strong> {nurse.administrativeTitle}</p>
            )}

            <div className="pt-4 text-right">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
