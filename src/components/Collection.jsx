import axios from "axios";
import {useEffect, useState, useContext} from "react";
import {useNavigate, useParams} from "react-router-dom";
import CollectionTable from './CollectionTable'
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import {DarkModeContext} from '../App'
// import TextInput from 'react-autocomplete-input';
// import 'react-autocomplete-input/dist/bundle.css';

export default function Collection(){
    const {id} = useParams()

    const [collection, setCollection] = useState([]);
    const [items, setItems] = useState([]);
    const [tagsNumber, setTagsNumber] = useState(0);
    const [newItem, setNewItem] = useState(false);
    const [newCollumn, setNewCollumn] = useState(false);
    const [editItemId, setEditItemId] = useState('');
    const [nameSortOrder, setNameSortOrder] = useState("");
    const [multiSelections, setMultiSelections] = useState([]);
    
    let darkMode = localStorage.getItem("darkMode") ? localStorage.getItem("darkMode") : false;

    const navigate = useNavigate();
    let allTtags = [];
            items.map((item) => item.tags.map((tag) => allTtags = [...allTtags , tag]))

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

    // function createItems(){
    //     if (collection.length !== 0 && items){
    //     return(
    //         <tbody>
    //             {items.map((item)=>(
    //                 <tr>
    //                     <td key='delete'>
    //                             <button key="deletebutton" className="delete" onClick={()=>{deleteItem(item._id)}} ><i className="bi bi-trash3-fill"></i></button>  
    //                     </td>
    //                     <td key='edit'>
    //                         <button key="editbutton" className="delete" onClick={()=>{editItem(item._id)}} ><i className="bi bi-pencil-fill"></i></button>  
    //                     </td>
    //                     <td key="item">{item.hasOwnProperty('_id') ? item._id : null}</td>
    //                     <td key="name">{item.name}</td>
    //                     <td key='tags'>{item.tags.map((tag)=> (<i key={tag}> #{tag}</i>))}</td>
    //                     {createCustomFieldValues(item)}
    //                 </tr>
    //             ))}
    //         </tbody>
    //     )}
    // }
    function deleteItem(id){
        const newItems = items.filter((item)=> {
            return item._id !== id
        })
        setItems(items.filter((item)=> {
            return item._id !== id
        }))
        console.log(newItems)
        axios.patch('https://courseprojectjakubkarwowski.herokuapp.com/collections/editcollection', 
        {id:collection._id, items:newItems})
        // document.location.reload()
    }
    function editItem(id){
        setEditItemId(id)
        setNewCollumn(false)
        setNewItem(false)
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
                        defaultSelected={item.tags}
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
        axios.patch('https://courseprojectjakubkarwowski.herokuapp.com/collections/editcollection', 
        {id:collection._id, items:items})
        document.location.reload()
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
        document.location.reload()
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
    // function createTags(){

    //     return(
    //         <div className="form-group mb-2 tags">
    //         <button type="button" onClick={() => setTagsNumber(tagsNumber + 1)} className="btn btn-primary">Add Tag</button>
    //         {addTags()}
    //         </div>
    //     )
    // }
    // function addTags(){
    //     let tags = [];
    //         items.map((item) => item.tags.map((tag) => tags = [...tags , tag]))
    //     return(
    //         // [...Array(tagsNumber)].map((item)=>(<TextInput options={tags} Component='string'  />)) 
    //         <Typeahead
    //         id="tagsselection"
    //         labelKey="name"
    //         multiple
    //         onChange={setMultiSelections}
    //         options={tags}
    //         placeholder="Add several tags to the item..."
    //         selected={multiSelections}
    //         />
    //     )
    // }
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
        console.log("Start")
        let customFields = [];
        let itemToBeAdded = {};
        let tags=[];
        const CFLength = items[0].customFields.length
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
        }
        const newItems = [...items, itemToBeAdded]
        setItems([...items, itemToBeAdded])
        console.log(newItems)
        setNewItem(!newItem)
        axios.patch('https://courseprojectjakubkarwowski.herokuapp.com/collections/editcollection', 
        {id:collection._id, items:newItems})
        document.location.reload()
    }
    // function createCustomFieldHeader(){
    //     if (items && items.length !==0 && items[0].customFields.length !== 0 ){
    //         console.log(items)
    //         return(
    //             items[0].customFields.map((field) => (
    //                 <th scope="col" onClick={()=>handleSorting(field)} key={field._id}>{field.name}</th>
    //             ))
    //         )
    //     }
    // }
    // function createCustomFieldValues(item){
    //     if (items && items.length !==0 && items[0].customFields.length !== 0 ){
    //         return(
    //             item.customFields.map((field)=>(<td key={field._id}>{field.value}</td>))
    //         )
    //     }
    // }
    // function handleSorting(e){
    //     if (e === "id"){
    //         if(nameSortOrder !== "id"){
    //             setItems(items.sort((a,b) => a._id.toString().localeCompare(b._id.toString())))
    //             setNameSortOrder("id")
    //         } else if (nameSortOrder === "id"){
    //             setItems(items.sort((a,b) => b._id.toString().localeCompare(a._id.toString())))
    //             setNameSortOrder("")
    //         }
            
    //     } else if (e === "name"){
    //         if(nameSortOrder !== "name"){
    //             setItems(items.sort((a,b) => a.name.localeCompare(b.name)))
    //             setNameSortOrder("name")
    //         }else if (nameSortOrder === "name"){
    //             setItems(items.sort((a,b) => b.name.localeCompare(a.name)))
    //             setNameSortOrder("")
    //         }
    //     }    
    //     else {
    //         if(nameSortOrder !== e.name){
    //             console.log(e.type)
    //             let fieldToBeSortedBy = items[0].customFields.find((field)=> field.name === e.name)
    //             let index = items[0].customFields.indexOf(fieldToBeSortedBy)
    //             if(e.type[0] === "Text" || e.type[0] === "Multiline text"){
    //                 setItems(items.sort((a,b) => a.customFields[index] > b.customFields[index] ? 1 : -1 ))
    //             } else if (e.type === "Number"){
    //                 setItems(items.sort((a,b) => a.customFields[index] - b.customFields[index] ? 1 : -1 ))
    //             }
    //             setNameSortOrder(e.name[0])
    //         }
    //     }    
        
    // }

    return(
        <div className={darkMode ? "container dark" : "container"}>
        <h1>Collection {collection.name}</h1>
        <button type="button" className="btn btn-secondary m-2" onClick={()=>{setNewItem(!newItem);setNewCollumn(false);setEditItemId('')}}>Add new item</button>
        <button type="button" className="btn btn-secondary m-2" onClick={()=>{setNewCollumn(!newCollumn); setNewItem(false);setEditItemId('')}}>Add new collumn</button>
        {addNewCollumn()}
        {addNewItem()}
        {addEditItem()}
        {/* <table className="table table-bordered" id="sortTable">
            <thead className="table-dark">
                <tr>
                    <th scope="col" key='deletetitle'></th>
                    <th scope="col" key='edittitle'></th>
                    <th scope="col" onClick={()=>handleSorting("id")} key='idtitle'>id</th>
                    <th scope="col" onClick={()=>handleSorting("name")} key='nametitle'>name</th>
                    <th scope="col" key='tagtitle'>tags</th>
                    {createCustomFieldHeader()}
                </tr>
            </thead>
                {createItems()}
        </table> */}
        <CollectionTable id = {id} deleteItem = {deleteItem} editItem = {editItem} items = {items} />
        </div>
    )
}