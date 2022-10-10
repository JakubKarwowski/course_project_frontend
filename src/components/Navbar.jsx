import "../styles/Navbar.css"

function Navbar() {


    return(
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <a className="navbar-brand" href="http://localhost:3000/"><i className="bi bi-house-door-fill"></i></a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="http://localhost:3000/register">Register</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link active" href="http://localhost:3000/login">Login</a>
                        </li>                       
                    </ul> 
                </div>
                <form className="d-flex" role="search">
                    <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"></input>
                    <button className="btn btn-light" type="submit">Search</button>
                </form>
            </div>
        </nav>
    );
}

export default Navbar;