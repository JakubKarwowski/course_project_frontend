import '../styles/Homepage.css'

function Homepage () {

    let darkMode = localStorage.getItem("darkMode") ? localStorage.getItem("darkMode") : "false";

    return(
        <div className={darkMode === "true" ? "container dark" : "container"}>
            <h1>Homepage</h1>
            <h2>list of the latest items (name, collections, authors);</h2>
            <h2>list of the top 5 largest collections;</h2>
            <h2>tag cloud (when the user clicks on the tag you display the list of items — in general you should use “search results page” for it).</h2>
        </div>
        
    )
}

export default Homepage;