import axios from "axios";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

export default function Collection(){
    const {id} = useParams()

    const [collection, setCollection] = useState([]);

    const navigate = useNavigate();

    useEffect(()=>{
        axios.get('https://courseprojectjakubkarwowski.herokuapp.com/authentication/isuserauth', {
            headers: {
                "x-access-token" : localStorage.getItem("token")
            }
        })
        .then(function(res){
            // const data = res.data
            // setUsername(data.username)
            // setId(data.id)
        })
        .catch(err => {
            console.log(err)
            navigate('/')
        })
        axios.get(`http://localhost:5000/collections/getcollections/${id}`)
        .then((res)=> {
            console.log(id)
            console.log(res)
            setCollection(res.data);
        }
        )
        

    }, [])

    return(
        <>
        <h1>ID {id}</h1>
        <h1>Collection {collection.id}</h1>
        <h1>{collection.name}</h1>
        <h1>{collection.description}</h1>

        </>
    )
}