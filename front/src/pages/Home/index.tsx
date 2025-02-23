import Logo from "/src/assets/logo.svg";

export function Home() {
    return (
        <main className="w-full h-screen bg-gray-100">
            <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="w-[30vw] h-[80vh] py-5 pw-4 bg-white rounded-md flex flex-col items-center justify-center">
                    <img src={Logo} className="h-40" />
                    <p>Welcome</p>
                </div>
            </div>
        </main>
    );
}
