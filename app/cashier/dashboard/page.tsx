'use client';
import React, { useEffect, useState } from 'react';
import {  FaClipboardList, FaStar,} from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import Profile from "../../../public/image/restaurant.jpg";
import { BASE_API_URL } from "@/global";
import { getCookie } from "@/lib/client-cookie"; // Mengimpor fungsi getCookie dari client-cookies
import { get } from "@/lib/api-bridge";
import { FaBellConcierge, FaClockRotateLeft, FaKickstarter } from 'react-icons/fa6';


const getMenuCount = async () => {
  try {
    const TOKEN = getCookie("token") ?? ""; // Menggunakan nilai default jika token undefined
    const url = `${BASE_API_URL}/menu`;
    const { data } = await get(url, TOKEN);
    if (data?.status) {
      return data.data.length;
    }
    return 0;
  } catch (error) {
    console.error('Error fetching menu data:', error);
    return 0;
  }
};

const Dashboard = () => {
  const [menuCount, setMenuCount] = useState(0);

  useEffect(() => {
    const fetchMenuCount = async () => {
      const count = await getMenuCount();
      setMenuCount(count);
    };

    fetchMenuCount();
  }, []);

  return (
    <div className="flex">
      <div className="flex-grow min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">
              FOOODDEEERRRR
            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="rounded-lg bg-white p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Overview
                  </h2>
                  <Image src={Profile} width={50} height={50} alt="Profile" className="rounded-full" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  <div className="flex items-center p-4 bg-white rounded-lg shadow-xs">
                    <div className="p-3 mr-4 bg-blue-500 text-white rounded-full">
                      <FaClipboardList size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Menus</p>
                      <p className="text-lg font-semibold text-gray-700">{menuCount}</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-white rounded-lg shadow-xs">
                    <div className="p-3 mr-4 bg-green-500 text-white rounded-full">
                      <FaStar size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Menu favourite</p>
                      <p className="text-lg font-semibold text-gray-700">{0}</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-white rounded-lg shadow-xs">
                    <div className="p-3 mr-4 bg-yellow-500 text-white rounded-full">
                      <FaBellConcierge size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pesan makanan</p>
                      <p className="text-lg font-semibold text-gray-700">0</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-white rounded-lg shadow-xs">
                    <div className="p-3 mr-4 bg-red-500 text-white rounded-full">
                      <FaClockRotateLeft size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">History</p>
                      <p className="text-lg font-semibold text-gray-700">0</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900">Quick Links</h3>
                  <div className="flex space-x-4 mt-4">
                    <Link href="/cashier/menu" className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600">
                      <FaClipboardList className="mr-2" />
                      Menus
                    </Link>
                    <Link href="/cashier/menu_favorite" className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600">
                      <FaStar className="mr-2" />
                      menu favourite
                    </Link>
                    <Link href="/cashier/pesan_makanan" className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600">
                      <FaBellConcierge className="mr-2" />
                      pesan makanan
                    </Link>
                    <Link href="/cashier/history" className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600">
                      <FaClockRotateLeft className="mr-2" />
                      history pemesana
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
