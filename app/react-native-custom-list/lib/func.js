import {DeviceEventEmitter} from "react-native";
import {EVENT_FOOTER_INFINITE, EVENT_HEADER_REFRESH} from "./constant";

export const _onHeaderRefreshing = () => {
  setTimeout(() => {
    headerRefreshDone();
  }, 2000);
};

export const headerRefreshDone = () => DeviceEventEmitter.emit(EVENT_HEADER_REFRESH, true);
