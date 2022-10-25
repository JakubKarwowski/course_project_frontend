import "../styles/AdminPage.css"
import axios from "axios";
import {useEffect, useReducer, useState} from "react";
import {isRouteErrorResponse, useNavigate} from "react-router-dom";

function AdminPage () {

    const [users, setUsers] = useState([]);
    const [loggedId, setLoggedId] = useState("");

    const navigate = useNavigate();

    useEffect(()=>{
        axios.get('https://courseprojectjakubkarwowski.herokuapp.com/authentication/isuserauth', {
            headers: {
                "x-access-token" : localStorage.getItem("token")
            }
        })
        .then(function(res){
            const data = res.data;
            setLoggedId(data.id)
        })
        .catch(err => {
            console.log(err)
            navigate('/')
        })

        axios.get('https://courseprojectjakubkarwowski.herokuapp.com/users/getusers')
        .then((res) => {
            let loggedUser = res.data.filter(user => user._id === localStorage.getItem('id'))
            if(!loggedUser[0].admin){
                navigate('/')
            }
            setUsers(...users, res.data)})  
    },[])

    function handleOnChangeAdmin(e){
        if (e.target.checked){
            axios.patch('https://courseprojectjakubkarwowski.herokuapp.com/users/addtoadmins',{id:e.target.id})
        }
        else{
            axios.patch('https://courseprojectjakubkarwowski.herokuapp.com/users/removefromadmins',{id:e.target.id})
            if(e.target.id === loggedId){
                navigate('/')
            }
        }
        setUsers(users.map((user)=>{
            return(
                user._id === e.target.id ? {_id:user._id, username: user.username, admin: !user.admin, blocked: user.blocked} : user
            )
        }))
    }
    function handleOnChangeBlocked(e){
        if (e.target.checked){
            axios.patch('https://courseprojectjakubkarwowski.herokuapp.com/users/blockuser',{id:e.target.id})
            if (e.target.id === loggedId){
                localStorage.removeItem("token")
                navigate("/")
            }
        }
        else{
            axios.patch('https://courseprojectjakubkarwowski.herokuapp.com/users/unblockuser',{id:e.target.id})
        }
        setUsers(users.map((user)=>{
            return(
                user._id === e.target.id ? {_id:user._id, username: user.username, admin: user.admin, blocked: !user.blocked} : user
            )
        }))
    }
    function deleteUser(e){
        axios.delete(`https://courseprojectjakubkarwowski.herokuapp.com/users/deleteuser`, {data: {id: e.target.id}})
        setUsers(users.filter((user)=> {
            return user._id !==e.target.id})  
        )
    };
    function createUsers(){
        return(
            <tbody>
                {users.map((user)=>{
                    return(
                        <tr>
                            <td key='id'>{user._id}</td>
                            <td key='username'>{user.username}</td>
                            <td key='admin'>
                                <div className="form-check form-switch">
                                    <input className="form-check-input " type="checkbox" id={user._id} checked={user.admin} onChange={handleOnChangeAdmin}></input>
                                </div>
                            </td>
                            <td key='blocked'>
                                <div className="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" id={user._id} checked={user.blocked} onChange={handleOnChangeBlocked}></input>
                                </div>    
                            </td>
                            <td key='delete'>
                                <button className="delete" onClick={deleteUser} ><i className="bi bi-trash3-fill" id={user._id}></i></button>  
                            </td>
                        </tr>
                    )    
                })}
            </tbody>
        )
        
    }
    return(
        <>
            <h1>AdminPage</h1>
            <table className="table table-bordered">
                <thead className="table-dark">
                    <tr>
                        <th scope="col" key='idtitle'>id</th>
                        <th scope="col" key='usernametitle'>username</th>
                        <th scope="col" key='admintitle'>admin</th>
                        <th scope="col" key='blockedtitle'>blocked</th>
                        <th scope="col" key='deletetitle'></th>
                    </tr>
                </thead>
                    {createUsers()}
            </table>

        </>
        
    )
}

export default AdminPage;
