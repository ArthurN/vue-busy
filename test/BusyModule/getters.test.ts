import { BusyModuleState } from "@/BusyModule";
import getters from "@/BusyModule/getters";
import mutations from "@/BusyModule/mutations";
import { createStore, Store } from "vuex";

const arrangeStore = (state: BusyModuleState = { activities: {} }) => {
  return createStore({ state, getters, mutations });
};

let store: Store<unknown>;

describe("BusyGetters", () => {
  beforeEach(() => {
    store = arrangeStore();
  });

  describe("isBusy", () => {
    it("returns false if activity does not exist", () => {
      expect(store.getters["isBusy"]("any-key")).toEqual(false);
    });

    it("returns false if activity has already finished", () => {
      const payload = { name: "someApiRequest" };
      store.commit("START", payload);
      store.commit("FINISH", payload);

      expect(store.getters["isBusy"]("someApiRequest")).toEqual(false);
    });

    it("returns true if activity has been started and not yet finished", () => {
      store.commit("START", { name: "someApiRequest" });

      expect(store.getters["isBusy"]("someApiRequest")).toEqual(true);
    });
  });

  describe("getData", () => {
    it("returns undefined if activity does not exist", () => {
      expect(store.getters["getData"]("any-key")).toBeUndefined();
    });

    it("returns undefined if activity exists but data is not present", () => {
      store.commit("START", { name: "someApiRequest" });

      expect(store.getters["getData"]("someApiRequest")).toBeUndefined();
    });

    it("returns activity data", () => {
      store.commit("START", { name: "someApiRequest", data: { startKey: "A" } });
      expect(store.getters["getData"]("someApiRequest")).toEqual({ startKey: "A" });

      store.commit("FINISH", { name: "someApiRequest", data: { finishKey: "B" } });
      expect(store.getters["getData"]("someApiRequest")).toEqual({ startKey: "A", finishKey: "B" });
    });
  });

  describe("getOutcome", () => {
    it("returns undefined if activity does not exist", () => {
      expect(store.getters["getOutcome"]("any-key")).toBeUndefined();
    });

    it("returns undefined if activity has not yet finished", () => {
      store.commit("START", { name: "someApiRequest" });

      expect(store.getters["getOutcome"]("someApiRequest")).toBeUndefined();
    });

    it("returns undefined if activity has finished but outcome was not specified", () => {
      const payload = { name: "someApiRequest" };
      store.commit("START", payload);
      store.commit("FINISH", payload);

      expect(store.getters["getOutcome"]("someApiRequest")).toBeUndefined();
    });

    it("returns outcome if activity finished w/ string outcome", () => {
      const payload = { name: "someApiRequest" };
      store.commit("START", payload);
      store.commit("FINISH", { ...payload, outcome: "success" });
      expect(store.getters["getOutcome"]("someApiRequest")).toEqual("success");
    });
  });

  describe("getDuration", () => {
    it("returns undefined if activity doesn't exist", () => {
      expect(store.getters["getDuration"]("any-key")).toBeUndefined();
    });

    it("returns undefined if activity hasn't finished", () => {
      store.commit("START", { name: "someApiRequest" });

      expect(store.getters["getDuration"]("someApiRequest")).toBeUndefined();
    });

    it("returns difference between finish and start times", () => {
      // Hard-wiring state instead of using commit so we can control timestamps precisely
      store = arrangeStore({
        activities: {
          someApiRequest: {
            started: new Date(0),
            finished: new Date(50),
          },
        },
      });

      expect(store.getters["getDuration"]("someApiRequest")).toEqual(50);
    });
  });

  describe("filterByOutcome", () => {
    it("returns an empty Array if no activities", () => {
      expect(store.getters["filterByOutcome"]("error")).toEqual([]);
    });

    it("returns an empty Array if no activities match outcome", () => {
      store.commit("START", { name: "unfinishedactivity" });
      for (const [name, outcome] of Object.entries({ activity1: "unknown", activity2: "failed", activity3: "error" })) {
        store.commit("START", { name });
        store.commit("FINISH", { name, outcome });
      }

      expect(store.getters["filterByOutcome"]("success")).toEqual([]);
    });

    it("returns activity names matching string outcome", () => {
      store.commit("START", { name: "unfinishedactivity" });
      for (const [name, outcome] of Object.entries({ activity1: "success", activity2: "error", activity3: "success" })) {
        store.commit("START", { name });
        store.commit("FINISH", { name, outcome });
      }

      expect(store.getters["filterByOutcome"]("success")).toEqual(["activity1", "activity3"]);
    });

    it("returns activity names with no outcome if null passed", () => {
      store.commit("START", { name: "unfinishedactivity" });
      for (const [name, outcome] of Object.entries({ activity1: "success", activity2: undefined, activity3: "success" })) {
        store.commit("START", { name });
        store.commit("FINISH", { name, outcome });
      }

      expect(store.getters["filterByOutcome"](null)).toEqual(["activity2"]);
    });
  });

  describe("getBusy", () => {
    it("returns an empty Array if no activities", () => {
      expect(store.getters["getBusy"]()).toEqual([]);
    });

    it("returns an empty Array if all activities have finished", () => {
      for (const name of ["activity1", "activity2", "activity3"]) {
        store.commit("START", { name });
        store.commit("FINISH", { name });
      }

      expect(store.getters["getBusy"]()).toEqual([]);
    });

    it("returns names for all activities which have started but not yet finished", () => {
      for (const [name, finished] of Object.entries({ activity1: true, activity2: false, activity3: true, activity4: false })) {
        store.commit("START", { name });
        if (finished) {
          store.commit("FINISH", { name });
        }
      }

      expect(store.getters["getBusy"]()).toEqual(["activity2", "activity4"]);
    });

    it("filters activities names with wildcard if provided", () => {
      for (const name of ["activity/extract", "activity/transfer", "activity/load", "activityX", "process/load", "sweep-loader", "api-request"]) {
        store.commit("START", { name });
      }

      expect(store.getters["getBusy"]("activity/*")).toEqual(["activity/extract", "activity/transfer", "activity/load"]);
      expect(store.getters["getBusy"]("load")).toEqual([]);
      expect(store.getters["getBusy"]("*load")).toEqual(["activity/load", "process/load"]);
      expect(store.getters["getBusy"]("*load*")).toEqual(["activity/load", "process/load", "sweep-loader"]);
      expect(store.getters["getBusy"]("sweep-loader")).toEqual(["sweep-loader"]);
    });
  });

  describe("getFinished", () => {
    it("returns an empty Array if no activities", () => {
      expect(store.getters["getFinished"]()).toEqual([]);
    });

    it("returns an empty Array if no activities have finished", () => {
      for (const name of ["activity1", "activity2", "activity3"]) {
        store.commit("START", { name });
      }

      expect(store.getters["getFinished"]()).toEqual([]);
    });

    it("returns names of all finished activities", () => {
      for (const [name, finished] of Object.entries({ activity1: true, activity2: false, activity3: true, activity4: false })) {
        store.commit("START", { name });
        if (finished) {
          store.commit("FINISH", { name });
        }
      }

      expect(store.getters["getFinished"]()).toEqual(["activity1", "activity3"]);
    });

    it("filters activity names with wildcard if provided", () => {
      // started but not finished:
      for (const name of ["activity1", "activity2", "activity3"]) {
        store.commit("START", { name });
      }
      // finished:
      for (const name of ["activity/extract", "activity/transfer", "activity/load", "activityX", "process/load", "sweep-loader", "api-request"]) {
        store.commit("START", { name });
        store.commit("FINISH", { name });
      }

      expect(store.getters["getFinished"]("activity/*")).toEqual(["activity/extract", "activity/transfer", "activity/load"]);
      expect(store.getters["getFinished"]("load")).toEqual([]);
      expect(store.getters["getFinished"]("*load")).toEqual(["activity/load", "process/load"]);
      expect(store.getters["getFinished"]("*load*")).toEqual(["activity/load", "process/load", "sweep-loader"]);
      expect(store.getters["getFinished"]("sweep-loader")).toEqual(["sweep-loader"]);
    });
  });
});
