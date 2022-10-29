import "../styles/Navbar.css"
import axios from "axios"
import {useEffect, useState, useContext} from "react";
import {useNavigate} from "react-router-dom";
import {DarkModeContext} from '../App'

function Navbar() {

    const[errorMessage, setErrorMessage] = useState("");
    const [logonStatus, setLogonStatus] = useState(false);
    const [id, setId] = useState("");
    const [adminStatus, setAdminStatus] = useState(false)
    const [blocked, setBlocked] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

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
            if (localStorage.getItem('darkMode') === "true"){setDarkMode("true")}
        })
        .catch(err => setErrorMessage(err))
    })

    // const darkMode = localStorage.getItem(darkMode);

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
                    <button className={darkMode ? "link dark" : "link" }onClick={()=> navigate("/adminpage")}>Admin page</button>
                </li>
            )
        }        
    }

    function handleButtonList(){
        if (logonStatus) {
            return(
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <button className="btn  btn-secondary" onClick={logout}>Logout</button>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <button className={darkMode ? "link dark" : "link" }onClick={()=> navigate("/mycollections")}>My collections</button>
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
                            <button className={darkMode ? "link dark" : "link" }onClick={()=> navigate("/register")}>Register</button>
                        </li>
                        <li className="nav-item">
                            <button className={darkMode ? "link dark" : "link" }onClick={()=> navigate("/login")}>Login</button>
                        </li>  
                    </ul>
                </div>
            )
        }
    }   

    function handleDarkMode(){
        if (darkMode === "true") {
            localStorage.setItem("darkMode", "false")
        }else {
            localStorage.setItem("darkMode", "true")
        }
        setDarkMode(!darkMode)
        document.location.reload()
    }

    return(
        <nav className={darkMode ?'navbar navbar-expand-lg navbar-dark bg-dark' :'navbar navbar-expand-lg navbar-light bg-light'}>
            <div className="container-fluid">
            <button className={darkMode ? "nostyle dark" : "nostyle light"} onClick={()=> navigate("/")}><i className="bi bi-house-door-fill"></i></button>       
                {handleButtonList()}                
                <button className={darkMode ? "nostyle dark" : "nostyle light"} onClick={()=>handleDarkMode()}>
                    {darkMode ? <i className="bi bi-sun-fill"></i> : <i className="bi bi-moon-fill"></i>  }
                </button>
                <form className="d-flex" role="search">
                    <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"></input>
                    <button className="btn btn-secondary" type="submit">Search</button>
                </form>
            </div>
        </nav>
    );
}

export default Navbar;