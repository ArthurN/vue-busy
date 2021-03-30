import { ActionContext } from "vuex";

function promisedTimeout(timeMs: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), timeMs);
  });
}

export default {
  async simulateActivity(
    { dispatch }: ActionContext<unknown, unknown>,
    { name, waitTimeSec = 1, outcome }: { name: string; waitTimeSec: number; outcome?: string },
  ): Promise<void> {
    dispatch("busy/start", { name });
    await promisedTimeout(waitTimeSec * 1000);
    dispatch("busy/finish", { name, outcome });
  },

  async simulateActivityFailure(
    { dispatch }: ActionContext<unknown, unknown>,
    { name, waitTimeSec = 1 }: { name: string; waitTimeSec: number },
  ): Promise<void> {
    dispatch("busy/start", { name });
    await promisedTimeout(waitTimeSec * 1000);
    dispatch("busy/finish", { name, outcome: "error", data: { message: "This is a sample error message from your API" } });
  },
};
