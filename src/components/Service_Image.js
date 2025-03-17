import { useState } from "react"
import Image from "next/image";
export default function Service_Image ({url}){
    const [error, setError] = useState(false);
    return(
        <Image className="d-inline-block me-4" src= {error ? "https://cdn-icons-png.flaticon.com/512/2748/2748558.png": url} width={300} height={300} onError={() => setError(true)} alt = "Service image" unoptimized = {true} />  
    )
    
}