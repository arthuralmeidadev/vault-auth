import axios from "axios";

export class Provider {
    private static baseRoute = import.meta.env.VITE_API_URL;
    public static async login(username: string, password: string): Promise<void> {
        await axios.post(
            `${this.baseRoute}/login`,
            {
                username,
                password,
            },
        );
    }
}
