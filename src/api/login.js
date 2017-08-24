import fetch from 'utils/fetch';

export function login(username, password) {
  const data = {
    username,
    password
  };
  return fetch({
    url: '/SP/loginData',
    method: 'post',
    data
  });
}

export function logout() {
  return fetch({
    url: '/login/logout',
    method: 'post'
  });
}

export function getInfo(token) {
  return fetch({
    url: '/SP/sys/user/getUserById',
    method: 'get',
    params: { token }
  });
}

