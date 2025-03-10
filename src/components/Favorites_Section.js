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
                    <div className="bg-white"> {theFavorite.name} </div>
                ) )
                }
            </div>
            }
        </div>
    )
}