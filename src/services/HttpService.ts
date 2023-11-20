import { Token } from "../models/Token";

/** Service for handling http requests */
class HttpService {

    /** The base URL will be added to all outgoing requests */
    private _baseUrl = 'http://127.0.0.1:8000';

    /** All relative URLs, where no token should be sent */
    private _addTokenBlacklist = [
        '/users/login',
        '/users'
    ];

    constructor() {
        this.get = this.get.bind(this);
        this.post = this.post.bind(this);
    }

    /** A GET request to a relative URL, starting from the base URL */
    get(relativeUrl: string, options: RequestInit) {
        const processedOptions = this._addTokenToRequest(relativeUrl, options);
        return fetch(`${this._baseUrl}${relativeUrl}`, processedOptions);
    }

    /** A POST request to a relative URL, starting from the base URL */
    post(relativeUrl: string, options: RequestInit) {
        const processedOptions = this._addTokenToRequest(relativeUrl, options);
        processedOptions.method = 'POST';
        return fetch(`${this._baseUrl}${relativeUrl}`, processedOptions);
    }

    /** Return new request with added access token, if the url is not in the blacklist */
    private _addTokenToRequest(relativeUrl: string, options: RequestInit): RequestInit {
        const token = localStorage.getItem('access_token');
        const isUrlInBlacklist = this._addTokenBlacklist.find((url) => relativeUrl === url);
        if(!isUrlInBlacklist && token) {
            const parsed_token: Token = JSON.parse(token);
            const headers = new Headers(options.headers);
            headers.append('Authorization', `Bearer ${parsed_token.access_token}`);
            return {
                ...options,
                headers
            };
        }
        return options;
    }
}

export const httpService = new HttpService();