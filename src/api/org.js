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

export function addTree(org) {
  const data = {
    org
  };
  return fetch({
    url: '/SP/sys/org/addTree',
    method: 'post',
    data
  });
}


