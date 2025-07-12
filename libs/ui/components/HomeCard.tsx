// "use client"
// import React from 'react'
// import { LucideIcon } from 'lucide-react';
// import { useRouter } from 'next/navigation';

// interface HomeCardProps {
//   title: string;
//   subtitle: string;
//   navRoute: string;
//   Icon: LucideIcon;
// }

// const HomeCard = ({ title, subtitle, navRoute, Icon }: HomeCardProps) => {
//     const router = useRouter()
//   const handleNavigation = () => {
//     router.push(navRoute)
//   }

//   return (
//     <div
//       className="
//         flex flex-col items-center justify-center 
//         p-6 
//         bg-gradient-to-br from-green-400 to-green-600 
//         rounded-3xl 
//         shadow-lg 
//         text-white 
//         hover:scale-[1.03] hover:shadow-xl 
//         transition-all duration-300 
//         cursor-pointer 
//         w-full 
//         min-h-[200px] 
//         sm:min-h-[220px] 
//         md:min-h-[250px]
//         lg:min-h-[280px]
//         xl:min-h-60
//         "
//       onClick={handleNavigation}
//     >
//       <div className="flex items-center justify-center w-16 h-16 mb-4">
//         <Icon size={36} />
//       </div>

//       <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-center">{title}</h2>
//       <p className="text-xs sm:text-sm md:text-base text-center mt-2 max-w-xs">{subtitle}</p>
//     </div>
//   )
// }

// export default HomeCard


'use client';

import Link from 'next/link';
import React from 'react';

interface HomeCardProps {
  title: string;
  subtitle: string;
  navRoute?: string;
  icon: string; // Material icon name
}

const HomeCard: React.FC<HomeCardProps> = ({ title, subtitle, navRoute = '#', icon }) => {
  return (
    <Link
      href={navRoute}
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 block"
    >
      <span className="material-icons text-green-700 text-3xl mb-4 block">{icon}</span>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-500">{subtitle}</p>
    </Link>
  );
};

export default HomeCard;
