import "../css/services_page.css"
import ServiceCard from "@/components/ServiceCard";
import ServicePageHeading from "@/components/ServicePageHeading";


export default function Services(){
    const servs = {name: "Taquiera Del Primo", rating: 3.9, dist: 2.5, image: "https://s3-us-west-2.amazonaws.com/mfcollectnew/ChIJ7YSlk3N3ZYYRQsYL3jLaIBE/WYHhFvbY5n.png"}
    const servs2 = {name: "Don Pedro", rating: 4.0, dist: 3.2, image: "https://th.bing.com/th/id/OIP.p-ILasAimGCRf8vGdt5gWgHaJ6?w=115&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"}
    const other = [1,2,4,5,9, 10, 12];

    return (
        <div className="full_page bg-secondary">
            <ServicePageHeading />
            <div className="container mt-4 ms-4">
                <div className="fs-2 text-white fw-bold mb-3">
                    Selection:
                </div>
                <div className="row row-cols-5 circles mb-2">
                    <div className="col-2" >
                        <div className="h-100 rounded-circle bg-white w-50">
                            <div className="d-flex justify-content-center align-items-center h-100 fs-4">
                                Food
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className="me-0 ms-4 ps-3">
                <div className="fs-2 mt-3 text-white fw-bold mb-3">Choose your service: </div>
                <div className="scroll">
                {other.map((index)=>(
                    <div key ={index} className="d-inline-block me-4">                         
                        <ServiceCard service={servs} /> 
                    </div>

                ))}
                <div className="d-inline-block me-4">
                    <ServiceCard service={servs2} />
                </div>
            </div>
            </div>
        </div>
    )
}