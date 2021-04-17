import { BusyActions } from "index";
import { BusyModuleState } from ".";

const actions: BusyActions<BusyModuleState> = {
  start({ commit }, options) {
    commit("busy/START", options, { root: true });
  },

  finish({ commit }, options) {
    commit("busy/FINISH", options, { root: true });
  },
};

export default actions;
