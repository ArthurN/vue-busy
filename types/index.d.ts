import { ActionTree, GetterTree, MutationTree } from "vuex";

export declare interface BusyActivity {
  started: Date;
  finished?: Date;
  outcome?: string;
  data?: {
    [key: string]: unknown;
  };
}

export declare type StartOptions = { name: string } & Pick<BusyActivity, "data">;
export declare type FinishOptions = { name: string } & Pick<BusyActivity, "outcome" | "data">;

declare interface BusyMutations<S> extends MutationTree<S> {
  START(state: S, options: StartOptions): void;
  FINISH(state: S, options: FinishOptions): void;
}

declare interface BusyActions<S> extends ActionTree<S, unknown> {
  start(ctx: ActionContext<S, unknown>, options: StartOptions): void;
  finish(ctx: ActionContext<S, unknown>, options: FinishOptions): void;
}

declare interface BusyGetters<S> extends GetterTree<S, unknown> {
  isBusy(state: S): (name: string) => boolean;
  getData(state: S): (name: string) => unknown;
  getOutcome(state: S): (name: string) => string | undefined;
  getDuration(state: S): (name: string) => number | undefined;
  filterByOutcome(state: S): (outcome: string | null) => string[];
  getBusy(state: S): (nameFilter?: string) => string[];
  getFinished(state: S): (nameFilter?: string) => string[];
}
