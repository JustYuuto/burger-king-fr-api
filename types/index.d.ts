declare class Client {
    public options: ClientOptions;
    public kingdom: Kingdom;
    public profile: Profile;
    public orders: Orders;
    public restaurant: Restaurant;
    constructor(options: ClientOptions);
    public login(email: string, password: string): Promise<void>;
    public login(bearer: string): Promise<void>;
    private request(url: string, method: string, body?: any): Promise<any>;
    private get(url: string): Promise<any>;
    private post(url: string, body?: any): Promise<any>;
}

declare class Captcha {
    private static resolve(): Promise<string>;
}

declare class Kingdom {
    constructor(client: Client);
    fetch(): Promise<void>;
    get points(): number;
    get blazons(): [];
}

declare class Orders {
    constructor(client: Client);
    fetch(days?: number, limited?: boolean): Promise<[]>;
    addCouponCode(code: string): Promise<void>;
}

declare class Restaurant {
    constructor(client: Client);
    fetch(id: string): Promise<{
        quota(): Promise<boolean>
    }>;
}

declare class Profile {
    constructor(client: Client);
    fetch(): Promise<void>;
    get email(): string|null;
    get civility(): string|null;
    get lastName(): string|null;
    get firstName(): string|null;
    get phone(): string|null;
    get birthdate(): string|null;
    get maxKids(): number;
}

declare interface ClientOptions {
}

export = Client;