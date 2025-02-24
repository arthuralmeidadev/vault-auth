import axios from "axios";

export class Provider {
    private static baseRoute = import.meta.env.VITE_API_URL;
    public static async login(
        username: string,
        password: string,
    ): Promise<void> {
        await axios.post(
            `${Provider.baseRoute}/login`,
            {
                Username: username,
                Password: password,
            },
            {
                withCredentials: true,
            },
        );
    }

    public static async getAuthenticationStatus(): Promise<void> {
        await axios.get(`${Provider.baseRoute}/auth`, {
            withCredentials: true,
        });
    }

    public static async newDeviceRegistrationToken(): Promise<string> {
        const { data } = await axios.get<string>(
            `${Provider.baseRoute}/device`,
            { withCredentials: true },
        );
        return data;
    }

    public static async verifyNewDeviceRegistration(
        token: string,
    ): Promise<void> {
        await axios.post(`${Provider.baseRoute}/device`, {
            withCredentials: true,
            headers: {
                deviceToken: token,
            },
        });
    }

    public static async getNewDeviceVerification(): Promise<{
        token: string;
        expiry: string;
    }> {
        const { data } = await axios.get<{ token: string; expiry: string }>(
            `${Provider.baseRoute}/code`,
            { withCredentials: true },
        );
        return data;
    }

    public static async revealVerificationCode(
        verificationToken: string,
        deviceToken: string,
    ): Promise<string> {
        const { data } = await axios.post<string>(
            `${Provider.baseRoute}/code/reveal`,
            {
                withCredentials: true,
                headers: {
                    deviceToken,
                    verificationToken,
                },
            },
        );
        return data;
    }

    public static async verifyDeviceTokenCode(
        token: string,
        code: string,
    ): Promise<void> {
        await axios.post(
            `${Provider.baseRoute}/code`,
            {
                Token: token,
                Code: code,
            },
            {
                withCredentials: true,
            },
        );
    }
}
