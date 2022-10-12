import "../styles/Navbar.css"
import axios from "axios"
import {useLayoutEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

function Navbar() {

    const[errorMessage, setErrorMessage] = useState("");
    const [logonStatus, setLogonStatus] = useState(false);
    const [username, setUsername] = useState("");
    const [admin, setAdmin] = useState(false);
    const [blocked, setBlocked] = useState(false);

    const navigate = useNavigate();

    useLayoutEffect(()=>{
        axios.get('https://courseprojectjakubkarwowski.herokuapp.com/authentication/isuserauth', {
            headers: {
                "x-access-token" : localStorage.getItem("token")
            }
        })
        .then(res => {
            const data = res.data
            setLogonStatus(data.isLoggedIn)
            setUsername(data.username)
            setAdmin(data.admin)
            setBlocked(data.blocked)
        })
        .catch(err => setErrorMessage(err))
    })

    function logout(){
        localStorage.removeItem("token")
        navigate("/")
    }

    function handleButtonList(){

        if (logonStatus) {
            if(admin) {
                return(
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <button className="btn  btn-outline-light" onClick={logout}>Logout</button>
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link" href="/mycollections">My collections</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/adminpage">Admin Page</a>
                            </li>  
                        </ul>
                    </div>
                )
            } else{
                return(
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <button className="btn  btn-outline-light" onClick={logout}>Logout</button>
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a className="nav-link" href="/mycollections">My collections</a>
                            </li> 
                        </ul>
                    </div>
                )
            }
            
        } else {
            return(
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link" aria-current="page" href="/register">Register</a>
                        </li>
                        <li className="nav-item">
                        <a className="nav-link" href="/login">Login</a>
                        </li>  
                    </ul>
                </div>
            )
        }
    }   

    return(
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark ">
            <div className="container-fluid">
                <a className="navbar-brand" href="/"><i className="bi bi-house-door-fill"></i></a>         
                {handleButtonList()}                
                <form className="d-flex" role="search">
                    <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"></input>
                    <button className="btn btn-light" type="submit">Search</button>
                </form>
            </div>
        </nav>
    );
}

export default Navbar;