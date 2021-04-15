import { ActionContext, ActionTree } from "vuex";
import { BusyModuleState } from ".";
import { FinishOptions, StartOptions } from "./mutations";
interface BusyActions<S> extends ActionTree<S, unknown> {
    start(ctx: ActionContext<S, unknown>, options: StartOptions): void;
    finish(ctx: ActionContext<S, unknown>, options: FinishOptions): void;
}
declare const actions: BusyActions<BusyModuleState>;
export default actions;
