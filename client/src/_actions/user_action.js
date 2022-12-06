const { createAsyncThunk } = require('@reduxjs/toolkit');
const { default: axios } = require('axios');

const LoginUser = createAsyncThunk('LOGIN_USER', async () => {
  return axios.post('/api/user/login').then((response) => response.data);
});

export default LoginUser;
