import { MutationTree } from "vuex";
import { BusyActivity, BusyModuleState } from ".";
export declare type StartOptions = {
    name: string;
} & Pick<BusyActivity, "data">;
export declare type FinishOptions = {
    name: string;
} & Pick<BusyActivity, "outcome" | "data">;
interface BusyMutations<S> extends MutationTree<S> {
    START(state: S, options: StartOptions): void;
    FINISH(state: S, options: FinishOptions): void;
}
declare const mutations: BusyMutations<BusyModuleState>;
export default mutations;
