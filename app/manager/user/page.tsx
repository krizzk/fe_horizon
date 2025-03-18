import { IUser } from "@/app/types";
import { getCookies } from "@/lib/server-cookies";
import { BASE_API_URL, BASE_IMAGE_PROFILE } from "@/global";
import { get } from "@/lib/api-bridge";
import { AlertInfo } from "@/components/alert";
import Image from "next/image";
import Search from "./search";
import AddUser from "./addUser";
import EditUser from "./editUser";
import DeleteUser from "./deleteUser";

const getUser = async (search: string): Promise<IUser[]> => {
  try {
    const TOKEN = await getCookies("token");
    const url = `${BASE_API_URL}/user?search=${search}`;
    const { data } = await get(url, TOKEN);
    let result: IUser[] = [];
    if (data?.status) result = [...data.data];
    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const UserPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
  const searchParamsResolved = await searchParams;
  const search = searchParamsResolved.search ? searchParamsResolved.search.toString() : ``;
  const user: IUser[] = await getUser(search);

  const role = (role: string): React.ReactNode => {
    if (role === "MANAGER") {
      return <span className="bg-blue-100 text-blue-800 text-sm font-bold me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">Manager</span>;
    }
    return <span className="bg-green-100 text-green-800 text-sm font-bold me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">Cashier</span>;
  };

  return (
    <div>
      <div className="m-2 bg-white rounded-lg p-3 border-t-4 border-t-primary shadow-md">
        <h4 className="text-xl font-bold mb-2 text-gray-900">User Data</h4>
        <p className="text-sm text-secondary mb-4 text-gray-900">
          This page displays user data, allowing managers to view details, search, and manage user accounts by adding, editing, or deleting them.
        </p>
        <div className="flex mb-4">
          {/* Search Bar */}
          <div className="flex items-center w-full max-w-md flex-grow text-black">
            <Search url={`/manager/user`} search={search} />
          </div>
          {/* Add User Button */}
          <div className="ml-4">
            <AddUser />
          </div>
        </div>
        {user.length == 0 ? (
          <AlertInfo title="Information">
            No data Available
          </AlertInfo>
        ) : (
          <>
            <div className="m-2">
              {user.map((data, index) => (
                <div key={`keyUser${index}`} className={`font-semibold flex flex-wrap shadow m-2 text-black justify-between items-center bg-white rounded-lg p-3 border-t-4 border-t-primary`}>
                  <div className="w-full md:w-1/12 p-2">
                    
                    {/* Profile Picture */}
                    <small className="text-sm font-bold text-blue-500">Profile Picture</small><br />
                    {data.profile_picture ? (
                      <Image
                        width={40}
                        height={40}
                        src={`${BASE_IMAGE_PROFILE}/${data.profile_picture}`}
                        alt="profile picture"
                        className="rounded-sm overflow-hidden"
                        unoptimized
                      />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    )}

                  </div>
                  <div className="w-full md:w-2/12 p-2">
                    <small className="text-sm font-bold text-green-500">Name</small> <br />
                    {data.name}
                  </div>
                  <div className="w-full md:w-2/12 p-2">
                    <small className="text-sm font-bold text-yellow-500">Email</small> <br />
                    {data.email}
                  </div>
                  <div className="w-full md:w-1/12 p-2">
                    <small className="text-sm font-bold text-red-500 ">Role</small> <br />
                    {role(data.role)}
                  </div>
                  <div className="w-full md:w-2/12 p-2">
                    <small className="text-sm font-bold text-purple-500">Action</small><br />
                    <div className="flex gap-1">
                      <EditUser selectedUser={data} />
                      <DeleteUser selectedUser={data} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserPage;
