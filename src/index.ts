import { Store } from "vuex";
import { BusyModule } from "./BusyModule";

export const VueBusyModule = <S>(store: Store<S>): void => {
  store.registerModule("busy", new BusyModule());
};

export default VueBusyModule;
