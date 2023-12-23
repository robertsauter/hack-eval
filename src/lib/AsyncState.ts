import { Subject } from 'rxjs';

export type State = 'initial' | 'loading' | 'error' | 'success';

/** Base class for submitting loading state of an async call */
class AsyncState {
    stateChanges$ = new Subject<{
        state: State,
        message?: string
    }>();

    setInitial() {
        this.stateChanges$.next({ state: 'initial' });
    }

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

export const asyncLoginState = new AsyncState();
export const asyncRegisterState = new AsyncState();