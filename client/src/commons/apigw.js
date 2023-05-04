// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

//Change to your own API Gateway endpoint
// const API_http = 'https://{api-id}.execute-api.{region}.amazonaws.com';
const API_http = 'https://8zekmp7c94.execute-api.us-east-1.amazonaws.com'

// 发送聊天
export const getAnswer = async(respid,text,model_params,headers) =>{
    const options ={
        method:'POST',
        // mode: 'no-cors',
        headers:headers,
        body:JSON.stringify({id:respid,prompt:text,params:model_params})
    }
    try {
        var resp = await fetch(API_http+'/chat', options);

       
        if (!resp.ok){
            const data = await resp.text();
            throw (Error(`Error: ${resp.status},${data}`));
        } 
        var data = await resp.json() ;
        return data;
    } catch (err) {
        throw err;
    }
}

// aws账户登陆
export const loginAuth = async(username,password) =>{
    const options ={
        method:'POST',
        headers:{'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':'*'},
        body:JSON.stringify({username:username,password:password})
    }
    try {
        var resp = await fetch(API_http+'/login', options);
        if (!resp.ok) {
            console.log('resp.ok');
            const data = await resp.json();
   
            throw (Error(`Error: ${resp.status},${data.msg}`));
        }
        var data = await resp.json() ;
 
        return data;
    } catch (err) {
        throw err;
    }
}

// aws账户注册
export const registerUser = async(username,password) =>{
    const options ={
        method:'POST',
        headers:{'Content-Type': 'application/json',
          'Access-Control-Allow-Origin':'*'},
        body:JSON.stringify({username:username,password:password})
    }
    try {
        var resp = await fetch(API_http+'/register', options);
        if (!resp.ok) {
            console.log('resp.ok');
            const data = await resp.json();
            throw (Error(`Error: ${resp.status},${data.msg}`));
        }
        var data = await resp.json() ;
        return data;
    } catch (err) {
        throw err;
    }
}