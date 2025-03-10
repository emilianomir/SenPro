<<<<<<< HEAD
import "../app/css/services_page.css"
=======
>>>>>>> origin/main
export default function Favorites_Section ({favoritesList}){

    return (
        <div className="container">
            {favoritesList.length === 0 ? 
            <div className="text-center fs-4 text-white">
                No Favorites Yet. Favorite your favorite services to see them here!
            </div>    
            :
            <div className="scroll">
                {favoritesList.map((theFavorite) => (
<<<<<<< HEAD
                    <div className="d-inline-block me-4">
                        <div key = {theFavorite.name} className="card">
                            <img src = {theFavorite.photo} className="card-img-top"/>
                            <h5 className="card-title fs-3 text-center fw-bold">{theFavorite.name}</h5>
                        </div>
                    </div>
=======
                    <div className="bg-white"> {theFavorite.name} </div>
>>>>>>> origin/main
                ) )
                }
            </div>
            }
        </div>
    )
}