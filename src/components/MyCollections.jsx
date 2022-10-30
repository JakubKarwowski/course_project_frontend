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
    
    let darkMode = localStorage.getItem("darkMode") ? localStorage.getItem("darkMode") : false;
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
            setId(data.id)
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
    function editCollection(){
        if (collection.length !== 0 && collections.includes(collection)){
            return(
                <div className="background">
                        <div className="editcollectioncontainer">
                            <button onClick={closePopUp} className="close btn btn-secondary mb-3"><i className="bi bi-x-lg"></i></button>
                            <table className="table table-bordered">
                                <thead className="table-dark">
                                    <tr>
                                        <th scope="col" key='idtitle'>id</th>
                                        <th scope="col" key='name'>name</th>
                                        <th scope="col" key='tags'>tags</th>
                                    </tr>
                                </thead>
                                {collection.items.map((item)=>{
                                    return(
                                        <tr>
                                            <td key='id'>{item._id}</td>
                                            <td key='username'>{item.name}</td>
                                            <td key='tags'>{item.tags.map((tag) => (
                                                `#${tag} `
                                            ))}</td>
                                        </tr>
                                        
                                    )
                                })}
                            </table>    
                        </div>
                </div>
            )
        }
    }
    function closePopUp(){
        setCollection([])
    }
    function handleDelete(e){
        axios.delete(`https://courseprojectjakubkarwowski.herokuapp.com/collections/deletecollection`, {data: {id: e.target.id}})
        setCollections(collections.filter((collection)=> {
            return collection._id !==e.target.id})  
        )
    };
    function createCollections(){
        axios.get('https://courseprojectjakubkarwowski.herokuapp.com/users/getusers')
        .then(res => {
            let user = res.data.find(item => item._id === id)
            setAdminStatus(user.admin)
        })
        .catch(error => console.log(error))
        let userCollections
        adminStatus ? userCollections = collections : userCollections = collections.filter((collection) => collection.owner === username)
        return(
                <div className="row">
                    {userCollections.map((collection) =>(
                        <div className="collection m-2 col-sm-3" onClick={()=>navigate(`/mycollections/${collection._id}`)}>
                            <div className={darkMode === "true" ? "card bg-dark text-center" : "card bg-light text-center"}>
                                <div className="card-body">
                                    <h5 className="card-title">Name: {collection.name}</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">Author: {collection.owner}</h6>
                                    <p className="card-text">Topic: {collection.topic}</p>
                                    <p className="card-text">Description: {collection.description}</p>
                                    {collection.items.length ? <h6 className="card-subtitle ">Items:</h6> : null}
                                    <ul className="list-group list-group-flush">
                                        {collection.items.map((item) =>(
                                            <li className={darkMode === "true" ? "list-group-item dark" :"list-group-item"}>
                                                {item.name}{item.tags.map((tag) => (
                                                    <p className='tag'>#{tag} </p>
                                                ))}                                          
                                            </li>
                                        ))}
                                    </ul>
                                    <button id={collection._id} className="btn btn-primary" onClick={handleDelete}>Delete</button>
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
            <h1>Click any collection to edit</h1>
            <button type="button" className="btn btn-secondary mb-3" onClick={handleOnclick}>Add new collection</button>
            {newCollectionForm()}
            {editCollection()}
            {createCollections()}
        </div>
        </>
    );
}

export default MyCollections;