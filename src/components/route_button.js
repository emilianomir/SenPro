import Link from "next/link";

function RouteButton({name, location}){
    return ( 
        <Link href = {location} passHref>
            <button type="button"  className="px-3 py-5 text-content-text text-4xl rounded-lg border-2 border-solid w-full border-gray-300 hover:bg-land-hover focus:outline-2 active:bg-gray-700">{name}</button>
        </Link>

    )
}

export default RouteButton;