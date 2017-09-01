import fetch from 'utils/fetch';

export function getTree(parentid,flag) {
  const data = {
    parentid,
    flag
  };
  return fetch({
    url: '/SP/sys/org/getTree',
    method: 'post',
    data
  });
}

export function saveTree(org) {
  const data = {
    org
  };
  return fetch({
    url: '/SP/sys/org/saveTree',
    method: 'post',
    data
  });
}

export function delTree(id) {
  const data = {
    id
  };
  return fetch({
    url: '/SP/sys/org/delTree',
    method: 'post',
    data
  });
}


