import axios from "axios";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {
    DatatableWrapper,
    TableBody,
    TableHeader
  } from 'react-bs-datatable';
  import {Col, Row, Table } from 'react-bootstrap';
  import 'bootstrap/dist/css/bootstrap.min.css';

  export default function SearchItemsResults(props) {

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
    }, [])

    let headers = [ 
        {title: "Item name", prop: 'name'},
        {title: "Collection", prop: 'collection'},
        {title: "Tags", prop: 'tags'},  
        {title: "Author", prop: 'author'},  
    ];
    let body =[];
    if(props.searchedItems.length !==0){
        let tagsToAdd;
        props.searchedItems.map((item)=> {
            item.tags.map((tag)=> tagsToAdd = tagsToAdd + ` #${tag}`)
            let field = {name: item.name, collection: item.collectionName, tags: tagsToAdd, author: item.author}
            body = [...body, field]
        })
    }

    if(props.searchedItems.length !==0){
        return(
            <>
            <h2>Search Results (items)</h2>
            <button className="btn btn-secondary" onClick={()=>props.setSearchedItems([])}>Exit search</button>
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
        </>
        )
    } else return(null)
  }