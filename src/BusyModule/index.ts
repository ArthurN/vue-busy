import { BusyActivity } from "types";
import { Module } from "vuex";
import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

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
