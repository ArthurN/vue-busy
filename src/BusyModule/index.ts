import { Module } from "vuex";
import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

export interface BusyActivity {
  started: Date;
  finished?: Date;
  outcome?: string;
  data?: {
    [key: string]: unknown;
  };
}

export class BusyModuleState {
  public activities: {
    [activity: string]: BusyActivity;
  } = {};
}

export class BusyModule implements Module<BusyModuleState, unknown> {
  public state = new BusyModuleState();
  public getters = getters;
  public actions = actions;
  public mutations = mutations;
  public namespaced = true;
}
