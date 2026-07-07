import "../App.css";
import { Link, useNavigate } from "react-router-dom";

function Landing() {

    const router = useNavigate();

    const createRoom = () => {
        const room = Math.random()
            .toString(36)
            .substring(2, 8);

        router(`/${room}`);
    };


    return (
        <div className="landingPageContainer">

            <nav>

                <div className="navHeader">
                    <h2>Apna Video Call</h2>
                </div>


                <div className="navList">

                    <p onClick={createRoom}>
                        Join as Guest
                    </p>


                    <p onClick={() => router("/auth")}>
                        Register
                    </p>


                    <p onClick={() => router("/auth")}>
                        Login
                    </p>

                </div>

            </nav>


            <div className="landingMainContainer">

                <div>

                    <h1>
                        <span style={{ color: "#FF9839" }}>
                            Connect
                        </span>
                        {" "}with your loved Ones
                    </h1>


                    <p>
                        Cover a distance by Apna Video Call
                    </p>


                    <div role="button">

                        <Link to="/auth">
                            Get Started
                        </Link>

                    </div>


                </div>


                <div>

                    <img
                        src="/mobile.png"
                        alt="video call"
                    />

                </div>


            </div>

        </div>
    );
}


export default Landing;