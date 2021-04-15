import { ActionContext } from "vuex";
declare const _default: {
    simulateActivity({ dispatch }: ActionContext<unknown, unknown>, { name, waitTimeSec, outcome }: {
        name: string;
        waitTimeSec: number;
        outcome?: string | undefined;
    }): Promise<void>;
    simulateActivityFailure({ dispatch }: ActionContext<unknown, unknown>, { name, waitTimeSec }: {
        name: string;
        waitTimeSec: number;
    }): Promise<void>;
};
export default _default;
