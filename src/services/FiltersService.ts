import { Subject } from 'rxjs';
import { FilterCombination } from '../models/FilterCombination';
import { httpService } from './HttpService';

/** Service for handling the saved filter combinations */
class FiltersService {

    /** Can be used to listen for saving of a preset */
    filterSaved$ = new Subject<FilterCombination>();

    /** Can be used to listen for when the filters have been updated */
    filtersUpdated$ = new Subject<FilterCombination[]>();

    /** Can be used to listen for when the filters drawer is opened or closed */
    filtersOpen$ = new Subject<boolean>();

    constructor() {
        this.emitFilterSaved = this.emitFilterSaved.bind(this);
        this.emitToggleFilters = this.emitToggleFilters.bind(this);
        this.emitFiltersUpdated = this.emitFiltersUpdated.bind(this);
    }

    /** Save a filter combination */
    saveFilterCombination(filter: FilterCombination) {
        return httpService.post('/filters', { body: filter }, true);
    }

    /** Get all filter combinations of the currently logged in user */
    getFiltersOfLoggedInUser() {
        return httpService.get('/filters');
    }

    /** Delete a preset from the database */
    deleteFilterCombination(id: string) {
        return httpService.delete(`/filters/${id}`);
    }

    /** Emit a preset saved event */
    emitFilterSaved(filter: FilterCombination) {
        this.filterSaved$.next(filter);
    }

    /** Emit a filters updated event */
    emitFiltersUpdated(filters: FilterCombination[]) {
        this.filtersUpdated$.next(filters);
    }

    /** Emit a filters drawer toggle event */
    emitToggleFilters(open: boolean) {
        this.filtersOpen$.next(open);
    }
}

export const filtersService = new FiltersService();