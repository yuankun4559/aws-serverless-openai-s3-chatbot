// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState, useContext, createContext } from "react";
import { loginAuth } from "./apigw";

const authContext = createContext();

export function ProvideAuth({ children }) {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
  }

export function useAuthSignout () {
    const auth = useProvideAuth();
    return auth.signout;
}


export function useAuthUserInfo(){
    const auth = useAuth();
    return auth;
  }

export function useAuthToken(){
  const auth = useAuth();
  const token = auth.user?auth.user.body.token:'';
  return {'token':'Bearer '+token}
}
export function useAuthorizedHeader(){
  console.log('2222222');
    const auth = useAuth();
    const localToken = localStorage.getItem('token') || ''
    const token = auth.user ? auth.user.body.token : localToken !== '' ? localToken : '';
    
    return {
            'Content-Type':'application/json;charset=utf-8',
            'Authorization':'Bearer '+token
        };
  }

// Hook for child components to get the auth object ...
export const useAuth = () => {
    return useContext(authContext);
  };
  
  // Provider hook that creates auth object and handles state
function useProvideAuth() {
    const [user, setUser] = useState(null);

    // aws登陆
    const signin = async (email, password) => {
      const data = await loginAuth(email, password);
      localStorage.setItem('token', data.body.token)
      setUser(data);
      return data;
    };
  
    const signout = () => {
      return setUser(null);
    };
  
    // Return the user object and auth methods
    return {
      user,
      signin,
      signout,
    };
  } 
