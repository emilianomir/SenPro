import Link from "next/link";

function RouteButton({name, location}){
    return ( 
        <Link href = {location} passHref>
            <button type="button"  className="btn btn-lg w-100 btn-primary">{name}</button>
        </Link>

    )
}

export default RouteButton;