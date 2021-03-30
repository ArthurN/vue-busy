import { ActionContext, ActionTree } from "vuex";
import { BusyModuleState } from ".";
import { FinishOptions, StartOptions } from "./mutations";

interface BusyActions<S> extends ActionTree<S, unknown> {
  start(ctx: ActionContext<S, unknown>, options: StartOptions): void;
  finish(ctx: ActionContext<S, unknown>, options: FinishOptions): void;
}

const actions: BusyActions<BusyModuleState> = {
  start({ commit }, options) {
    commit("busy/START", options, { root: true });
  },

  finish({ commit }, options) {
    commit("busy/FINISH", options, { root: true });
  },
};

export default actions;
