import { Subject } from 'rxjs';

type State = 'loading' | 'error' | 'success';

class AsyncState {
    stateChanges$ = new Subject<{
        state: State,
        message?: string
    }>();

    setLoading() {
        this.stateChanges$.next({ state: 'loading' });
    }

    setError(message?: string) {
        this.stateChanges$.next({ state: 'error', message });
    }

    setSuccess() {
        this.stateChanges$.next({ state: 'success' });
    }
}

export const loginState = new AsyncState();
export const registerState = new AsyncState();