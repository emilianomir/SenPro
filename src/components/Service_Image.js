import { useState } from "react"
import Image from "next/image";
import "../app/css/gallery.css"
export default function Service_Image ({url}){
    const [error, setError] = useState(false);
    return(
        <Image className="d-inline-block me-4 set_images h-100 w-100" src= {error || !url ? "https://cdn-icons-png.flaticon.com/512/2748/2748558.png": url} width={200} height={200} onError={() => setError(true)} alt = "Service image" unoptimized = {true} />  
    )
    
}