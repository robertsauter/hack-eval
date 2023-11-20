import { Token } from '../models/Token';
import { BehaviorSubject } from 'rxjs';

/** Service for handling connection with Google API and fetching of surveys */
class GoogleFormsService {

    googleClient!: google.accounts.oauth2.TokenClient;

    private _formId = new BehaviorSubject<string>('');
    private readonly _CLIENT_ID = '902889481638-5vemu7jb9jngml1lscsij07flp12mbup.apps.googleusercontent.com';

    constructor() {
        this.initialize = this.initialize.bind(this);
        this.setNewFormId = this.setNewFormId.bind(this);
        this.getAndSaveSurvey = this.getAndSaveSurvey.bind(this);
    }

    /** Load google client */
    initialize() {
        //Scope defines which data of a google account can be accessed by the application
        this.googleClient = google.accounts.oauth2.initTokenClient({
            client_id: this._CLIENT_ID,
            scope: 'https://www.googleapis.com/auth/forms.responses.readonly',
            callback: (token: Token) => {
                //As soon as the token is received, make a request to get the survey responses
                window.sessionStorage.setItem('google_access_token', JSON.stringify(token));
                this.getAndSaveSurvey(token);
            }
        });
    }

    /** Set the form id */
    setNewFormId(formId: string) {
        this._formId.next(formId);
    }

    /** Get survey responses for a certain form id from google and send a backend request to save the responses */
    async getAndSaveSurvey(token: Token) {
        const id = this._formId.getValue();
        if(id && id !== '') {
            const response: Response = await fetch(`https://forms.googleapis.com/v1/forms/${id}/responses`, {
                headers: { 'Authorization': `Bearer ${token.access_token}` }
            });
            if(response.ok) {
                const data = await response.json();
                console.log(data);
            }
            //If the given token is not valid: request user permission to get token
            else if(response.status === 401) {
                this.googleClient.requestAccessToken();
            }
        }
    }
}

export const googleFormsService = new GoogleFormsService();