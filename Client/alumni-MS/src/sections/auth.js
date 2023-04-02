const SET_USER = 'alumni-MS/Redux/SET_USER';
const USER_DET = 'alumni-MS/Redux/USER_DET';


// Action Creators

export const setUser = (payload) => ({
    type: SET_USER,
    payload
});

export const userDet = (payload) => ({
    type: USER_DET,
    payload
});

const initialState = {
    auth: {},
    user: {}
};

// Reducer

export default function AuthReducer(state = initialState, action) {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                auth: action.payload
            };
        case USER_DET:
            return {
                ...state,
                user: action.payload
            };
        default:
            return state;
    }
}
