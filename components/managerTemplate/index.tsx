import { ReactNode } from "react";
import Sidebar from "./sidebar";
import { IUser } from "@/app/types";
import { getCookies } from "@/lib/server-cookies";
import { BASE_API_URL, BASE_IMAGE_PROFILE } from "@/global";
import { get } from "@/lib/api-bridge";

type MenuType = {
  id: string;
  icon: ReactNode;
  path: string;
  label: string;
};
type ManagerProp = {
  children: ReactNode;
  id: string;
  title: string;
  menuList: MenuType[];
};

const getUser = async (): Promise<IUser | null> => {
  try {
    const TOKEN = await getCookies("token");
    const url = `${BASE_API_URL}/user/profile`;
    const { data } = await get(url, TOKEN);
    if (data?.status) return data.data;
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const managerTemplate = async ({
  children,
  id,
  title,
  menuList,
}: ManagerProp) => {
  const profile: IUser | null = await getUser();

  return (
    <div className="w-full min-h-dvh bg-slate-50 text-black">
      <Sidebar menuList={menuList} title={title} id={id} user={profile}>
        {children}
      </Sidebar>
    </div>
  );
};

export default managerTemplate;