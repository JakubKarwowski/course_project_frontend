import axios from "axios";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import { TagCloud } from 'react-tagcloud'
import SearchItemsResults from "./SearchItemsResults";


export default function TagsCloud(){

    const [items, setItems] = useState([]);      
    const [searchedItems, setSearchedItems] = useState([]);      

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
        axios.get('https://courseprojectjakubkarwowski.herokuapp.com/items/getitems')
        .then((res)=> {
            setItems(res.data);
        }
        )
    }, [])
    
    let tags=[];

    items.map((item) =>{
        item.tags.map((tag)=>{
            tags = [...tags, tag];
        })
    })
    const tagsCalculated = {};

    for(const tag of tags) {
        if(tagsCalculated[tag]){
            tagsCalculated[tag] +=1;
        } else{
            tagsCalculated[tag] = 1
        }
    }

    const tagNames = Object.keys(tagsCalculated);
    const tagValues = Object.values(tagsCalculated);
    let data=[];

    for (let i=0; i<tagNames.length; i++){
        let datafield = {value: tagNames[i], count: 12 + tagValues[i]*2}
        data = [...data, datafield]
    }
    return(
        <>
        <TagCloud
            minSize={20}
            maxSize={70}
            tags={data}
            onClick={tag => {
                axios.get(`https://courseprojectjakubkarwowski.herokuapp.com/items/searchitems/${tag.value}`)
                .then((res)=> {
                setSearchedItems(res.data)
                })}}
        />
        {searchedItems.length !== 0 ? <SearchItemsResults searchedItems ={searchedItems} setSearchedItems = {setSearchedItems} /> : null}
        </>
    )
}