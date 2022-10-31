import '../styles/Homepage.css'
import LatestItems from './LatestItems'
import LargestCollections from './LargestCollections';
import TagsCloud from './TagsCloud';

function Homepage () {

    let darkMode = localStorage.getItem("darkMode") ? localStorage.getItem("darkMode") : "false";

    return(
        <div className={darkMode === "true" ? "container dark" : "container"}>
            <h1>Homepage</h1>
            <h2>Latest items:</h2>
            <LatestItems/>
            <h2>Top 5 largest collections:</h2>
            <LargestCollections/>
            <h2>tag cloud (when the user clicks on the tag you display the list of items — in general you should use “search results page” for it).</h2>
            <TagsCloud/>
        </div>
        
    )
}

export default Homepage;