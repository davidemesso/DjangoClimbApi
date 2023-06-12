import axios from "axios"
import { decodeJwt } from "jose"
import { UserInfo } from "../App"

interface Tokens {
  readonly access : string,
  readonly refresh : string
}

export const isLogged = (): boolean => {
  return localStorage.getItem("climb_jwt_access") != null
}

export const getAccessToken = async (): Promise<string | null> => {
  const access = localStorage.getItem("climb_jwt_access")
  
  if (!access)
  return null
  
  const decoded = decodeJwt(access)
  
  if (decoded.exp! * 1000 > Date.now())
    return access

  const refresh = localStorage.getItem("climb_jwt_refresh")
  if (!refresh)
    return null

  const decodedRefresh = decodeJwt(refresh)
  
  if (decodedRefresh.exp! * 1000 < Date.now())
  {
    logout()
    return null
  }

  await refreshToken(refresh)
  
  return localStorage.getItem("climb_jwt_access")
}

export const logout = (): void => {
  localStorage.clear()
  location.reload()
}

export const login = async (username: string, password: string): Promise<boolean> => {
  const loginData = { "username": username, "password": password }
  
  const success = await axios.post(
    'http://localhost:8000/auth/token/',
    loginData
  )
  .then((data) => {
    const tokens : Tokens = data.data
    localStorage["climb_jwt_access"] = tokens.access
    localStorage["climb_jwt_refresh"] = tokens.refresh
    return true
  })
  .catch(_ => {
    return false
  })

  return success
}

export const getUserInfo = async (): Promise<UserInfo | null> => {  
  const success = await axios.get(
    'http://localhost:8000/auth/account/',
    {
      headers: {
        'authorization': 'Bearer ' + await getAccessToken()
      }
    }
  )
  .then((data) => {
    const userInfo : UserInfo = data.data
    return userInfo
  })
  .catch(_ => {
    return null
  })

  return success
}

export const refreshToken = async (refresh : string): Promise<boolean> => {  
  const refreshed = await axios.post(
    'http://localhost:8000/auth/token/refresh/',
    {"refresh": refresh}
  )
  .then((data) => {
    localStorage["climb_jwt_access"] = data.data.access
    return true
  })
  .catch(_ => {
    return false
  })

  return refreshed
}

export const register = async (
  email: string, 
  username: string,
  name: string,
  surname: string,
  password: string,
) : Promise<boolean> => {  
  const loginData = { 
    "email": email, 
    "username": username, 
    "first_name": name, 
    "last_name": surname, 
    "password": password 
  }
  
  const success = await axios.post(
    'http://localhost:8000/auth/register/',
    loginData
  )
  .then(_ => {
    return true
  })
  .catch(_ => {
    return false
  })

  return success
} 