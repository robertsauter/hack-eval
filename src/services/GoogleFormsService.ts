import { Subject } from 'rxjs';
import type { Token } from '../models/Token';
import type { RawResponses } from '../models/RawHackathon';

/** Service for handling connection with Google API and fetching of surveys */
class GoogleFormsService {

    googleClient!: google.accounts.oauth2.TokenClient;
    /** Emits values every time new results are received, see getSurvey() */
    surveyResults$ = new Subject<RawResponses>();

    private _formId = '';
    private readonly _CLIENT_ID = '902889481638-5vemu7jb9jngml1lscsij07flp12mbup.apps.googleusercontent.com';

    constructor() {
        this.initialize = this.initialize.bind(this);
        this.setFormId = this.setFormId.bind(this);
        this.getSurvey = this.getSurvey.bind(this);
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
                this.getSurvey(token);
            }
        });
    }

    /** Set the form id */
    setFormId(formId: string) {
        this._formId = formId;
    }

    /** Get survey responses for a certain form id from google or request a new access token */
    async getSurvey(token: Token) {
        if(this._formId !== '') {
            const response: Response = await fetch(`https://forms.googleapis.com/v1/forms/${this._formId}/responses`, {
                headers: { 'Authorization': `Bearer ${token.access_token}` }
            });
            if(response.ok) {
                const data = await response.json();
                this.surveyResults$.next(data);
            }
            //If the given token is not valid: request user permission to get token
            else if(response.status === 401) {
                this.googleClient.requestAccessToken();
            }
        }
    }
}

export const googleFormsService = new GoogleFormsService();