import axios from "axios";
import {useLayoutEffect, useState, useContext} from "react";
import {useNavigate} from "react-router-dom";
import {DarkModeContext} from '../App'

function LoginPage (){

    const[errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    let darkMode = localStorage.getItem("darkMode") ? localStorage.getItem("darkMode") : "false";

    useLayoutEffect(()=>{
        axios.get('https://courseprojectjakubkarwowski.herokuapp.com/authentication/isuserauth', {
            headers: {
                "x-access-token" : localStorage.getItem("token")
            }
        })
        .then(res => {
            const data = res.data
            if (data.isLoggedIn) {
                navigate('/')}}
            )
        .catch(err => setErrorMessage(err))
    })

    function handleOnSubmit(e){
        e.preventDefault();
        const form = e.target;
        axios.get('https://courseprojectjakubkarwowski.herokuapp.com/users/getusers')
        .then(res => {
            let user = res.data.find(item => item.username === form[0].value)
            if (user && user.blocked){
                setErrorMessage('Your account is blocked and cannot be logged into')
                console.log(errorMessage)
            }
            else{
                axios.post('https://courseprojectjakubkarwowski.herokuapp.com/authentication/login', {
                username: form[0].value,
                password: form[1].value,
                })
                .then((response)=> {
                const data = response.data;
                localStorage.setItem("id", data.id)
                localStorage.setItem("token", data.token)
                setErrorMessage(data.message)
                })
                .catch(function(error){
                setErrorMessage(error)
                })
            }
        })
        
    }
    function handleAlert(){
        if(errorMessage === "Success"){
            navigate('/')
        }else if(!errorMessage){
            return null
        } else return(
            <div class="alert alert-danger" role="alert">{errorMessage}</div>
        )   
    }

    return(
        <div className={darkMode === "true" ? "container dark" :"container"}>
            <h1>LogonPage</h1>
            <form onSubmit={handleOnSubmit}>
                <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input className="form-control" id="username"></input>
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" id="password"></input>
                </div>
               
                <button type="submit" className="btn btn-primary">Log in</button>
            </form>
            {handleAlert()}
        </div>
        
    )
}

export default LoginPage;