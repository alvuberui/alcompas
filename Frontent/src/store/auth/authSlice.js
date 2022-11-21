import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        status: 'checking', // 'authenticated', 'not-authenticated'
        user: {},
        userById: {},
        errorMessage: undefined,
    },
    reducers: {
        onChecking: (state) => {
            state.status = 'checking';
            state.user = {};
            state.errorMessage = undefined;
        },
        onLogin: (state, { payload }) => {
            state.status = 'autenticado';
            state.user = payload;
            state.errorMessage = undefined;
        },
        onLogout: (state, { payload }) => {
            state.status = 'no-autenticado';
            state.user = {};
            state.errorMessage = payload;
        },
        ClearErrorMessage: ( state ) => {
            state.errorMessage = undefined;
        },
    }
});

export const { onChecking, onLogin, onLogout, ClearErrorMessage, onLoadUserById } = authSlice.actions;