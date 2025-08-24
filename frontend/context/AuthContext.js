'use client'

import {createContext, useReducer, useEffect} from 'react'

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch(action.type){
    case 'LOGIN':
      return {userInfo: action.payload}
    case 'LOGOUT':
      return {userInfo: null}
    case 'AUTH_READY':
      return { ...state, authIsReady: true };
    default:
      return state
  }

}

export const AuthContextProvider = ({children}) => {
  const [state, dispatch] = useReducer(authReducer, {
    userInfo: null,
    authIsReady: false,
  })

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))

    if(userInfo){
      dispatch({type: "LOGIN", payload: userInfo})
    }

    dispatch({type: "AUTH_READY"});

  }, [])


  return(
    <AuthContext.Provider value={{...state, dispatch}}>
      {children}
    </AuthContext.Provider>

  )

}


