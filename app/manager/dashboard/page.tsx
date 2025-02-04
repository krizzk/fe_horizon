'use client';
import { FaUsers, FaClipboardList, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import Profile from "../../../public/image/restaurant.jpg";

const Dashboard = () => {
  return (
    <div className="flex">
      {/* Assuming your sidebar is already in place */}
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
            {/* Main content */}
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
                      <FaUsers size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Users</p>
                      <p className="text-lg font-semibold text-gray-700">4</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-white rounded-lg shadow-xs">
                    <div className="p-3 mr-4 bg-green-500 text-white rounded-full">
                      <FaClipboardList size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Menus</p>
                      <p className="text-lg font-semibold text-gray-700">9</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-white rounded-lg shadow-xs">
                    <div className="p-3 mr-4 bg-yellow-500 text-white rounded-full">
                      <FaMoneyBillWave size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Income</p>
                      <p className="text-lg font-semibold text-gray-700">$0</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-white rounded-lg shadow-xs">
                    <div className="p-3 mr-4 bg-red-500 text-white rounded-full">
                      <FaChartLine size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Growth</p>
                      <p className="text-lg font-semibold text-gray-700">0%</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900">Quick Links</h3>
                  <div className="flex space-x-4 mt-4">
                    <Link href="/manager/user" className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600">
                      <FaUsers className="mr-2" />
                      Manage Users
                    </Link>
                    <Link href="/manager/menu" className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600">
                      <FaClipboardList className="mr-2" />
                      View Menu
                    </Link>
                    <Link href="/manager/transaksi" className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600">
                      <FaMoneyBillWave className="mr-2" />
                      Transaction
                    </Link>
                    <Link href="/manager/growth" className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600">
                      <FaChartLine className="mr-2" />
                      Track Growth
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {/* /End main content */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
