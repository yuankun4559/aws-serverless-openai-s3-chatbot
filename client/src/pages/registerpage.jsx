// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, {useEffect, useState} from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAuth } from '../commons/use-auth';
import { useNavigate} from 'react-router-dom';
import { useLocalStorage } from '../commons/localStorage';

import { registerUser } from '../commons/apigw';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="">
        My Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

const Register = () => {
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(false)
  console.log('---注册 auth auth auth---:', auth.user);
  const [checked, setChecked] = useState(false);
  const [local_stored_crediential,setLocalStoredCred] = useLocalStorage('chat-login-token',null)
  const [errorstate, setErrorState] = useState(false);
  const [errormsg, setErrMsg] = useState('');
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [repeatPassword, setRepeatPassword] = useState();
  const navigate = useNavigate();
  const isAuthenticated = auth.user && auth.user.isAuthorized;

  useEffect(()=>{
        if(isAuthenticated){
            navigate('/chat');
        }
    },[navigate,isAuthenticated]);

  useEffect(()=>{
    if (local_stored_crediential) {
        setChecked(local_stored_crediential.checked);
        if (local_stored_crediential.checked) {
          setUsername(local_stored_crediential.username);
          setPassword(local_stored_crediential.password);
        }
    }
  },[checked,local_stored_crediential]);

  // 新用户登陆
  const handleUserLogin = (username, password) => {
    auth.signin(username,password)
    .then((data)=>{
      setLocalStoredCred({
        username,
        password,
        checked:checked
      });
      if (!(data?data.isAuthorized:false)){
        setErrorState(true);
        setErrMsg(data.body.message);
      }
    })
    .catch(error =>{ 
      setErrorState(true);
      setErrMsg(error.message);
    })
  }

  // 注册账户
  const handleSubmit = async(event) => {
    event.preventDefault();
    const formdata = new FormData(event.currentTarget);
    setIsLoading(true)
    registerUser(formdata.get('username'),formdata.get('password'))
    .then((res) => {
      console.log('注册结果', res);
      const {  isAuthorized, body } = res || {}
      if(!isAuthorized) {
        // 注册失败
        setErrorState(true);
        setErrMsg(body?.message);
        return
      } else {
        // 注册成功
        // navigate('/chat')
        handleUserLogin(formdata.get('username'),formdata.get('password'))
      }
      
    }).catch((error) => {
      setErrorState(true);
      setErrMsg(error.message);
    }).finally(() => {
      setIsLoading(false)
    }) 
  };

  const handleInputChange = (event) => {
    const value = event.target.value
    setPassword(value)
    if(repeatPassword) {
      if(value !== repeatPassword) {
        setErrorState(true)
        setErrMsg('密码不一致！')
      } else {
        setErrorState(false)
        setErrMsg('')
      }
      
    }
  }

  const handleRepeatInputChange = (event) => {
    const value = event.target.value
    setRepeatPassword(value)
    if(password) {
      if(value !== password) {
        setErrorState(true)
        setErrMsg('密码不一致！')
      } else {
        setErrorState(false)
        setErrMsg('')
      }
      
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <BorderColorIcon />
          </Avatar>
          <Typography component="h1" variant="h5">register</Typography>
         
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {/* <FormControl> */}
            <TextField
              error = {errorstate}
              // helperText ={errormsg}
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              value ={username??''}
              onChange = {(event) => { setUsername(event.target.value);}}
              autoFocus
            />
            <TextField
              error = {errorstate}
              helperText ={errormsg}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value ={password??''}
              // onChange = {(event) => { setPassword(event.target.value);}}
              onChange={handleInputChange}
              autoComplete="current-password"
            />
            <TextField
              error = {errorstate}
              helperText ={errormsg}
              margin="normal"
              required
              fullWidth
              name="repeatPassword"
              label="Repeat Password"
              type="password"
              id="repeatPassword"
              value ={repeatPassword??''}
              onChange={handleRepeatInputChange}
              autoComplete="current-password"
            />
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              loading={isLoading}
            >
              register
            </LoadingButton>
            {/* </FormControl> */}
          </Box>

        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}

export default Register;