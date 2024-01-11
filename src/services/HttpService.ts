import type { RequestOptions } from '../models/RequestOptions';
import type { Token } from '../models/Token';

/** Service for handling http requests */
class HttpService {

    /** The base URL will be added to all outgoing requests */
    readonly #BASE_URL = 'http://127.0.0.1:8000';

    /** All relative URLs, where no token should be sent */
    readonly #ADD_TOKEN_BLACKLIST = [
        '/users/login',
        '/users'
    ];

    constructor() {
        this.get = this.get.bind(this);
        this.post = this.post.bind(this);
    }

    /** A GET request to a relative URL, starting from the base URL */
    get(relativeUrl: string, options: RequestOptions, defaultContentType?: boolean): Promise<Response> {
        let processedOptions = this.#addTokenToRequest(relativeUrl, options);
        if(defaultContentType) {
            processedOptions = this.#setDefaultContentType(processedOptions);
        }
        return fetch(`${this.#BASE_URL}${relativeUrl}`, processedOptions);
    }

    /** A POST request to a relative URL, starting from the base URL */
    post(relativeUrl: string, options: RequestOptions, defaultContentType?: boolean): Promise<Response> {
        let processedOptions = this.#addTokenToRequest(relativeUrl, options);
        processedOptions.method = 'POST';
        if(defaultContentType) {
            processedOptions = this.#setDefaultContentType(processedOptions);
        }
        return fetch(`${this.#BASE_URL}${relativeUrl}`, processedOptions);
    }

    /** Return new options object, with application/json added as content-type and body stringified */
    #setDefaultContentType(options: RequestOptions): RequestOptions {
        const defaultContentTypeOptions = { ...options };
        defaultContentTypeOptions.headers?.set('Content-Type', 'application/json');
        defaultContentTypeOptions.body = JSON.stringify(defaultContentTypeOptions.body);
        return defaultContentTypeOptions;
    }

    /** Return new request with added access token, if the url is not in the blacklist */
    #addTokenToRequest(relativeUrl: string, options: RequestOptions): RequestOptions {
        const token = localStorage.getItem('access_token');
        const isUrlInBlacklist = this.#ADD_TOKEN_BLACKLIST.find((url) => relativeUrl === url);
        if(!isUrlInBlacklist && token) {
            const parsedToken: Token = JSON.parse(token);
            const headers = new Headers(options.headers);
            headers.append('Authorization', `Bearer ${parsedToken.access_token}`);
            return {
                ...options,
                headers
            };
        }
        return options;
    }
}

export const httpService = new HttpService();