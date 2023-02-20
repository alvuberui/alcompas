export const notAuthenticatedState = {
    status: 'not-authenticated', // 'checking', 'not-authenticated', 'authenticated'
    user: null,
    errorMessage: null,
}

export const initialState = {
    status: 'checking',
    user: {},
    errorMessage: undefined,
}

export const authenticatedState = {
    status: 'autenticado',
    user: {
        uid: '62a10a4954e8230e568a49ab',
        nombre: 'Fernando'
    },
    errorMessage: undefined,
}

export const authenticatedState2 = {
    status: 'autenticado',
    user: {
        uid: '63efa3b862b6fc7b8a318e68',
        nombre: 'Álvaro'
    },
    errorMessage: undefined,
}