import axios from "axios";
import "../styles/RegisterPage.css";
import {useNavigate} from "react-router-dom";


function RegisterPage (){
    const navigate = useNavigate();
    let darkMode = localStorage.getItem("darkMode") ? localStorage.getItem("darkMode") : false;

    function handleOnSubmit(e){
        e.preventDefault();
        const form = e.target
        axios.post("http://localhost:5000/authentication/register", {
        username: form[0].value,
        name: form[0].value,
        password: form[1].value,
        admin: false,
        blocked: false,
        })
        .then(function (response) {
            navigate('/login');
        })
        .catch(function (error) {
            window.alert(error)
        });
    }
    return(
        <div className={darkMode === "true" ? "container dark" : "container"}>
            <h1> Add new account:</h1>
            <form onSubmit={handleOnSubmit}>
                <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input className="form-control" id="username"></input>
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" id="password"></input>
                </div>
               
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
        </div>
    )
}

export default RegisterPage;