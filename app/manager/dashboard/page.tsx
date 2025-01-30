'use client';
import { FaUsers, FaClipboardList, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import Profile from "../../../public/image/restaurant.jpg"

const DashboardPage = () => {
    return (
        <div 
            style={{
                // backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://t4.ftcdn.net/jpg/02/75/28/95/360_F_275289557_YptaQZDnGnDkcgm8b792ItXOqvvkTQAr.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '100vh',
                position: 'relative'
            }}
        >
            <main className="p-6 text-white ">
            <div className="w-1/4">
                            <Image
                                src={Profile}
                                alt="Profile Picture"
                                width={100}
                                height={100}
                                className="rounded-full w-60 h-54 " />
                        </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="mb-8 p-4">
                        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-lg hover:transform hover:scale-105 transition-all">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-200">Total Users</p>
                                    <h3 className="text-2xl font-bold">-</h3>
                                </div>
                                <FaUsers className="text-4xl text-blue-400" />
                            </div>
                        </div>
                    </div>

                    {/* Total Orders Card */}
                    <div className="mb-8 p-4">
                        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-lg hover:transform hover:scale-105 transition-all">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-200">Total Orders</p>
                                    <h3 className="text-2xl font-bold">-</h3>
                                </div>
                                <FaClipboardList className="text-4xl text-green-400" />
                            </div>
                        </div>
                    </div>

                    {/* Revenue Card */}
                    <div className="mb-8 p-4">
                        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-lg hover:transform hover:scale-105 transition-all">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-200">Revenue</p>
                                    <h3 className="text-2xl font-bold">$-</h3>
                                </div>
                                <FaMoneyBillWave className="text-4xl text-yellow-400" />
                            </div>
                        </div>
                    </div>

                    {/* Growth Card */}
                    <div className="mb-8 p-4">
                        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-lg hover:transform hover:scale-105 transition-all">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-200">Growth</p>
                                    <h3 className="text-2xl font-bold">-%</h3>
                                </div>
                                <FaChartLine className="text-4xl text-purple-400" />
                            </div>
                        </div>
                    </div>
                    <Link 
                        href="/manager/transaksi" 
                        className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg"
                    >
                        Go to Transaksi
                    </Link>
                </div>  
            </main>
        </div>
    );
};

export default DashboardPage;