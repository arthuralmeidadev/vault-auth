import Logo from "/src/assets/logo.svg";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { Provider } from "../provider";

export const DeviceLogin = () => {
    const [code, setCode] = useState<string | null>(null);
    const { token } = useParams();
    let deviceToken: string | null = null;

    try {
        deviceToken = localStorage.getItem("deviceToken");
    } catch (error) {
        console.error(error);
    }

    if (!token || !deviceToken) {
        window.location.replace("/login");
    }

    useEffect(() => {
        (async () => {
            setCode(
                await Provider.revealVerificationCode(token!, deviceToken!),
            );
        })();
    }, []);

    return (
        <main className="w-full h-screen bg-gray-100">
            <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="md:w-[40vw] lg:w-[30vw] h-[80vh] py-5 px-10 bg-white rounded-md flex flex-col items-center justify-center">
                    <img src={Logo} className="h-40" />
                    <p className="text-green-700 my-10">
                        Type this code in to login in to your other device:{" "}
                        {code}
                    </p>
                </div>
            </div>
        </main>
    );
};
