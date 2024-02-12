import { Subject } from 'rxjs';
import type { Token } from '../models/Token';
import { RawHackathon } from '../models/RawHackathon';

/** Service for handling connection with Google API and fetching of surveys */
class GoogleFormsService {

    googleClient!: google.accounts.oauth2.TokenClient;
    /** Emits values every time new results are received, see getSurvey() */
    surveyResults$ = new Subject<Partial<RawHackathon>>();

    #formId = '';
    readonly #CLIENT_ID = '902889481638-5vemu7jb9jngml1lscsij07flp12mbup.apps.googleusercontent.com';

    constructor() {
        this.initialize = this.initialize.bind(this);
        this.setFormId = this.setFormId.bind(this);
        this.getSurvey = this.getSurvey.bind(this);
    }

    /** Load google client */
    initialize() {
        if(google) {
            //Scope defines which data of a google account can be accessed by the application
            this.googleClient = google.accounts.oauth2.initTokenClient({
                client_id: this.#CLIENT_ID,
                scope: 'https://www.googleapis.com/auth/forms.body.readonly https://www.googleapis.com/auth/forms.responses.readonly',
                callback: (token: Token) => {
                    //As soon as the token is received, make a request to get the survey responses
                    window.sessionStorage.setItem('google_access_token', JSON.stringify(token));
                    this.getSurvey(token);
                }
            });
        }
    }

    /** Set the form id */
    setFormId(formId: string) {
        this.#formId = formId;
    }

    /** Get survey responses for a certain form id from google or request a new access token */
    async getSurvey(token: Token) {
        if(this.#formId !== '') {
            const [survey, surveyResponses] = await Promise.all(
                [
                    fetch(`https://forms.googleapis.com/v1/forms/${this.#formId}`, {
                        headers: { 'Authorization': `Bearer ${token.access_token}` }
                    }),
                    fetch(`https://forms.googleapis.com/v1/forms/${this.#formId}/responses`, {
                        headers: { 'Authorization': `Bearer ${token.access_token}` }
                    })
                ]
            );
            if(survey.ok && surveyResponses.ok) {
                const [surveyData, surveyResponsesData] = await Promise.all([
                    survey.json(),
                    surveyResponses.json()
                ]);
                this.surveyResults$.next({
                    survey: surveyData,
                    results: surveyResponsesData
                });
            }
            //If the given token is not valid: request user permission to get token
            else if(survey.status === 401 || surveyResponses.status === 401) {
                this.googleClient.requestAccessToken();
            }
        }
    }
}

export const googleFormsService = new GoogleFormsService();