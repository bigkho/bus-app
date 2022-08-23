import React from "react";
import "../styles/Home.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="main-banner">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="row">
              <div className="col-lg-6 align-self-center">
                <div className="left-content">
                  <div className="row">
                    <div className="col-lg-12">
                      <h6>The MTA Network</h6>
                      <h2>Ever missed the bus?</h2>
                      <p>

                        Check with the app to check where the nearest bus is down below:

                      
                      
                      </p>
                    </div>
                    <div className="col-lg-12">
                      <div className="border-first-button">
                        <Link as={Link} to="">Check times</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="right-image">
                <img src={"../images/bus.png"} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;