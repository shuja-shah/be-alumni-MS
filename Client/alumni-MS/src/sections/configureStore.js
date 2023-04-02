/* configure the store */
import {
    configureStore,
    combineReducers,

} from "@reduxjs/toolkit";
import AuthReducer from "./auth";



const rootReducer = combineReducers({
    user: AuthReducer,
});

const store = configureStore({
    reducer: rootReducer,
}
);

export default store;
