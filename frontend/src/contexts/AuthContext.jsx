import axios from "axios";
import httpStatus from "http-status";
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import server from "../environment";


export const AuthContext = createContext({});


const client = axios.create({
    baseURL: `${server}/api/v1/users/`,
    timeout: 10000,
});


export const AuthProvider = ({ children }) => {

    const [userData, setUserData] = useState(null);

    const router = useNavigate();


    const handleRegister = async (name, username, password) => {

        try {

            const request = await client.post("/register", {
                name: name.trim(),
                username: username.trim(),
                password
            });

            if(request.status === httpStatus.CREATED){
                return request.data.message;
            }

        } catch(err){

            console.error(err.response?.data || err.message);
            throw err;

        }
    };



    const handleLogin = async(username,password)=>{

        try{

            const request = await client.post("/login",{
                username:username.trim(),
                password
            });


            if(request.status === httpStatus.OK){

                localStorage.setItem(
                    "token",
                    request.data.token
                );

                setUserData(request.data.user);

                router("/home");
            }


        }catch(err){

            console.error(err.response?.data || err.message);
            throw err;

        }

    };



    const getHistoryOfUser = async()=>{

        const token = localStorage.getItem("token");

        if(!token){
            return [];
        }

        try{

            const request = await client.get(
                "/get_all_activity",
                {
                    params:{
                        token
                    }
                }
            );

            return request.data;


        }catch(err){

            console.error(err);
            throw err;

        }

    };



    const addToUserHistory = async(meetingCode)=>{

        const token = localStorage.getItem("token");

        if(!token){
            throw new Error("Please login first");
        }


        try{

            return await client.post(
                "/add_to_activity",
                {
                    token,
                    meeting_code:meetingCode
                }
            );


        }catch(err){

            console.error(err);
            throw err;

        }

    };



    return (
        <AuthContext.Provider
            value={{
                userData,
                setUserData,
                handleRegister,
                handleLogin,
                getHistoryOfUser,
                addToUserHistory
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};