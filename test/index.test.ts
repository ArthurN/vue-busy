import VueBusyModule from "@/.";
import { createStore } from "vuex";

describe("VueBusyModule", () => {
  it("registers namespaced Vuex module", () => {
    const store = createStore({
      state: {},
      plugins: [VueBusyModule],
    });

    expect(store.state).toEqual({ busy: { activities: {} } });
  });
});
