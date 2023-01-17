import axios from "axios";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {
    DatatableWrapper,
    Pagination,
    PaginationOptions,
    TableBody,
    TableHeader
  } from 'react-bs-datatable';
  import {Col, Row, Table } from 'react-bootstrap';
  import 'bootstrap/dist/css/bootstrap.min.css';

  export default function CollectionTable(props){

    const [items, setItems] = useState([]);
    

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
        axios.get(`http://localhost:5000/items/getitems/`)
        .then((res)=> {
            setItems(res.data)
        }
        )
    }, [])

    let headers = [ 
                    {title: "Item name", prop: 'name'},
                    {title: "Collection", prop: 'collection'},
                    {title: "Author", prop: 'author'},  
                    {title: "Last update", prop: 'timestamp'},  
    ];
    
    let body = [];
    let allFields=[];

    items.map((item) =>{
        // let date = new Date(item.updatedAt).toLocaleString()
        let fields = {name: item.name, collection: item.collectionName, author: item.author, timestamp: item.updatedAt};
        allFields = [...allFields, fields]
    })      
    allFields.sort((a,b)=> ( new Date(b.timestamp) - new Date(a.timestamp)))
    allFields.map((field)=> {
        field.timestamp = new Date(field.timestamp).toLocaleString();
    })
    body = allFields;
    
    return(
            <DatatableWrapper  
                body={body} 
                headers={headers}
                paginationOptionsProps={{
                    initialState: {
                      rowsPerPage: 10,
                      options: [5, 10, 15, 20]
                    }
                  }}
                >
                
                <Table
                className={darkMode === "true" ? "table table-bordered table-dark mb-0" : "table table-bordered mb-0"}>
                    <TableHeader />
                    <TableBody />
                </Table>
                <Row className="mb-2 p-2">
                    <Col
                    xs={6}
                    
                    className="d-flex flex-col align-items-center justify-content-sm-start mb-2 mb-sm-0"
                    >
                    <PaginationOptions />
                    </Col>
                    <Col
                    xs={6}
                    className="d-flex flex-col justify-content-end align-items-end"
                    >
                    <Pagination />
                    </Col>
                </Row>    
            </DatatableWrapper>
    )
}