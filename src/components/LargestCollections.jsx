import axios from "axios";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {
    DatatableWrapper,
    TableBody,
    TableHeader
  } from 'react-bs-datatable';
import {Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


export default function LargestCollections(){

    const [collections, setCollections] = useState([])
    const [items, setItems] = useState([])

    const navigate = useNavigate();
    let darkMode = localStorage.getItem("darkMode") ? localStorage.getItem("darkMode") : "false";

    useEffect(()=>{
        axios.get('http://localhost:5000/authentication/isuserauth', {
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
        axios.get(`http://localhost:5000/collections/getcollections/`)
        .then((res)=> {
            setCollections(res.data)
        }
        )
        axios.get(`http://localhost:5000/items/getitems/`)
        .then((res)=> {
            setItems(res.data)
        }
        )
    }, [])

    let headers = [ 
        {title: "Collection Name", prop: 'name'},
        {title: "Topic", prop: 'topic'},
        {title: "Author", prop: 'author'},  
        {title: "Number of items", prop: 'itemsnumber'},  
    ];

    let body=[];
    let allCollectionFields=[];

    collections.map((collection)=>{
        let collectionItems = items.filter((item) => item.collectionId === collection._id)
        let collectionFields ={name: collection.name, topic: collection.topic, author: collection.owner, itemsnumber: collectionItems.length}
        allCollectionFields = [...allCollectionFields, collectionFields]
    })

    allCollectionFields.sort((a,b) => (b.itemsnumber - a.itemsnumber))
    if(allCollectionFields.length <= 5){
        body = allCollectionFields;
    } else{
        body = allCollectionFields.slice(0,5)
    }
    
    return(
        <DatatableWrapper
            headers= {headers}
            body={body}
        >
            <Table
                className={darkMode === "true" ? "table table-bordered table-dark" : "table table-bordered"}>
                    <TableHeader />
                    <TableBody />
            </Table>
        </DatatableWrapper> 

    )

}