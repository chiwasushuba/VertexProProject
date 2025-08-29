import {useState} from "react"
import {useAuthContext} from "./useAuthContext"

export const useLogin = () => {
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const {dispatch} = useAuthContext()

  const login = async (email, password) => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, password })
      })

      const json = await response.json()

      if (!response.ok) { 
        setIsLoading(false)
        setError(json.error || "Something went wrong")
        return { success: false, error: json.error }
      }

      // Successful login
      sessionStorage.setItem('userInfo', JSON.stringify(json))
      dispatch({ type: "LOGIN", payload: json })
      setIsLoading(false)
      return { success: true }
      
    } catch (err) {
      setIsLoading(false)
      setError("Network error")
      return { success: false, error: "Network error" }
    }
  }

  return { login, isLoading, error }
}



