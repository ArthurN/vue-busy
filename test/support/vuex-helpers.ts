import { ActionContext } from "vuex";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ActionContextMock = jest.fn<ActionContext<any, any>, any[]>(() => ({
  state: {},
  commit: jest.fn(),
  dispatch: jest.fn(),
  getters: {},
  rootState: {},
  rootGetters: {},
}));
