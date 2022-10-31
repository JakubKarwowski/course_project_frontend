import axios from "axios";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {
    DatatableWrapper,
    Filter,
    TableBody,
    TableHeader
  } from 'react-bs-datatable';
  import { Button, Col, Row, Table } from 'react-bootstrap';
  import 'bootstrap/dist/css/bootstrap.min.css';

  export default function CollectionTable(props){

    const [collections, setCollections] = useState([]);
    

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
        axios.get(`https://courseprojectjakubkarwowski.herokuapp.com/collections/getcollections/`)
        .then((res)=> {
            setCollections(res.data)
        }
        )
    }, [])
    
    // let allItems = [] 
    // collections.map ((collection) => {
    //     collection.items.map((item) => {
    //         allItems = [...allItems, item]
    //     })
    // })

    let headers = [ 
                    {title: "Item name", prop: 'name'},
                    {title: "Collection", prop: 'collection'},
                    {title: "Author", prop: 'author'},  
                    {title: "TimeStamp", prop: 'timestamp'},  
    ];
    
    let body = [];
    collections.map ((collection) => {
        collection.items.map((item) =>{
            let fields = {name: item.name, collection: collection.name, author: collection.owner,};

            body = [...body, fields]
        })
        // let tagsToAdd = "";
        // item.tags.map((tag)=> tagsToAdd = tagsToAdd + ` #${tag}`)
        
        // let customFields={};
        // item.customFields.map((field) => {
        //     customFields[field.name] = field.value})
        // const allFields = Object.assign(knownFields, customFields)
        
    })
    
    return(
        
            <DatatableWrapper  body={body} headers={headers}>
                <Row className="m-3">
                    <Col
                    xs={11}
                    lg={11}
                    className="d-flex justify-content-end"
                    >
                    {/* <Filter placeholder="Enter text to filter the collection"/> */}
                    </Col>
                </Row> 
                <Table
                className={darkMode === "true" ? "table table-bordered table-dark" : "table table-bordered"}>
                    <TableHeader />
                    <TableBody />
                </Table>
            </DatatableWrapper>
    )
}