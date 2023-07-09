import Cookies from "universal-cookie";

const cookie = new Cookies();

export function setAuthToken(token: string){
    cookie.set('auth-token', token);
}

export function getAuthToken(){
    const token = cookie.get('auth-token');
    return token ? String(token) : null;
}