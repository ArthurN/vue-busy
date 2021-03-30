import { createStore } from "vuex";
import VueBusy from "@/.";
import actions from "./actions";

export default createStore({
  state: {},
  mutations: {},
  actions,
  modules: {},
  plugins: [VueBusy],
});
