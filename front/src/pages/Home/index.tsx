import { useEffect, useRef, useState } from "react";
import Logo from "/src/assets/logo.svg";
import { X } from "@phosphor-icons/react";
import { Provider } from "../../provider";
import QRCode from "react-qr-code";

type DevicesModalProps = {
    onClose: VoidFunction;
};

type LoginDevice = {
    name: string;
    token: string;
};

export const DevicesModal = ({ onClose }: DevicesModalProps) => {
    const [token, setToken] = useState<string | null>(null);
    const hasInitialized = useRef(false);
    let availableDevices = new Array<LoginDevice>();
    try {
        availableDevices = JSON.parse(
            localStorage.getItem("loginDevices") ?? "[]",
        ) as LoginDevice[];
    } catch (error) {
        console.error(error);
    }

    async function generateNewDeviceRegistrationQRCode() {
        try {
            const token = await Provider.newDeviceRegistrationToken();
            setToken(token);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (!hasInitialized.current) {
            hasInitialized.current = true;
            generateNewDeviceRegistrationQRCode();
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            generateNewDeviceRegistrationQRCode();
        }, 50_000);

        return () => clearTimeout(timer);
    }, [token]);

    return (
        <div className="h-screen w-screen absolute bg-[#0002] top-0 left-0 flex items-center justify-center">
            <div className="absolute h-full w-full" onClick={() => onClose()} />
            <div className="md:w-[38vw] lg:w-[28vw] h-fit max-h-[70vh] overflow-auto py-5 px-10 bg-white rounded-md relative flex flex-col items-center justify-center">
                <button
                    className="top-2 right-2 absolute"
                    onClick={() => onClose()}
                >
                    <X size={20} />
                </button>
                <h1 className="text-gray-500">Login devices</h1>
                <div className="border border-gray-400 rounded-md w-full">
                    {availableDevices.length === 0 && (
                        <p className="text-xs w-full text-center py-3">
                            No available login devices
                        </p>
                    )}
                    {availableDevices.map(({ name }) => {
                        return (
                            <div className="text-xs w-full py-3">{name}</div>
                        );
                    })}
                </div>
                <p className="text-xs mt-5">
                    Use the following code to register a new device:
                </p>
                <div className="border border-gray-400 rounded-md w-full mt-4 flex items-center justify-center">
                    {token && (
                        <QRCode
                            className="p-2"
                            value={
                                import.meta.env.VITE_APP_URL +
                                "/login/device" +
                                token
                            }
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export const Home = () => {
    const [devicesModalVisible, setDevicesModalVisible] = useState(false);

    return (
        <>
            <main className="w-full h-screen bg-gray-100">
                <div className="w-full h-full flex flex-col items-center justify-center">
                    <div className="md:w-[40vw] lg:w-[30vw] h-[80vh] py-5 px-10 bg-white rounded-md flex flex-col items-center justify-center">
                        <img src={Logo} className="h-40" />
                        <p className="mt-4">Welcome aboard!</p>
                        <button
                            className="mt-10 text-blue-400"
                            onClick={() => setDevicesModalVisible(true)}
                        >
                            Login devices
                        </button>
                    </div>
                </div>
            </main>
            {devicesModalVisible && (
                <DevicesModal onClose={() => setDevicesModalVisible(false)} />
            )}
        </>
    );
};
