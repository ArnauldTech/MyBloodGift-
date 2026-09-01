import { axiosClient } from "./axiosClient";
import type {
    User,
    UserLoginPayload,
    UserSignUpPayload,
    LoginResponse,
    SignUpResponse
} from "../types/api"

export const authService ={
     async login(payload: UserLoginPayload):Promise<LoginResponse>{
        const response =await axiosClient.post<LoginResponse>('/Authentification/login',payload);
        return response.data;
     },

     async signup(payload:UserSignUpPayload):Promise<SignUpResponse>{
        const response = await axiosClient.post<SignUpResponse>('/Authentification/signup',payload);
        return response.data;
     },

     async getMe():Promise<User>{
        const response = await axiosClient.get<User>('/Authentification/users/me');
        return response.data;
     },

     logout(): void{
        localStorage.removeItem('access_token');
     },
}