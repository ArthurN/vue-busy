import { MutationTree } from "vuex";
import { BusyActivity, BusyModuleState } from ".";

export type StartOptions = { name: string } & Pick<BusyActivity, "data">;
export type FinishOptions = { name: string } & Pick<BusyActivity, "outcome" | "data">;

interface BusyMutations<S> extends MutationTree<S> {
  START(state: S, options: StartOptions): void;
  FINISH(state: S, options: FinishOptions): void;
}

const mutations: BusyMutations<BusyModuleState> = {
  START(state, { name, data }) {
    state.activities[name] = {
      started: new Date(),
      data,
    };
  },

  FINISH(state, { name, data, outcome }) {
    if (state.activities[name] === undefined) {
      throw new Error(`Never started ${name}`);
    }

    const originalData = state.activities[name].data;
    const finishData = originalData ? { ...originalData, ...data } : data;

    state.activities[name] = {
      ...state.activities[name],
      finished: new Date(),
      data: finishData,
      outcome,
    };
  },
};
export default mutations;
