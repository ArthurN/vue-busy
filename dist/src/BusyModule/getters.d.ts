import { GetterTree } from "vuex";
import { BusyModuleState } from ".";
interface BusyGetters<S> extends GetterTree<S, unknown> {
    isBusy(state: S): (name: string) => boolean;
    getData(state: S): (name: string) => unknown;
    getOutcome(state: S): (name: string) => string | undefined;
    getDuration(state: S): (name: string) => number | undefined;
    filterByOutcome(state: S): (outcome: string | null) => string[];
    getBusy(state: S): (nameFilter?: string) => string[];
    getFinished(state: S): (nameFilter?: string) => string[];
}
declare const getters: BusyGetters<BusyModuleState>;
export default getters;
