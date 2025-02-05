"use client"
import { IUser } from "@/app/types"
import { BASE_API_URL } from "@/global"
import { post } from "@/lib/api-bridge"
import { getCookie } from "@/lib/client-cookies"
import { useRouter } from "next/navigation"
import { FormEvent, useRef, useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import { ButtonPrimary, ButtonSuccess, ButtonDanger } from "@/components/button"
import { InputGroupComponent } from "@/components/inputComponents"
import Modal from "@/components/modal"
import Select from "@/components/select"
import FileInput from "@/components/fileInput"

const AddUser = () => {
    const [isShow, setIsShow] = useState<boolean>(false)
    
    const [user, setUser] = useState<IUser>({
        id: 0, uuid : ``, name : ``, email: ``, password: ``, profile_picture : ``, role: ``, createdAt : ``, updatedAt : ``
    })
    const router = useRouter()
    const TOKEN = getCookie("token") || ""

    const [file, setFile] = useState<File | null>(null)
    const formRef = useRef<HTMLFormElement>(null)

    const openModal = () => {
        setUser({
            id: 0, uuid : ``, name : ``, email: ``, password: ``, profile_picture : ``, role: ``, createdAt : ``, updatedAt : ``
        })
        setIsShow(true)
        if (formRef.current) formRef.current.reset()
    }

    const handleSubmit = async (e: FormEvent) => {
        try {
            e.preventDefault()
            const url = `${BASE_API_URL}/user/create`
            const { name, email, password, role } = user 
            const payload = new FormData()
            payload.append("name", name || "")
            payload.append("email", email || "")
            payload.append("password", password || "")
            payload.append("role", role || "")
            if(file !== null) payload.append("profile_picture", file || "")
            const { data } = await post(url, payload, TOKEN)
            if (data?.status) {
                setIsShow(false)
                toast(data?.message, { hideProgressBar: true, containerId: `toastUser`, type: `success` })
                setTimeout(() => router.refresh(), 1000)
            } else {
                toast(data?.message, { hideProgressBar: true, containerId: `toastUser`, type: `warning` })
            }
        } catch (error) {
            console.log(error);
            toast(`Something went wrong`, { hideProgressBar: true, containerId: `toastUser`, type: `error` })
        }
    }

    return (
        <div>
            <ButtonSuccess type="button" onClick={() => openModal()}>
                <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add User
                </div>
            </ButtonSuccess>
            
            <Modal isShow={isShow} onClose={state => setIsShow(state)}>
               <form onSubmit={handleSubmit}>
                   {/* modal header */}
                   <div className="sticky top-0 bg-white px-5 pt-5 pb-3 shadow">
                       <div className="w-full flex items-center">
                           <div className="flex flex-col">
                               <strong className="font-bold text-2xl">Create New User</strong>
                               <small className="text-slate-400 text-sm">Managers can create user accounts on this page.</small>
                           </div>
                           <div className="ml-auto">
                               <button type="button" className="text-slate-400" onClick={() => setIsShow(false)}>
                                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                       <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                   </svg>
                               </button>
                           </div>
                       </div>
                   </div>
                   {/* end modal header */}

                   {/* modal body */}
                   <div className="p-5">
                       <InputGroupComponent className="text-black" id={`name`} type="text" value={user.name}
                           onChange={val => setUser({ ...user, name: val })}
                           required={true} label="Name" />

                       <InputGroupComponent className="text-black" id={`email`} type="email" value={user.email}
                           onChange={val => setUser({ ...user, email: val })}
                           required={true} label="Email" />

                       <InputGroupComponent className="text-black" id={`password`} type="password" value={user.password}
                           onChange={val => setUser({ ...user, password: val })}
                           required={true} label="Password" />

                       <Select className="text-black" id={`role`} value={user.role} label="Role"
                           required={true} onChange={val => setUser({ ...user, role: val })}>
                           <option value="">--- Select Role ---</option>
                           <option value="MANAGER">MANAGER</option>
                           <option value="CASHIER">CASHIER</option>
                       </Select>

                       <FileInput acceptTypes={["application/pdf", "image/png", "image/jpeg", "image/jpg"]} id="profile_picture"
                           label="Upload Profile Picture (Max 2MB, PDF/JPG/JPEG/PNG)" onChange={f => setFile(f)} required={false} />
                          
                   </div>
                   {/* end modal body */}

                   {/* modal footer */}
                   <div className="w-full p-5 flex rounded-b-2xl shadow">
                       <div className="flex ml-auto gap-2">
                           <ButtonDanger type="button" onClick={() => setIsShow(false)}>
                               Cancel
                           </ButtonDanger>
                           <ButtonPrimary type="submit">
                               Save
                           </ButtonPrimary>
                       </div>
                   </div>
                   {/* end modal footer */}
               </form>
           </Modal>

        </div>
    )

}

export default AddUser
