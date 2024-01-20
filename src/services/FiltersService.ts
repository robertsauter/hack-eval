import { Subject } from 'rxjs';
import { FilterCombination } from '../models/FilterCombination';
import { httpService } from './HttpService';

/** Service for handling the saved filter combinations */
class FiltersService {

    /** Can be used to listen for the deletion of a preset */
    filterSaved$ = new Subject<FilterCombination>();

    /** Save a filter combination */
    saveFilterCombination(filter: FilterCombination) {
        return httpService.post('/filters', { body: filter }, true);
    }

    /** Get all filter combinations of the currently logged in user */
    getFiltersOfLoggedInUser() {
        return httpService.get('/filters', {});
    }

    /** Delete a preset from the database */
    deleteFilterCombination(id: string) {
        return httpService.delete(`/filters/${id}`, {});
    }

    /** Emit a preset deleted event */
    emitFilterSaved(filter: FilterCombination) {
        this.filterSaved$.next(filter);
    }
}

export const filtersService = new FiltersService();