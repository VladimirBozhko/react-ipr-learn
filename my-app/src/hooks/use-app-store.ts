import React from "react";
import {AppStore} from "../store";
import {TransportLayer} from "../services/transport-layer";

const store = new AppStore(new TransportLayer());
const storeContext = React.createContext(store);

export function useAppStore() {
  return React.useContext(storeContext);
}