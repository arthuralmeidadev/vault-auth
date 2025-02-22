import { Icon } from "@phosphor-icons/react";

type Props = {
    isPassword?: boolean;
    placeholder?: string;
    Adornment?: Icon | null;
}
export function Input({ isPassword = false, placeholder, Adornment = null }: Props) {

    return (
        <div
            className="flex items-center gap-2 border border-gray-300 rounded-md"
        >
            <input className="w-full text-sm py-1 px-2" placeholder={placeholder} type={isPassword ? "password" : "text"} />
            <div className="pr-2">
                {Adornment && <Adornment size={15} />}
            </div>
        </div>
    )
}
