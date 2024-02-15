import { AxiosProxyConfig } from 'axios';

declare class Client {
    public options: ClientOptions;
    public kingdom: Kingdom;
    public profile: Profile;
    public orders: Orders;
    public restaurant: Restaurant;
    public lottery: Lottery;
    constructor(options?: ClientOptions);
    public login(email: string, password: string): Promise<void>;
    public login(bearer: string): Promise<void>;
    private loginWithMfa(data: any): Promise<void>;
    public sendOtp(): Promise<void>;
    public verifyOtp(otp: string): Promise<void>;
    public createAccount(options: AccountCreationOptions): Promise<{
        activate(token: string): Promise<void>;
    }>;
    private request(url: string, method: string, body?: any, config?: any): Promise<any>;
    private get(url: string, config?: any): Promise<any>;
    private post(url: string, body?: any, config?: any): Promise<any>;
}

declare class Captcha {
    private static resolve(): Promise<string>;
}

declare class Kingdom {
    constructor(client: Client);
    fetch(): Promise<void>;
    get points(): number;
    get blazons(): [];
    get coupons(): [];
    get code(): string;
}

declare class Orders {
    constructor(client: Client);
    fetch(days?: number, limited?: boolean): Promise<[]>;
    addCouponCode(code: string): Promise<void>;
    create(details: OrderDetails): Promise<any>;
}

declare class Restaurant {
    constructor(client: Client);
    fetch(id: string): Promise<RestaurantType & {
        quota(): Promise<boolean>,
        catalog(): Promise<Catalog & {
            getCategory(id: string): any
            getSubCategory(id: string): any
            getProductGroup(id: string): any
            getProduct(id: string): CatalogProduct & CatalogProductDrink
            getMenu(id: string): CatalogMenu
            getIngredient(id: string): any
            getAllergen(id: string): any
            getPromotion(id: string): any
            getGame(id: string): any
        }>
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
    get loyaltyCardCode(): string|null;
}

declare class Lottery {
    constructor(client: Client);
    operation(): Promise<LotteryOperation> | LotteryOperation;
    play(options?: LotteryPlayOptions): Promise<void>;
}

declare interface LotteryOperation {
    available: boolean,
    id: string
}

declare interface LotteryPlayOptions {
    ignoreIfUnavailable: boolean
}

declare interface AccountCreationOptions {
    email: string,
    password: string,
    birthdate: string | Date,
    optIn?: boolean,
    student?: boolean,
    favoriteRestaurant?: string
}

declare interface ClientOptions {
    fetchOnStartup?: FetchOnStartup[],
    proxy?: AxiosProxyConfig
}

declare interface OrderDetails {
    pickUpType: PickUpType,
    restaurantId: string,
    items: OrderItem[]
}

export enum PickUpType {
    PickUp = 'PICK_UP',
    OnSite = 'ON_SITE'
}

declare interface RestaurantType {
    id: string
}

export class OrderItem {
    id: string;
    label: string;
    originalPrice: number;
    quantity: number;
    subContent: [];
    fromMenu(menu: CatalogMenu): OrderItem;
    addItem(item, options?: OrderItemOptions): OrderItem;
    addSubItem(item, options?: OrderItemOptions): OrderItem;
    applyPromotion(promotion, client: Client): OrderItem;
}

declare interface OrderItemOptions {
    noIce?: boolean,
    pickUpLater?: boolean
}

declare interface Catalog {
    categories: [],
    subCategories: [],
    productGroups: [],
    products: CatalogProduct[],
    menus: CatalogMenu[],
    ingredients: [],
    allergens: [],
    promotions: [],
    games: [],
}

declare interface CatalogProduct {
    id: string,
    name: string
}

declare interface CatalogMenu {
    id: string,
    name: string
}

declare interface CatalogProductDrink {
    hasIce: boolean,
}

export type FetchOnStartup = 'COUPONS' | 'KINGDOM';

declare class RequestError extends Error {
    constructor(message: string, details: {
        msg?: string,
        status?: number
    });
}

export default Client;
