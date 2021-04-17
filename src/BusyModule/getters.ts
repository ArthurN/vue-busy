import { BusyActivity, BusyGetters } from "types";
import { BusyModuleState } from ".";

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
