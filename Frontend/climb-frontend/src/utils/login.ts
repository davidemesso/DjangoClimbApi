import axios from "axios"

interface Tokens {
  readonly access : string,
  readonly refresh : string
}

export const isLogged = (): boolean => {
  return localStorage.getItem("climb_jwt_access") != null
}

export const logout = (): void => {
  localStorage.clear()
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