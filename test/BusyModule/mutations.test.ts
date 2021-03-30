import { BusyModuleState } from "@/BusyModule";
import { createStore, Store } from "vuex";
import mutations from "@/BusyModule/mutations";

const arrangeStore = (state: BusyModuleState = { activities: {} }) => {
  return createStore({ state, mutations });
};

describe("BusyMutations", () => {
  describe("START", () => {
    const SAMPLE_NAMES = ["name.with.periods", "name-with-dashes", "name with spaces", "everything-bagel.com/with lox & capers"];
    test.each(SAMPLE_NAMES)("supports various naming styles [%s]", (name) => {
      const store = arrangeStore();
      store.commit("START", { name });
      expect(store.state.activities[name]).toBeDefined();
    });

    it("captures the start time and any user data", () => {
      const store = arrangeStore();
      const data = { myCode: 12345, messageText: "test" };

      store.commit("START", { name: "someActivity", data });

      expect(store.state.activities).toEqual(
        expect.objectContaining({
          someActivity: expect.objectContaining({
            started: expect.any(Date),
            data: expect.any(Object),
          }),
        }),
      );
      expect(store.state.activities.someActivity.data).toEqual(data);
    });

    it("overwrites existing unfinished instance if one already exists with the same name", () => {
      const originalStarted = new Date(0);
      const state = {
        activities: {
          someActivity: {
            started: originalStarted,
            data: { testKey: true },
          },
        },
      };
      const store = arrangeStore(state);

      store.commit("START", { name: "someActivity", data: { differentKey: "hello" } });

      const someActivity = store.state.activities.someActivity;
      expect(someActivity.data?.testKey).toBeUndefined();
      expect(someActivity.data?.differentKey).toEqual("hello");
      expect(someActivity.started).not.toEqual(new Date(0));
    });

    it("overwrites existing finished instance with the same name", () => {
      const originalStarted = new Date(0);
      const state = {
        activities: {
          someActivity: {
            started: originalStarted,
            finished: new Date(),
            data: { testKey: true },
            outcome: "success",
          },
        },
      };
      const store = arrangeStore(state);

      store.commit("START", { name: "someActivity", data: { differentKey: "hello" } });

      const someActivity = store.state.activities.someActivity;
      expect(someActivity.data?.testKey).toBeUndefined();
      expect(someActivity.data?.differentKey).toEqual("hello");
      expect(someActivity.started).not.toEqual(new Date(0));
      expect(someActivity.outcome).toBeUndefined();
      expect(someActivity.finished).toBeUndefined();
    });
  });

  describe("FINISH", () => {
    let state;
    let store: Store<BusyModuleState>;

    beforeEach(() => {
      state = {
        activities: {
          someActivity: {
            started: new Date(),
            data: {
              keyFromStart: 1,
              keyToBeOverwritten: "start",
            },
          },
        },
      };
      store = arrangeStore(state);
    });

    it("throws error if activity does not exist", () => {
      expect.hasAssertions();
      try {
        store.commit("FINISH", { name: "activity-doesnt-exist" });
      } catch (e) {
        expect(e).toBeDefined();
        expect(e.toString()).toMatch(/Never started/);
      }
    });

    it("captures finish time, outcome, & merges finish data with original data", () => {
      store.commit("FINISH", {
        name: "someActivity",
        outcome: "error",
        data: {
          keyFromFinish: 2,
          keyToBeOverwritten: "finish",
        },
      });

      const someActivity = store.state.activities.someActivity;
      expect(someActivity).toEqual(
        expect.objectContaining({
          started: expect.any(Date),
          finished: expect.any(Date),
          outcome: "error",
        }),
      );
      expect(someActivity.data).toEqual({
        keyFromStart: 1,
        keyFromFinish: 2,
        keyToBeOverwritten: "finish",
      });
    });

    it("retains start data if no finish data provided", () => {
      store.commit("FINISH", { name: "someActivity" });

      const someActivity = store.state.activities.someActivity;
      expect(someActivity.data).toEqual({
        keyFromStart: 1,
        keyToBeOverwritten: "start",
      });
    });
  });
});
