import "../styles/Navbar.css"
import axios from "axios"
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

function Navbar() {

    const[errorMessage, setErrorMessage] = useState("");
    const [logonStatus, setLogonStatus] = useState(false);
    const [id, setId] = useState("");
    const [adminStatus, setAdminStatus] = useState(false)
    const [blocked, setBlocked] = useState(false);

    const navigate = useNavigate();

    useEffect(()=>{
        axios.get('https://courseprojectjakubkarwowski.herokuapp.com/authentication/isuserauth', {
            headers: {
                "x-access-token" : localStorage.getItem("token")
            }
        })
        .then(res => {
            const data = res.data
            setLogonStatus(data.isLoggedIn)
            setId(data.id)           
            setBlocked(data.blocked)
        })
        .catch(err => setErrorMessage(err))
    })

    function logout(){
        localStorage.removeItem("token")
        navigate("/")
    }

    function handleAdminPage(){
        axios.get('https://courseprojectjakubkarwowski.herokuapp.com/users/getusers')
        .then(res => {
            let user = res.data.find(item => item._id === id)
            setAdminStatus(user.admin)
        })
        .catch(error => console.log(error))
        if(adminStatus){
            return(
                <li className="nav-item">
                    <a className="nav-link" href="/adminpage">Admin Page</a>
                </li>
            )
        }        
    }

    function handleButtonList(){

        if (logonStatus) {
            return(
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <button className="btn  btn-outline-light" onClick={logout}>Logout</button>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link" href="/mycollections">My collections</a>
                        </li>
                        {handleAdminPage()}  
                    </ul>
                </div>
            ) 
            
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