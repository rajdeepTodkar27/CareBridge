import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { UserCircle2 } from "lucide-react";


type Doctor = {
  fullName: string;
  medicalSpeciality: string;
  experience: number;
  gender: string;
  licenseNo: string;
  licenseAuthority: string;
  administrativeTitle?: string;
  avtarImg?: string; 
};

type DoctorCardProps = {
  doc: Doctor;
};

export default function DoctorCard({ doc }: DoctorCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <li
        onClick={() => setIsOpen(true)}
        className="cursor-pointer p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition bg-white flex items-center gap-4"
      >
        {/* Avatar */}
        {doc.avtarImg ? (
          <img
            src={doc.avtarImg}
            alt={doc.fullName}
            className="w-12 h-12 rounded-full object-cover border"
          />
        ) : (
          <UserCircle2 className="w-12 h-12 text-green-600" />
        )}

        {/* Name and Speciality */}
        <div>
          <p className="font-semibold text-gray-800">{doc.fullName}</p>
          <p className="text-sm text-gray-600">{doc.medicalSpeciality}</p>
        </div>
      </li>

      {/* Modal for full doctor details */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl space-y-3">
            <Dialog.Title className="text-lg font-bold text-gray-800">Doctor Details</Dialog.Title>
            <p><strong>Name:</strong> {doc.fullName}</p>
            <p><strong>Specialty:</strong> {doc.medicalSpeciality}</p>
            <p><strong>Experience:</strong> {doc.experience} years</p>
            <p><strong>Gender:</strong> {doc.gender}</p>
            <p><strong>License:</strong> {doc.licenseNo} ({doc.licenseAuthority})</p>
            {doc.administrativeTitle && (
              <p><strong>Title:</strong> {doc.administrativeTitle}</p>
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
