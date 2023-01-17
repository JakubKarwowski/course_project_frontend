import "../styles/Navbar.css"
import axios from "axios"
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import SearchedCollectionsResults  from './SearchedCollectionsResults';
import SearchItemsResults from "./SearchItemsResults";

function Navbar() {

    const[errorMessage, setErrorMessage] = useState("");
    const [logonStatus, setLogonStatus] = useState(false);
    const [id, setId] = useState("");
    const [adminStatus, setAdminStatus] = useState(false)
    const [blocked, setBlocked] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [searchedItems, setSearchedItems] = useState([]);
    const [searchedCollections, setSearchedCollections] = useState([]);


    const navigate = useNavigate();

    useEffect(()=>{
        axios.get('http://localhost:5000/authentication/isuserauth', {
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

    function logout(){
        localStorage.removeItem("token")
        navigate("/")
    }
    function handleAdminPage(){
        axios.get('http://localhost:5000/users/getusers')
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
                <div className="navbar-nav " id="navbarNavDropdown">
                    <button className="btn  btn-secondary" onClick={logout}>Logout</button>
                    <ul className="navbar-nav ">
                        <li className="nav-item">
                            <button className={darkMode ? "link dark" : "link" }onClick={()=> navigate("/mycollections")}>My collections</button>
                        </li>
                        {handleAdminPage()}  
                    </ul>
                </div>
            ) 
            
        } else {
            return(
                <div className="navbar-nav" id="navbarNavDropdown">
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
    function handleSearch(e){
        e.preventDefault();
        axios.get(`http://localhost:5000/items/searchitems/${e.target[0].value}`)
        .then((res)=> {
            setSearchedItems(res.data)
        }
        )
        axios.get(`http://localhost:5000/collections/searchcollections/${e.target[0].value}`)
        .then((res)=> {
            setSearchedCollections(res.data)
        }
        )

    }
    return(
        <>
        <nav className={darkMode ?'navbar navbar-expand-sm navbar-dark bg-dark' :'navbar navbar-expand-lg navbar-light bg-light'}>
            <div className="container-fluid">
                <div className="left d-flex">
                    <button className={darkMode ? "nostyle dark" : "nostyle light"} onClick={()=> navigate("/")}><i className="bi bi-house-door-fill"></i></button>
                    {handleButtonList()}
                </div>
                <div className="right d-flex">
                    <button className={darkMode ? "nostyle dark" : "nostyle light"} onClick={()=>handleDarkMode()}>
                        {darkMode ? <i className="bi bi-sun-fill"></i> : <i className="bi bi-moon-fill"></i>  }
                    </button>
                    <form className="d-flex" role="search" onSubmit={handleSearch}>
                        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"></input>
                        <button className="btn btn-secondary" type="submit">Search</button>
                    </form>
                </div>
            </div>
        </nav>
        <div className={darkMode === "true" ? "container dark" : "container"}>
        <SearchItemsResults searchedItems = {searchedItems} setSearchedItems = {setSearchedItems} />
        <SearchedCollectionsResults searchedCollections = {searchedCollections} setSearchedCollections = {setSearchedCollections} />
        </div>    
        </>
    );
}

export default Navbar;