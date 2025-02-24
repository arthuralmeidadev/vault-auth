import { Numpad, SpinnerGap, User, X } from "@phosphor-icons/react";
import { Input } from "../../components/Input";
import Logo from "/src/assets/logo.svg";
import { Provider } from "../../provider";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import QRCode from "react-qr-code";

enum Stage {
    INITIAL,
    LOADING,
    ERROR_NOT_FOUND,
    ERROR_PASSWORD,
    ERROR_UNKNOWN,
}

type DeviceLoginModalProps = {
    onClose: VoidFunction;
};

const DeviceLoginModal = ({ onClose }: DeviceLoginModalProps) => {
    const [token, setToken] = useState<string | null>(null);
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expiry, setExpiry] = useState<string | null>(null);

    async function verifyCode() {
        try {
            setLoading(true);
            await Provider.verifyDeviceTokenCode(token!, code);
        } catch (error) {
            if (error instanceof AxiosError && error.status === 401) {
                setError("Invalid code");
            }
            console.error(error);
        }
        setLoading(false);
    }

    useEffect(() => {
        (async () => {
            try {
                const { token, expiry } =
                    await Provider.getNewDeviceVerification();
                setToken(token);
                setExpiry(expiry);
            } catch (error) {
                console.error(error);
            }
        })();
    }, []);

    useEffect(() => {
        if (code && code.length === 5) {
            verifyCode();
        }
    }, [code]);

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
                <p className="text-xs mt-5">
                    Scan the following QR code with your{" "}
                    <b>already registered device</b>:
                </p>
                <div className="border border-gray-400 rounded-md w-full my-2 flex items-center justify-center">
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
                    <p className="text-xs w-full">Expires at: {expiry}</p>
                </div>
                <p>Then type in the code you see on your phone</p>
                <div
                    className="w-full"
                    style={{
                        opacity: loading ? 0.5 : 1,
                        pointerEvents: loading ? "none" : undefined,
                    }}
                >
                    <Input
                        placeholder="Verification code"
                        value={code}
                        onChange={(value) => {
                            setCode(value.replace(/[^0-9]/g, ""));
                            setError(null);
                        }}
                        Adornment={Numpad}
                    />
                    {error && (
                        <p className="text-red-500 text-xs w-full">{error}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export function Login() {
    const [stage, setStage] = useState(Stage.INITIAL);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [deviceLoginModalVisible, setDeviceLoginModalVisible] =
        useState(false);

    async function login() {
        try {
            await Provider.login(username, password);
            window.location.replace("/");
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof AxiosError) {
                if (error.status === 404) {
                    setStage(Stage.ERROR_NOT_FOUND);
                } else if (error.status === 401) {
                    setStage(Stage.ERROR_PASSWORD);
                } else {
                    setStage(Stage.ERROR_UNKNOWN);
                }
            }
        }
    }

    return (
        <>
            <main className="w-full h-screen bg-gray-100">
                <div className="w-full h-full flex flex-col items-center justify-center">
                    <div className="md:w-[40vw] lg:w-[30vw] h-[80vh] py-5 px-10 bg-white rounded-md flex flex-col items-center justify-center">
                        <img src={Logo} className="h-40" />
                        <p className="text-gray-400 text-xs mt-10">
                            Log in to to your Vault account
                        </p>
                        <div className="mt-5 w-full flex flex-col items-center justify-center gap-2">
                            <Input
                                placeholder="Username"
                                Adornment={User}
                                value={username}
                                onChange={(value) => {
                                    if (
                                        [
                                            Stage.ERROR_NOT_FOUND,
                                            Stage.ERROR_PASSWORD,
                                            Stage.ERROR_UNKNOWN,
                                        ].includes(stage)
                                    ) {
                                        setStage(Stage.INITIAL);
                                    }
                                    if (stage === Stage.INITIAL) {
                                        setUsername(
                                            value.replace(
                                                /\s|[^a-zA-Z0-9]/g,
                                                "",
                                            ),
                                        );
                                    }
                                }}
                            />
                            {stage === Stage.ERROR_NOT_FOUND && (
                                <p className="text-red-500 text-xs w-full">
                                    User not found
                                </p>
                            )}
                            <Input
                                isPassword
                                placeholder="Password"
                                value={password}
                                onChange={(value) => {
                                    if (
                                        [
                                            Stage.ERROR_NOT_FOUND,
                                            Stage.ERROR_PASSWORD,
                                            Stage.ERROR_UNKNOWN,
                                        ].includes(stage)
                                    ) {
                                        setStage(Stage.INITIAL);
                                    }
                                    if (stage === Stage.INITIAL) {
                                        setPassword(
                                            value.replace(/[^a-zA-Z0-9]/g, ""),
                                        );
                                    }
                                }}
                            />
                            {stage === Stage.ERROR_PASSWORD && (
                                <p className="text-red-500 text-xs w-full">
                                    Incorrect password
                                </p>
                            )}
                            {stage === Stage.ERROR_UNKNOWN && (
                                <p className="text-red-500 text-xs w-full">
                                    Error while loging in
                                </p>
                            )}
                        </div>
                        {stage === Stage.LOADING ? (
                            <div className="bg-gray-200 text-[#288] flex items-center justify-center h-7 w-40 mt-5 rounded-md">
                                <div className="animate-spin">
                                    <SpinnerGap size={15} weight="bold" />
                                </div>
                            </div>
                        ) : (
                            <button
                                className="bg-[#288] text-white h-7 w-40 mt-5 rounded-md"
                                onClick={async () => await login()}
                            >
                                Login
                            </button>
                        )}
                        <button
                            className="mt-10 text-xs text-blue-400"
                            onClick={() => setDeviceLoginModalVisible(true)}
                        >
                            Login using QR Code
                        </button>
                    </div>
                </div>
            </main>
            {deviceLoginModalVisible && (
                <DeviceLoginModal
                    onClose={() => setDeviceLoginModalVisible(false)}
                />
            )}
        </>
    );
}
