import {useEffect, useState} from "react";
import "../styles/MyCollections.css"
import axios from "axios";
import {useNavigate} from "react-router-dom";

function MyCollections () {

    const [id, setId] = useState("");
    const [adminStatus, setAdminStatus] = useState(false)
    const [newFormState, setNewFormState] = useState(false);
    const [username, setUsername] = useState("");
    const [collections, setCollections] = useState([]);
    const [collection, setCollection] = useState([]);
    const [allItems, setAllItems] = useState([]);
    
    
    let darkMode = localStorage.getItem("darkMode") ? localStorage.getItem("darkMode") : false;
    const collectionNamesList = ["books", "cars", "alcohol","shoes"]
    const navigate = useNavigate();

    useEffect(()=>{
        axios.get('http://localhost:5000/authentication/isuserauth', {
            headers: {
                "x-access-token" : localStorage.getItem("token")
            }
        })
        .then(function(res){
            const data = res.data
            setUsername(data.username)
            setId(data.id)
            setAdminStatus(data.admin)
        })
        .catch(err => {
            console.log(err)
            navigate('/')
        })
        axios.get('http://localhost:5000/collections/getcollections')
        .then((res)=> {
            setCollections(res.data);
        }
        )
        axios.get('http://localhost:5000/items/getitems')
        .then((res)=> {
            setAllItems(res.data);
        }
        )
    }, [])

    function handleOnSubmit(e){
        e.preventDefault();
        const name = e.target[0].value;
        const description = e.target[1].value;
        const topic = e.target[2].value;
        axios.post("http://localhost:5000/collections/createcollection" , {
            name: name,
            description: description,
            topic: topic,
            owner: username,
        })
        .then(res => {
            setNewFormState(!newFormState)
            setTimeout(function(){
                window.location.reload();
             }, 200);
        })
        .catch(err => {
            console.log(err);
        })
    }
    function handleSubmitEdit(e){
        e.preventDefault();
        console.log(collection)
        axios.patch("http://localhost:5000/collections/editcollection" , {
            id: collection[0]._id,
            name: e.target[0].value,
            description: e.target[1].value,
            topic: e.target[2].value,
        })
        .then(res => {
            console.log(res)
            setTimeout(function(){
                setCollection([])
                window.location.reload();
             }, 200);
        })
        .catch(err => {
            console.log(err);
        })

    }
    function createChoice(topic){
        return(
            <div className="form-group mb-2">
                <label className="form-label">Topic:</label>
                <select className="form-control" id="topicSelect">
                    {collectionNamesList.map(item =>{
                        if(item === topic){
                            return (<option selected key={item}>{item}</option>)
                         }else{
                            return (<option key={item}>{item}</option>)
                         }
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
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
                </div>
                
            )
        } 
    }
    function handleOnclick(){
            setNewFormState(!newFormState)
            setCollection([])
    }
    function editCollection(){
        if(collection.length !==0) {
            return(
                <div className="formcontainer">
                    <form className="newcollection" onSubmit={handleSubmitEdit}>
                    <h3>Edit collection "{collection[0].name}":</h3>
                    <div className="mb-2">
                        <label className="form-label">Name:</label>
                        <input className="form-control" id="name" defaultValue={collection[0].name}></input>
                    </div>
                    <div className="form-group mb-2">
                        <label className="form-label">Description:</label>
                        <textarea className="form-control" id="Description" rows="3" defaultValue={collection[0].description}></textarea>
                    </div>
                    {createChoice(collection[0].topic)}
                    <button type="submit" className="btn btn-primary">Edit collection</button>
                </form>
                </div>
                
            )
        } 
        
    }
    function handleDelete(e){
        let itemsToDeleted = allItems.filter((item)=> item.collectionId === e.target.id)
        itemsToDeleted.map((item) => {
            axios.delete('http://localhost:5000/items/deleteitem', 
        {data: {id: item._id}})
        })
        axios.delete(`http://localhost:5000/collections/deletecollection`, {data: {id: e.target.id}})
        setCollections(collections.filter((collection)=> {
            return collection._id !== e.target.id})  
        )
    };
    function handleEdit(e){
        setNewFormState(false)
        setCollection(collections.filter((collection)=> collection._id === e.target.id))
        window.scrollTo(0, 200);
    }
    function createCollections(){
        let userCollections
        adminStatus ? userCollections = collections : userCollections = collections.filter((collection) => collection.owner === username)
        return(
                <div className="row">
                    {userCollections.map((collection) =>(
                        <div className="collection m-2 col-sm-3" onClick={(e)=>{if(e.target.localName !== "button") navigate(`/mycollections/${collection._id}`)
                            }}>
                            <div className={darkMode === "true" ? "card bg-dark text-center" : "card bg-light text-center"}>
                                <div className="card-body">
                                    <h5 className="card-title">Name: {collection.name}</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">Author: {collection.owner}</h6>
                                    <p className="card-text">Topic: {collection.topic}</p>
                                    <p className="card-text">Description: {collection.description}</p>
                                    {allItems.filter((item) => item.collectionId === collection._id).length !==0 ? <h6 className="card-subtitle ">Items:</h6> : null}
                                    <ul className="list-group list-group-flush">
                                        {allItems.filter((item) => item.collectionId === collection._id).map((item) =>(
                                            <li className={darkMode === "true" ? "list-group-item dark" :"list-group-item"}>
                                                {item.name}{item.tags.map((tag) => (
                                                    <p className='tag'>#{tag} </p>
                                                ))}                                          
                                            </li>
                                        ))}
                                    </ul>
                                    <button id={collection._id} className="btn btn-primary" onClick={handleDelete}>Delete</button>
                                    <button id={collection._id} className="btn btn-primary" onClick={handleEdit}>Edit</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>   
            
        )
    }
    return(
        <>
        <div className={darkMode === "true" ? "container dark" : "container"}>
            <h1>My collections</h1>
            <button type="button" className="btn btn-secondary mb-3" onClick={handleOnclick}>Add new collection</button>
            {newCollectionForm()}
            {editCollection()}
            {createCollections()}
        </div>
        </>
    );
}

export default MyCollections;