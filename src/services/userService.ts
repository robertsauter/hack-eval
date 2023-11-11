/** Register a new user */
export function register(formData: FormData): Promise<Response> {
    return fetch('http://127.0.0.1:8000/users', {
        method: 'POST',
        body: formData
    });
}

/** Login an existing user */
export function login(formData: FormData): Promise<Response> {
    return fetch('http://127.0.0.1:8000/users/login', {
        method: 'POST',
        body: formData
    });
}