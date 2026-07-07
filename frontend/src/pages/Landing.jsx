import "../App.css"
import { Link, useNavigate } from "react-router-dom";
function Landing() {

    const router = useNavigate()
    return (
        <div className="landingPageContainer">
            <nav>
                <div className="navHeader">
                    <h2>Apna video Call</h2>
                </div>
                <div className="navList">
                    <p onClick={() => {
                        router("/q23qsc")
                    }}>Join as Guest</p>

                    <p onClick={() => {
                        router("/auth")
                    }}> Register</p>

                    <div onClick={() => {
                        router("/auth")}}
                        
                        role = "button" >

                            <p onClick={() => {
                                router("/q23qsc")
                            }}>Login</p>


                    </div>

        </div>

            </nav >


        <div className="landingMainContainer">
            <div>
                <h1> <span style={{ color: "#FF9839" }}>Connect</span>  with your loved Ones</h1>
                <p>Cover a distance by apnaVideo call</p>

                <div role="button">
                    <Link to={"/auth"}>Get Started</Link>

                </div>
            </div>
            <div>
                <img src="/mobile.png" alt="" />
            </div>
        </div>

        </div >
    );
}

export default Landing;