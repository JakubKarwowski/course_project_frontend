import axios from "axios";
import "../styles/RegisterPage.css";

function RegisterPage (){

    function handleOnSubmit(e){
        e.preventDefault();
        const form = e.target
        axios.post("https://courseprojectjakubkarwowski.herokuapp.com/users/createuser", {
        username: form[0].value,
        name: form[0].value,
        password: form[1].value,
        admin: false,
        blocked: false,
        })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    return(
        <div className="container">
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