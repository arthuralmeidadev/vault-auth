import { CheckCircle } from "@phosphor-icons/react";
import Logo from "/src/assets/logo.svg";
import { useParams } from "react-router";
import { useEffect } from "react";
import { Provider } from "../provider";

export const DeviceRegistration = () => {
    const { token } = useParams();

    if (!token) {
        window.location.replace("/home");
    }

    useEffect(() => {
        (async () => {
            await Provider.verifyNewDeviceRegistration(token!);
            localStorage.setItem("deviceToken", token!);
        })();
    }, []);

    return (
        <main className="w-full h-screen bg-gray-100">
            <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="md:w-[40vw] lg:w-[30vw] h-[80vh] py-5 px-10 bg-white rounded-md flex flex-col items-center justify-center">
                    <img src={Logo} className="h-40" />
                    <p className="text-green-700 my-10">
                        This device has been successfully registered!
                        <CheckCircle size={18} weight="fill" />
                    </p>
                </div>
            </div>
        </main>
    );
};
