import axios from "axios";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import { TagCloud } from 'react-tagcloud'


export default function TagsCloud(){

    const [items, setItems] = useState([]);    
    const [tags, setTags] = useState([]);    

    const navigate = useNavigate();
    let darkMode = localStorage.getItem("darkMode") ? localStorage.getItem("darkMode") : "false";

    useEffect(()=>{
        axios.get('https://courseprojectjakubkarwowski.herokuapp.com/authentication/isuserauth', {
            headers: {
                "x-access-token" : localStorage.getItem("token")
            }
        })
        .then(function(res){
        })
        .catch(err => {
            console.log(err)
            navigate('/')
        })
        axios.get('https://courseprojectjakubkarwowski.herokuapp.com/items/getitems')
        .then((res)=> {
            setItems(res.data);
        }
        )
    }, [])
    


    return(
        null
    )
}