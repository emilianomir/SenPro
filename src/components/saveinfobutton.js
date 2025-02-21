import { useRouter } from 'next/router';

export default function SaveInfoButton({name, location}){
    const router = useRouter();
    return (
        <button type = "button" onClick={()=> router.push(location)} className = "btn btn-primary ">{name}</button>
  
    )

}

