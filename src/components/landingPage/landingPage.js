import React, {Component} from 'react';
import { NavLink } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import './landingPage.css';

class LandingPage extends Component {
    render() {
        return(
            <div className="landingPage">
                <div className="header">
                    <NavLink to="/">MyStreet</NavLink>
                </div>
                <div className="signInOptions">
                    <NavLink to="/seller"><button className="seller-button">Sign in for selling</button></NavLink>
                    <NavLink to="/buyer"><button className="buyer-button">Sign in for buying</button></NavLink>
                </div>
                <div className="customerDesc">
                    <h1>Order amazing street food with just one click</h1>
                    <hr/>
                    <Grid container className="clickImg-Grid-Container">
                        <Grid xs={12} sm={6} item className="clickImg-Grid">
                            <img src={require("../../assets/click.jpg")} className="clickImg"/>
                        </Grid>
                        <Grid xs={12} sm={6} item className="clickText-Grid">
                            <p>Using MyStreet you can easily get your favourite street food delivered right at your home from your closest street food vendors.</p>
                        </Grid>
                    </Grid>
                </div>
                <div className="sellerDesc">
                    <h1>Sell your delicious street food on our platform</h1>
                    <hr/>
                    <Grid container className="foodImg-Grid-Container">
                        <Grid xs={12} sm={6} item className="foodText-Grid">
                            <p>Sell your delicious street food on MyStreet to get more and more buyers across your place.</p>
                        </Grid>
                        <Grid xs={12} sm={6} item className="foodImg-Grid">
                            <img src={require("../../assets/streetFood.jpg")} className="foodImg"/>
                        </Grid>
                    </Grid>
                </div>
                <div className="footer">
                <p>Made with <i className="fas fa-heart" style = {{color: "#dd1b3b"}}></i> by <a href="https://github.com/aditya2000" target="_blank">Aditya Dehal</a></p>
                    <p>&copy; 2019 MyStreet. All rights reserved.</p>
                </div>
            </div>
        );
    }
}

export default LandingPage;