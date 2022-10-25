import axios from "axios";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

export default function Collection(){
    const {id} = useParams()

    const [collection, setCollection] = useState([]);
    const [items, setItems] = useState([]);
    const [tagsNumber, setTagsNumber] = useState(0);
    const [newItem, setNewItem] = useState(false);
    const [newCollumn, setNewCollumn] = useState(false);
    const [editItemId, setEditItemId] = useState('');

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
        axios.get(`https://courseprojectjakubkarwowski.herokuapp.com/collections/getcollections/${id}`)
        .then((res)=> {
            setCollection(res.data)
            setItems(res.data.items)
        }
        )
    }, [])

    function createItems(){
        // console.log(collection.items)
        if (collection.length !== 0 && items){
        return(
            <tbody>
                {items.map((item)=>(
                    <tr>
                        <td key='delete'>
                                <button key="deletebutton" className="delete" onClick={()=>{deleteItem(item._id)}} ><i className="bi bi-trash3-fill"></i></button>  
                        </td>
                        <td key='edit'>
                            <button key="editbutton" className="delete" onClick={()=>{editItem(item._id)}} ><i className="bi bi-pencil-fill"></i></button>  
                        </td>
                        <td key="item">{item.hasOwnProperty('_id') ? item._id : null}</td>
                        <td key="name">{item.name}</td>
                        <td key='tags'>{item.tags.map((tag)=> (<i key={tag}> #{tag}</i>))}</td>
                        {createCustomFieldValues(item)}
                    </tr>
                ))}
            </tbody>
        )}
    }
    function deleteItem(id){
        const newItems = items.filter((item)=> {
            return item._id !== id
        })
        setItems(items.filter((item)=> {
            return item._id !== id
        }))
        axios.patch('https://courseprojectjakubkarwowski.herokuapp.com/collections/editcollection', 
        {id:collection._id, items:newItems})
    }
    function editItem(id){
        setEditItemId(id)
        setNewCollumn(false)
        setNewItem(false)
    }
    function addEditItem(){
        if (editItemId !== ''){
            let item = items.find((item)=>item._id === editItemId);
            let id = item._id;
            return(
                <div className="formcontainer">
                <h2>Edit item: {item.name}</h2>
                <form onSubmit={handleEditItem}>
                    <div className="form-group mb-2">
                        <label >Name:</label>
                        <input type="text" key={item.name} className="form-control" defaultValue={item.name}></input>
                    </div>
                        <label>Tags:</label>
                        {item.tags.map((tag)=>(<input type="text" key={tag} className="form-control" defaultValue={tag}></input>))}
                    {item.customFields.map((field) => {
                        return(
                            <div className="form-group mb-2 customfield">
                                <label>{field.name}</label>
                                {customFieldInput(field,id)}
                            </div>
                        )
                    })}
                <button type="submit" className="btn btn-primary">Edit item</button>
            </form>
            </div>
            )
        }
    }
    function handleEditItem(e){
        e.preventDefault();
        let customFields=[];
        let newItem={};
        let tags = [];
        let itemToBeChanged = items.find((item)=> item._id === editItemId)
        let index = items.indexOf(itemToBeChanged)
        let tagsNumber = itemToBeChanged.tags.length
        if (e.target.length-tagsNumber > 2) {
            for (let i=tagsNumber+1; i<e.target.length-1; i++) {
                let field = {
                    name: e.target[i].id,
                    type: itemToBeChanged.customFields.find((field)=> field.name[0] === e.target[i].id).type[0],
                    value: e.target[i].value
                }
                customFields = [...customFields, field]
        }
        }
        if(tagsNumber>0){
            for (let j=1; j<tagsNumber+1; j++){
                tags = [...tags, e.target[j].value]
            }
        } else{
            tags.length = 0;
        }
        newItem = {
            name: e.target[0].value,
            tags: tags,
            customFields: customFields,
        }

        items[index] = newItem;
        setEditItemId('')
        axios.patch('https://courseprojectjakubkarwowski.herokuapp.com/collections/editcollection', 
        {id:collection._id, items:items})
    }
    function addNewCollumn(){
        if(newCollumn){
        return (
            <div className="formcontainer">
                <h2>Add new custom field: </h2>
                <form onSubmit={handleAddCollumn}>
                <div className="form-group mb-2">
                    <label >Name of the custom field:</label>
                    <input type="text" className="form-control" placeholder="Custom field name"></input>
                </div>
                <div className="form-group mb-2">
                    <label >Data type:</label>
                    <select type="text" className="form-control">
                        <option>Number</option>
                        <option>Text</option>
                        <option>Multiline text</option>
                        <option>Checkbox</option>
                        <option>Date</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Add field</button>
                </form>
            </div>
        )}
    }
    function handleAddCollumn(e){
        e.preventDefault();
        const name = e.target[0].value;
        const dataType = e.target[1].value;
        const newField = {
            name: name,
            type: dataType,
            value:''
        }
        items.map((item)=>{item.customFields = [...item.customFields, newField]})
        setNewCollumn(!newCollumn)
        axios.patch('https://courseprojectjakubkarwowski.herokuapp.com/collections/editcollection', 
        {id:collection._id, items:items})
    }
    function addNewItem(){
        if (newItem){
        return (
            <div className="formcontainer">
            <h2>New item:</h2>
            <form onSubmit={handleAddItem}>
                <div className="form-group mb-2">
                    <label >Name:</label>
                    <input type="text" className="form-control" placeholder="Item name"></input>
                </div>
                    {createTags()}
                {items[0].customFields.map((field) => {
                    return(
                        <div className="form-group mb-2 customfield">
                            <label>{field.name}</label>
                            {customFieldInput(field)}
                        </div>
                    )
                })}
                <button type="submit" className="btn btn-primary">Add item</button>
            </form>
            </div>
        )}
    }
    function createTags(){

        return(
            <div className="form-group mb-2 tags">
            <button type="button" onClick={() => setTagsNumber(tagsNumber + 1)} className="btn btn-primary">Add Tag</button>
            {addTags()}
            </div>
        )
    }
    function addTags(){
        return(
            [...Array(tagsNumber)].map((item)=>(<input type="text" className="form-control" placeholder="Tag name"></input>)) 
        )
    }
    function customFieldInput(field,id){
        if (!id) {id = field.name}
        let placeHolder;
        let defaultValue;
        if(newItem) {
            placeHolder = "Write anything here";
            defaultValue = null;
            
        }else {
            placeHolder = null;
            defaultValue = field.value;
        }    
        if (field.type[0] === 'Number') {
            return(
                <input type="number" id={field.name} key={id} className='form-control' defaultValue={defaultValue} placeholder={placeHolder}></input>
            )
        } else if (field.type[0] === "Text") {
            return(
                <input type="text" id={field.name} key={id} className="form-control" defaultValue={defaultValue} placeholder={placeHolder}></input>
            )
        } else if (field.type[0] === "Multiline text") {
            return(
                <textarea id={field.name} key={id} defaultValue={defaultValue} className="form-control" rows="3"></textarea>
            )
        } else if (field.type[0] === "Checkbox") {
            return(
                <input type="checkbox" id={field.name} key={id} className="form-check-input" defaultValue={defaultValue}></input>
            )
        } else if (field.type[0] === "Date") {
            return(
                <input type="date" id={field.name} key={id} className="form-control" defaultValue={defaultValue} placeholder={placeHolder}></input>
            )
        }
    }
    function handleAddItem(e){
        e.preventDefault();
        let customFields = [];
        let itemToBeAdded = {};
        let tags=[];
        if (e.target.length-tagsNumber > 3) {
            for (let i=2+tagsNumber; i<e.target.length-1; i++) {
                let field = {
                    name: e.target[i].id,
                    type: items[0].customFields.find((item)=> item.name[0] === e.target[i].id).type[0],
                    value: e.target[i].value
                }
                customFields = [...customFields, field]
        }
        }
        if(tagsNumber>0){
            for (let j=2; j<tagsNumber+2; j++){
                tags = [...tags, e.target[j].value]
            }
        } else{
            tags.length = 0;
        }

        itemToBeAdded = {
            name: e.target[0].value,
            tags: tags,
            customFields: customFields,
        }
        const newItems = [...items, itemToBeAdded]
        setItems([...items, itemToBeAdded])
        setNewItem(!newItem)
        axios.patch('https://courseprojectjakubkarwowski.herokuapp.com/collections/editcollection', 
        {id:collection._id, items:newItems})
    }
    function createCustomFieldHeader(){
        if (items && items.length !==0 && items[0].customFields.length !== 0 ){
            return(
                items[0].customFields.map((field) => (
                    <th scope="col" key={field._id}>{field.name}</th>
                ))
            )
        }
    }
    function createCustomFieldValues(item){
        if (items && items.length !==0 && items[0].customFields.length !== 0 ){
            return(
                item.customFields.map((field)=>(<td key={field._id}>{field.value}</td>))
            )
        }
    }

    return(
        <>
        <h1>Collection {collection.name}</h1>
        <button type="button" className="btn btn-secondary mb-3" onClick={()=>{setNewItem(!newItem);setNewCollumn(false);setEditItemId('')}}>Add new item</button>
        <button type="button" className="btn btn-secondary mb-3" onClick={()=>{setNewCollumn(!newCollumn); setNewItem(false);setEditItemId('')}}>Add new collumn</button>
        {addNewCollumn()}
        {addNewItem()}
        {addEditItem()}
        <table className="table table-bordered">
            <thead className="table-dark">
                <tr>
                    <th scope="col" key='deletetitle'></th>
                    <th scope="col" key='edittitle'></th>
                    <th scope="col" key='idtitle'>id</th>
                    <th scope="col" key='nametitle'>name</th>
                    <th scope="col" key='tagtitle'>tags</th>
                    {createCustomFieldHeader()}
                </tr>
            </thead>
                {createItems()}
        </table>

        </>
    )
}