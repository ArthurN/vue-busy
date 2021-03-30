import { GetterTree } from "vuex";
import { BusyActivity, BusyModuleState } from ".";

interface BusyGetters<S> extends GetterTree<S, unknown> {
  isBusy(state: S): (name: string) => boolean;
  getData(state: S): (name: string) => unknown;
  getOutcome(state: S): (name: string) => string | undefined;
  getDuration(state: S): (name: string) => number | undefined;
  filterByOutcome(state: S): (outcome: string | null) => string[];
  getBusy(state: S): (nameFilter?: string) => string[];
  getFinished(state: S): (nameFilter?: string) => string[];
}

const isFinishedTest = (busy: BusyActivity): boolean => {
  return busy.started !== undefined && busy.finished !== undefined;
};

const matchName = (inputWithWildcards: string, testName: string): boolean => {
  if (inputWithWildcards.indexOf("*") < 0) {
    return inputWithWildcards === testName;
  } else {
    const inputWithWildcardsForRegexp = inputWithWildcards.replace(/\*/g, ".*");
    const regexp = new RegExp(`^${inputWithWildcardsForRegexp}$`);
    return regexp.test(testName);
  }
};

const getters: BusyGetters<BusyModuleState> = {
  isBusy: (state) => (name) => {
    if (!state.activities[name]) {
      return false;
    }
    return !isFinishedTest(state.activities[name]);
  },

  getData: (state) => (name) => state.activities[name]?.data,
  getOutcome: (state) => (name) => state.activities[name]?.outcome,
  getDuration: (state) => (name) => {
    const activity = state.activities[name];
    return activity && activity.started && activity.finished ? activity.finished.valueOf() - activity.started.valueOf() : undefined;
  },

  filterByOutcome: (state) => (outcome) => {
    const outcomeCheckValue = outcome === null ? undefined : outcome;
    return Object.keys(state.activities).filter(
      (name) => isFinishedTest(state.activities[name]) && state.activities[name]?.outcome === outcomeCheckValue,
    );
  },

  getBusy: (state) => (nameFilter) => {
    const activities = Object.keys(state.activities).filter((name) => !isFinishedTest(state.activities[name]));
    return nameFilter === undefined ? activities : activities.filter((name) => matchName(nameFilter, name));
  },

  getFinished: (state) => (nameFilter) => {
    const activities = Object.keys(state.activities).filter((name) => isFinishedTest(state.activities[name]));
    return nameFilter === undefined ? activities : activities.filter((name) => matchName(nameFilter, name));
  },
};
export default getters;
