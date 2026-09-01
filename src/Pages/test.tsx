
import { authService } from "@/api/authServices"
import type { User } from "@/types/api"
import { useState,useEffect } from "react"
import { toast } from "sonner"


function Test() {
    const [user, setUser] = useState<User | any>(null);
    const [isoLoading,SetIsLoading]=useState(true);

    const loadUser = async () => {
        SetIsLoading(true);
        try {
            const data = await authService.getMe()
            console.log(data)
            setUser(data)
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Une erreur est survenue"
            toast.error(message)
        }finally{
              
        }
    }

    void loadUser()

    return (
        <div>
            <p>Bonjour </p>
            <p>Email :{user.email}</p>
            <p>PassWord :{user.prenom}</p>
        </div>
    )
}

export default Test