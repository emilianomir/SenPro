import Link from "next/link";

function RouteButton({name, location}){
    return ( 
        <Link href = {location} passHref>
            <button type="button"  className="px-3 py-5 text-3xl lg:text-4xl rounded border-1 border-solid w-full border-white">{name}</button>
        </Link>

    )
}

export default RouteButton;