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
            <h2>Tag cloud:</h2>
            <TagsCloud/>
        </div>
        
    )
}

export default Homepage;