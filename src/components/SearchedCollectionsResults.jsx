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

  export default function SearchedCollectionsResults(props) {

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
        {title: "Collection name", prop: 'name'},
        {title: "Topic", prop: 'topic'},
        {title: "Owner", prop: 'owner'},    
    ];
    let body =[];
    if(props.searchedCollections.length !==0){
        let tagsToAdd;
        props.searchedCollections.map((collection)=> {
            let field = {name: collection.name, topic: collection.topic, tags: tagsToAdd, owner: collection.owner}
            body = [...body, field]
        })
    }

    if(props.searchedCollections.length !==0){
        return(
            <>
            <h2>Search Results (collections)</h2>
            <button className="btn btn-secondary" onClick={()=>props.setSearchedCollections([])}>Exit search</button>
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