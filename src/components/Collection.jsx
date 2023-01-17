import axios from "axios";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import CollectionTable from './CollectionTable'
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';


export default function Collection(){
    const {id} = useParams();

    const [collection, setCollection] = useState([]);
    const [items, setItems] = useState([]);
    const [allItems, setAllItems] = useState([]);
    const [newItem, setNewItem] = useState(false);
    const [newCollumn, setNewCollumn] = useState(false);
    const [editItemId, setEditItemId] = useState('');
    const [multiSelections, setMultiSelections] = useState([]);
    const [user, setUser] = useState('');
    
    let darkMode = localStorage.getItem("darkMode") ? localStorage.getItem("darkMode") : false;

    const navigate = useNavigate();
    let allTtags = [];
            allItems.map((item) => item.tags.map((tag) => allTtags = [...allTtags , tag]))

    useEffect(()=>{
        axios.get('http://localhost:5000/authentication/isuserauth', {
            headers: {
                "x-access-token" : localStorage.getItem("token")
            }
        })
        .then(function(res){
            setUser(res.data.username)

        })
        .catch(err => {
            console.log(err)
            navigate('/')
        })
        axios.get(`http://localhost:5000/collections/getcollections/${id}`)
        .then((res)=> {
            setCollection(res.data)
        }
        )
        axios.get('http://localhost:5000/items/getitems')
        .then((res)=> {
            setAllItems(res.data)
            setItems(res.data.filter((item)=> item.collectionId === id));
        }
        )



    }, [])

    function deleteItem(id){
        setItems(items.filter((item)=> {
            return item._id !== id
        }))
        axios.delete('http://localhost:5000/items/deleteitem', 
        {data: {id: id}})
        setTimeout(function(){
            window.location.reload();
         }, 200);
    }
    function editItem(id){
        setNewCollumn(false)
        setNewItem(false)
        let item = items.find((item)=>item._id === id)
        let itemTags = item.tags;
        setMultiSelections(itemTags)
        setEditItemId(id)
        window.scrollTo(0, 190);
    }
    function addEditItem(){
        if (editItemId !== ''){
            let item = items.find((item)=>item._id === editItemId);
            let id = item._id;
            // item.tags.map((tag) => setMultiSelections([...multiSelections, tag]))
            return(
                <div className="formcontainer">
                <h2>Edit item: {item.name}</h2>
                <form onSubmit={handleEditItem}>
                    <div className="form-group mb-2">
                        <label >Name:</label>
                        <input type="text" key={item.name} className="form-control" defaultValue={item.name}></input>
                    </div>
                        <label>Tags:</label>
                        <Typeahead
                        id="tagsselection"
                        labelKey="name"
                        multiple
                        onChange={setMultiSelections}
                        options={allTtags}
                        selected={multiSelections}
                        minLength="1"
                        align="left"
                        allowNew
                        newSelectionPrefix="Add a new tag: "
                        />
                        {/* {item.tags.map((tag)=>(<input type="text" key={tag} className="form-control" defaultValue={tag}></input>))} */}
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
        multiSelections.map((tag) => {
            if(typeof tag === "object"){
                tags = [...tags, tag.name]
            }else{
                tags = [...tags, tag]
            }
        })
        let tagsNumber = tags.length
        const CFLength = itemToBeChanged.customFields.length
        if (tagsNumber !==0 ) {
            for (let i = e.target.length - CFLength - 1; i<e.target.length-1; i++) {
                let field = {
                    name: e.target[i].id,
                    type: itemToBeChanged.customFields.find((field)=> field.name === e.target[i].id).type,
                    value: e.target[i].value
                }
                customFields = [...customFields, field]
        }
        }
        newItem = {
            name: e.target[0].value,
            tags: tags,
            customFields: customFields,
        }

        items[index] = newItem;
        setEditItemId('')
        axios.patch('http://localhost:5000/items/edititem', 
        {id:itemToBeChanged._id, name:e.target[0].value, tags: tags,
            customFields: customFields})
        setTimeout(function(){
            window.location.reload();
         }, 200);
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
        items.map((item)=>{item.customFields = [...item.customFields, newField]
            axios.patch('http://localhost:5000/items/edititem', 
            {id:item._id, customFields:item.customFields})
        })
        setNewCollumn(!newCollumn) 
        setTimeout(function(){
            window.location.reload();
         }, 200);
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
                    <div className="form-group mb-2">
                        <label >Tags:</label>
                        <Typeahead
                        id="tagsselection"
                        labelKey="name"
                        multiple
                        onChange={setMultiSelections}
                        options={allTtags}
                        placeholder="Add several tags to the item..."
                        selected={multiSelections}
                        minLength='1'
                        align="left"
                        allowNew
                        newSelectionPrefix="Add a new tag: "
                        />
                    </div>
                    {items.length !== 0 ? items[0].customFields.map((field) => {
                        return(
                            <div className="form-group mb-2 customfield">
                                <label>{field.name}</label>
                                {customFieldInput(field)}
                            </div>
                        )
                    }) : null}
                    <button type="submit" className="btn btn-primary">Add item</button>
                </form>
                </div>
            )
        }
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
        if (field.type === 'Number') {
            return(
                <input type="number" id={field.name} key={id} className='form-control' defaultValue={defaultValue} placeholder={placeHolder}></input>
            )
        } else if (field.type === "Text") {
            return(
                <input type="text" id={field.name} key={id} className="form-control" defaultValue={defaultValue} placeholder={placeHolder}></input>
            )
        } else if (field.type === "Multiline text") {
            return(
                <textarea id={field.name} key={id} defaultValue={defaultValue} className="form-control" rows="3"></textarea>
            )
        } else if (field.type === "Checkbox") {
            return(
                <input type="checkbox" id={field.name} key={id} className="form-check-input" defaultValue={defaultValue}></input>
            )
        } else if (field.type === "Date") {
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
        const CFLength = (items.length !== 0) ? items[0].customFields.length : 0;
        if (CFLength !== 0) {
            for (let i=e.target.length - CFLength - 1; i<e.target.length-1; i++) {
                let field = {
                    name: e.target[i].id,
                    type: items[0].customFields.find((item)=> item.name === e.target[i].id).type,
                    value: e.target[i].value
                }
                customFields = [...customFields, field]
        }
        }
        multiSelections.map((tag) => {
            if(typeof tag === "object"){
                tags = [...tags, tag.name]
            }else{
                tags = [...tags, tag]
            }
        })

        itemToBeAdded = {
            name: e.target[0].value,
            tags: tags,
            customFields: customFields,
            author : user,
            collectionId : collection._id,
            collectionName: collection.name,
        }
        console.log(itemToBeAdded)
        setItems([...items, itemToBeAdded])
        axios.post('http://courseprojectjakubkarwowski.herokuapp.com/items/createitem', 
        {
            name: itemToBeAdded.name,
            tags: itemToBeAdded.tags,
            customFields: itemToBeAdded.customFields,
            author : itemToBeAdded.author,
            collectionId : itemToBeAdded.collectionId,
            collectionName: itemToBeAdded.collectionName,
        })
        setNewItem(!newItem)
        setTimeout(function(){
            window.location.reload();
         }, 200);
    }
    return(
        <div className={darkMode === "true" ? "container dark" : "container"}>
        <h1>Collection {collection.name}</h1>
        <button type="button" className="btn btn-secondary m-2" onClick={()=>{setNewItem(!newItem);setNewCollumn(false);setEditItemId('');setMultiSelections([])}}>Add new item</button>
        <button type="button" className="btn btn-secondary m-2" onClick={()=>{setNewCollumn(!newCollumn); setNewItem(false);setEditItemId('')}}>Add new collumn</button>
        {addNewCollumn()}
        {addNewItem()}
        {addEditItem()}
        <CollectionTable id = {id} deleteItem = {deleteItem} editItem = {editItem} items = {items} />
        </div>
    )
}