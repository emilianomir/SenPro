import Link from "next/link";

function RouteButton({name, location}){
    return ( 
        <Link href = {location} passHref>
            <button type="button"  className="px-3 py-5 text-4xl rounded border-1 border-solid btn-lg w-full border-white hover:bg-gray-600 focus:outline-2 active:bg-gray-700">{name}</button>
        </Link>

    )
}

export default RouteButton;