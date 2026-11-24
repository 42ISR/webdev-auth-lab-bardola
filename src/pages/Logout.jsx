import { useEffect } from "react"
import { useUserStore } from "../store/useUserStore"
import { useNavigate } from "react-router-dom"

const Logout = () => {
    const clearSession = useUserStore((dgfd) => dgfd.clearSession)
    const navigation = useNavigate()

    useEffect(() => {
        clearSession()
        navigation("/")
    })

    return <></>
}

export default Logout
