import '../styles/Homepage.css'
import { useContext } from "react";
import {DarkModeContext} from '../App'

function Homepage () {

    let darkMode = localStorage.getItem("darkMode") ? localStorage.getItem("darkMode") : "false";

    return(
        <div className={darkMode === "true" ? "container dark" : "container"}>
            <h1>Homepage</h1>
        </div>
        
    )
}

export default Homepage;