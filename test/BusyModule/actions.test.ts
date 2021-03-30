import actions from "@/BusyModule/actions";
import { FinishOptions, StartOptions } from "@/BusyModule/mutations";
import { ActionContextMock } from "../support/vuex-helpers";

describe("BusyActions", () => {
  describe("start", () => {
    it("commits START mutation", () => {
      const options: StartOptions = { name: "activity", data: { key: "value" } };
      const mockActionContext = ActionContextMock();

      actions.start(mockActionContext, options);

      expect(mockActionContext.commit).toHaveBeenCalledWith("busy/START", options, { root: true });
    });
  });
  describe("finish", () => {
    it("commits FINISH mutation", () => {
      const options: FinishOptions = { name: "activity", data: { key: "value" }, outcome: "success" };
      const mockActionContext = ActionContextMock();

      actions.finish(mockActionContext, options);

      expect(mockActionContext.commit).toHaveBeenCalledWith("busy/FINISH", options, { root: true });
    });
  });
});
