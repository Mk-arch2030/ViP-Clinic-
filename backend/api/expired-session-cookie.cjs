'use strict';
const CLEAR_COOKIE='__Host-vip_session=; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=0';
async function clearRejectedSession(request,reply,payload){
  if(reply.statusCode===401 && ['/auth/session','/auth/logout'].includes(request.routeOptions.url)) reply.header('Set-Cookie',CLEAR_COOKIE);
  return payload;
}
module.exports={CLEAR_COOKIE,clearRejectedSession};
