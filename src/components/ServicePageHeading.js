export default function ServicePageHeading(){
    return (
        <div>
            <div className = "row row-cols-3 h-25 border_design pb-2">
                <div className = "col-3 ps-5 pt-2"> <img  width = "15%" src ="https://www.nicepng.com/png/full/17-178841_home-png-home-icon-free.png" alt = "home icon"/></div>
                <div className="col-6 text-center pt-2"><h1 className="fs-1 fw-bolder text-white">Services Menu</h1></div>
                <div className="col-3 pe-5 pt-2 d-flex justify-content-end"><img width="15%" src = "https://www.shareicon.net/data/256x256/2017/03/14/881194_users_512x512.png" alt = "profileIcon" /> </div>
            </div>
        </div>
    )
}