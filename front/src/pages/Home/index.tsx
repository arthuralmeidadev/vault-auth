import { Password, User } from "@phosphor-icons/react"
import { Input } from "../../components/Input"
import Logo from "/src/assets/logo.svg"

export function Home() {
    return (
        <main className="w-full h-screen bg-gray-100">
            <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="w-[30vw] h-[80vh] py-5 pw-4 bg-white rounded-md flex flex-col items-center justify-center">
                    <img src={Logo} className="h-40" />
                    <p className="text-gray-400 text-xs mt-10">Log in to to your Vault account</p>
                    <div className="mt-5 w-full flex flex-col items-center justify-center gap-2">
                        <Input placeholder="Username" Adornment={User} />
                        <Input placeholder="Password" Adornment={Password} isPassword />
                    </div>
                    <button className="bg-[#288] text-white py-1 px-10 mt-5 rounded-md">Login</button>
                </div>
            </div>
        </main>
    )
}
