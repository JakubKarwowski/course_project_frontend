import {useEffect, useState} from "react";
import "../styles/MyCollections.css"
import axios from "axios";
import {useNavigate} from "react-router-dom";


function MyCollections () {

    const [newFormState, setNewFormState] = useState(false);
    const [username, setUsername] = useState("");
    const [collections, setCollections] = useState([]);
    const [collection, setCollection] = useState([]);
    
    
    

    const collectionNamesList = ["books", "cars", "stamps","shoes"]
    const navigate = useNavigate();

    useEffect(()=>{
        axios.get('https://courseprojectjakubkarwowski.herokuapp.com/authentication/isuserauth', {
            headers: {
                "x-access-token" : localStorage.getItem("token")
            }
        })
        .then(function(res){
            const data = res.data
            setUsername(data.username)
            
        })
        .catch(err => {
            console.log(err)
            navigate('/')
        })
        axios.get('https://courseprojectjakubkarwowski.herokuapp.com/collections/getcollections')
        .then((res)=> {
            setCollections(res.data);
        }
        )
        

    }, [])

    function handleOnSubmit(e){
        e.preventDefault();
        const name = e.target[0].value;
        const description = e.target[1].value;
        const topic = e.target[2].value;
        axios.post("https://courseprojectjakubkarwowski.herokuapp.com/collections/createcollection" , {
            name: name,
            description: description,
            topic: topic,
            owner: username,
            items: [],
        })
        .then(res => {
            setNewFormState(!newFormState)
        })
        .catch(err => {
            console.log(err);
        })
    }

    function createChoice(){
        return(
            <div className="form-group mb-2">
                <label className="form-label">Topic:</label>
                <select className="form-control" id="topicSelect">
                    {collectionNamesList.map(item =>{
                        return (
                            <option key={item}>{item}</option>
                        )
                    })}
                </select>
            </div>
        )        
    }

    function newCollectionForm(){
        if(newFormState) {
            return(
                <div className="formcontainer">
                    <form className="newcollection" onSubmit={handleOnSubmit}>
                    <h3>New collection:</h3>
                    <div className="mb-2">
                        <label className="form-label">Name:</label>
                        <input className="form-control" id="name"></input>
                    </div>
                    <div className="form-group mb-2">
                        <label className="form-label">Description:</label>
                        <textarea className="form-control" id="Description" rows="3"></textarea>
                    </div>
                    {createChoice()}
                    {/* <div className="mb-2">
                        <label className="custom-file-label mb-2">Add optional picture:</label><br/>
                        <input type="file" accept="image/png, image/jpeg" className="custom-file-input mb-2" id="customFile"/> 
                    </div> */}
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
                </div>
                
            )
        } 
    }

    function handleOnclick(){
            setNewFormState(!newFormState)
    }

    function handleCollectionClick(collection){
        setCollection(collection)
    }
    function editcollection(){
        if(collection.length === 0){
            console.log("no collection clicked")
            return null
        }
        else{
            console.log(collection)
            return(
                <div className="background">
                    <div className="editcollectioncontainer">
                        <button onClick={closePopUp} className="close btn btn-secondary mb-3"><i className="bi bi-x-lg"></i></button>
                    </div>
                </div>
            )
        }

    }
    function closePopUp(){
        setCollection([])
    }

    return(
        <>
        {editcollection()}
        <div className="container">
            <h1>MyCollections</h1>
            <button type="button" className="btn btn-secondary mb-3" onClick={handleOnclick}>Add new collection</button>
            <button type="button" className="btn btn-secondary mb-3" onClick={handleOnclick}>Delete</button>
            {newCollectionForm()}
            <div className="row">
                {collections.map((collection) =>(
                    <button className="collection m-2 col-sm-3" onClick={()=> handleCollectionClick(collection)}>
                        <div className="card text-center ">
                            <div className="card-body">
                                <h5 className="card-title">Name: {collection.name}</h5>
                                <h6 className="card-subtitle mb-2 text-muted">Author: {collection.owner}</h6>
                                <p className="card-text">Topic: {collection.topic}</p>
                                <p className="card-text">Description: {collection.description}</p>
                                {collection.items.length ? <h6 className="card-subtitle ">Items:</h6> : null}
                                <ul className="list-group list-group-flush">
                                    {collection.items.map((item) =>(
                                        <li className="list-group-item">
                                            {item.name}{item.tags.map((tag) => (
                                                <p className='tag'>#{tag} </p>
                                            ))}                                          
                                        </li>
                                    ))}
                                </ul>
                                {/* <button class="btn btn-primary">Edit</button>
                                <button class="btn btn-primary">Delete</button> */}
                            </div>
                        </div>
                    </button>
                ))}
            </div>    
        </div>
        </>
    );
}

export default MyCollections;