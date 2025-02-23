import { Icon } from "@phosphor-icons/react";

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
    return (
        <div className="flex items-center gap-2 border border-gray-300 rounded-md">
            <input
                value={value}
                onChange={({ target }) => onChange(target.value)}
                className="w-full text-sm py-1 px-2"
                placeholder={placeholder}
                type={isPassword ? "password" : "text"}
            />
            <div className="pr-2">{Adornment && <Adornment size={15} />}</div>
        </div>
    );
}
