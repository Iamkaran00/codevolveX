import {jwtDecode} from 'jwt-decode' ; 

export const isTokenValid = token => {
    try{
      return jwtDecode(token).exp * 1000 > Date.now() ; 

    }catch(error) {
return false;
    }
} ; 


export const getStoredAuth = () => {
    try {
        const token = JSON.parse(localStorage.getItem('token') ) ; 
        if(token && isTokenValid(token)) {
            return {token ,   user : JSON.parse(localStorage.getItem('user'))} ;
        }
    } catch{} 

    localStorage.removeItem('token') ; 
    localStorage.removeItem('user') ; 
    return {token : null , user : null } ; 
}
