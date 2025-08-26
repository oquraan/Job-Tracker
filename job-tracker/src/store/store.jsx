import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import UserInfoSliceReducer from "./infoUser";
const persistLocalStorage = {
  key: "UserInfo",
  storage,
};

const persistInfoUserReduser = persistReducer(
  persistLocalStorage,
  UserInfoSliceReducer
);

const store = configureStore({
  reducer: { UserInfo: persistInfoUserReduser },
});
export const customPersisor = persistStore(store);

export default store;
