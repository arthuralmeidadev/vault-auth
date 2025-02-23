import { Password, SpinnerGap, User } from "@phosphor-icons/react";
import { Input } from "../../components/Input";
import Logo from "/src/assets/logo.svg";
import { Provider } from "../../provider";
import { useState } from "react";
import { AxiosError } from "axios";

enum Stage {
    INITIAL,
    LOADING,
    ERROR_NOT_FOUND,
    ERROR_PASSWORD,
    ERROR_UNKNOWN,
}

export function Login() {
    const [stage, setStage] = useState(Stage.INITIAL);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function login() {
        try {
            await Provider.login(username, password);
            window.location.replace("/");
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof AxiosError) {
                if (error.status === 404) {
                    setStage(Stage.ERROR_NOT_FOUND);
                } else if (error.status === 409) {
                    setStage(Stage.ERROR_PASSWORD);
                } else {
                    setStage(Stage.ERROR_UNKNOWN);
                }
            }
        }
    }

    return (
        <main className="w-full h-screen bg-gray-100">
            <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="w-[30vw] h-[80vh] py-5 pw-4 bg-white rounded-md flex flex-col items-center justify-center">
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
                                        value.replace(/\s|[^a-zA-Z0-9]/g, ""),
                                    );
                                }
                            }}
                        />
                        <Input
                            isPassword
                            placeholder="Password"
                            Adornment={Password}
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
                </div>
            </div>
        </main>
    );
}
