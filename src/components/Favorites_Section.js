import "../app/css/services_page.css"
export default function Favorites_Section ({favoritesList}){

    return (
        <div className="container pb-5">
            {favoritesList.length === 0 ? 
            <div className="text-center fs-4 text-white">
                No Favorites Yet. Favorite your favorite services to see them here!
            </div>    
            :
            <div className="scroll">
                {favoritesList.map((theFavorite) => (
                    <div key = {theFavorite.name} className="d-inline-block me-4">
                        <div className="card">
                            <img src = {theFavorite.photo} className="card-img-top"/>
                            <h5 className="card-title fs-3 text-center fw-bold">{theFavorite.name}</h5>
                        </div>
                    </div>
                ) )
                }
            </div>
            }
        </div>
    )
}