import axios from "axios";
import {useEffect, useState, useContext} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {
    DatatableWrapper,
    Filter,
    TableBody,
    TableHeader
  } from 'react-bs-datatable';
  import { Button, Col, Row, Table } from 'react-bootstrap';
  import 'bootstrap/dist/css/bootstrap.min.css';
  import {DarkModeContext} from '../App'

export default function CollectionTable(props){

    const [collection, setCollection] = useState([]);
    const [items, setItems] = useState([]);
    

    const navigate = useNavigate();
    const id = props.id;
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
        axios.get(`https://courseprojectjakubkarwowski.herokuapp.com/collections/getcollections/${id}`)
        .then((res)=> {
            setCollection(res.data)
            setItems(res.data.items)
        }
        )
    }, [])
    

    let headers = [ {
                        prop: "delete",
                        cell: (row) => (
                        <Button
                        className={darkMode === "true" ? "nostyle dark" : "nostyle"}
                        onClick={()=>{
                            props.deleteItem(row.id)
                        }}
                        >
                           <i className="bi bi-trash3-fill"></i>
                        </Button>
                        )
                    },
                    {
                        prop: "edit",
                        cell: (row) => (
                        <Button
                        className={darkMode === "true" ? "nostyle dark" : "nostyle"}
                        onClick={()=>{props.editItem(row.id)
                                    }}
                        >
                           <i className="bi bi-pencil-fill"></i>
                        </Button>
                        )
                    },
                    {title: "ID", prop: 'id', isSortable: true, isFilterable: true,},
                    {title: "Name", prop: 'name', isSortable: true, isFilterable: true},
                    {title: "Tags", prop: 'tags', isFilterable: true},  
    ];
    if (items.length !== 0) {
        items[0].customFields.map((field)=> headers = [...headers, {title: field.name, prop: field.name, isFilterable: true}])
    }
    let body = [];
    items.map ((item) => {
        let tagsToAdd = "";
        item.tags.map((tag)=> tagsToAdd = tagsToAdd + ` #${tag}`)
        let knownFields = {id: item._id, name: item.name, tags: tagsToAdd};
        let customFields={};
        item.customFields.map((field) => {
            customFields[field.name] = field.value})
        const allFields = Object.assign(knownFields, customFields)
        body = [...body, allFields]
    })
    return(
        
            <DatatableWrapper  body={body} headers={headers}>
                <Row className="m-3">
                    <Col
                    xs={11}
                    lg={11}
                    className="d-flex justify-content-end"
                    >
                    <Filter placeholder="Enter text to filter the collection"/>
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