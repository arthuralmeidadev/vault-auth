import { Eye, EyeClosed, Icon } from "@phosphor-icons/react";
import { useState } from "react";

type Props = {
    isPassword?: boolean;
    placeholder?: string;
    Adornment?: Icon | null;
    value: string;
    onChange: (value: string) => void;
};
export function Input({
    isPassword = false,
    placeholder,
    Adornment = null,
    value,
    onChange,
}: Props) {
    const [visible, setVisible] = useState(!isPassword);

    return (
        <div className="w-full flex items-center gap-2 border border-gray-300 rounded-md">
            <input
                value={value}
                onChange={({ target }) => onChange(target.value)}
                className="w-full text-sm py-1 px-2"
                placeholder={placeholder}
                type={isPassword && !visible ? "password" : "text"}
            />
            {isPassword ? (
                <button className="pr-2" onClick={() => setVisible(!visible)}>
                    {visible ? <Eye size={15} /> : <EyeClosed size={15} />}
                </button>
            ) : (
                <div className="pr-2">
                    {Adornment && <Adornment size={15} />}
                </div>
            )}
        </div>
    );
}
