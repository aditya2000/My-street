import React, {Component} from 'react';
import firebase from '../../firebaseConfig';
import ReactGoogleMapLoader from 'react-google-maps-loader';
import ReactGooglePlacesSuggest from 'react-google-places-suggest';
import Grid from '@material-ui/core/Grid';
import NavbarBuyer from '../home/navbarBuyer/navbarBuyer';
import {withRouter} from 'react-router-dom';
import './home.css';

const API_KEY = 'AIzaSyCToLsEKMFp9LSUpgp4aiM2qbo7yXOwkr8'

class Home extends Component {
    _ismounted = false;
    constructor(props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleSelectSuggest = this.handleSelectSuggest.bind(this)
        this.submitAddress = this.submitAddress.bind(this)
        this.getItems = this.getItems.bind(this)
        this.createOrder = this.createOrder.bind(this)
        this.updateLocation = this.updateLocation.bind(this)
        this.calculateDistance = this.calculateDistance.bind(this)
        this.state = {
            search: '',
            value: '',
            items: [],
            latitude: null,
            longitude: null,
        }
        this.db = firebase.firestore();
        this.db.settings({
            timestampsInSnapshots: true
        })
    }

    componentDidMount() {
        this._ismounted = true;
        this.getItems();

        navigator.geolocation.watchPosition((position) => {
            this.setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }, ()=> {this.updateLocation()})}
        );
    }

    componentWillUnmount() {
        this._ismounted =false;
    }

    getItems() {
        firebase.auth().onAuthStateChanged((user) => {
            if(user) {
                this.db.collection("users").where("userid", "==", firebase.auth().currentUser.uid)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        let userLoc = [doc.data().latitude, doc.data().longitude];
                        this.db.collection('items').where("userCity", "==", doc.data().city)
                        .get()
                        .then((querySnapshot) => {
                            querySnapshot.forEach((doc) => {
                                let itemLoc = [doc.data().latitude, doc.data().longitude];
                                let distance = this.calculateDistance(userLoc, itemLoc);
                                if(this._ismounted && distance < 2){this.setState(previousState => ({
                                    items: [...previousState.items, doc.data()]
                                }))}
                            })
                        }).catch(error => console.log(error))
                    })
                })
            } else{
                console.log("user not logged in!!")
            } 
        })
    }

    handleInputChange(e) {
        this.setState({
            search: e.target.value,
            value: e.target.value
        })
    }

    handleSelectSuggest(geocodedPrediction, originalPrediction) {
        console.log(geocodedPrediction, originalPrediction);
        this.setState({
            search: '',
            value: geocodedPrediction.formatted_address
        })
    }

    submitAddress() {
        const db = this.db;
        const state = this.state;
        db.collection('users').where("userid", "==", firebase.auth().currentUser.uid)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                db.collection('users').doc(doc.id).update({
                    address: state.value
                })
            })
        })
        
    }

    createOrder(e) {
        const { param } = e.target.dataset
        const paramData = JSON.parse(param)

        this.props.history.push('/createOrder', {
                sellerid: paramData.sellerid,
                userid: firebase.auth().currentUser.uid,
                price: paramData.price,
                itemName: paramData.item,
                state: "Pending"
            });
    }

    updateLocation() {
        const db = this.db;
        const state = this.state;

       db.collection('users').where("userid", "==", firebase.auth().currentUser.uid)
        .onSnapshot(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                db.collection('users').doc(doc.id).update({
                    latitude: state.latitude,
                    longitude: state.longitude
                })
            })
        })
    }

    calculateDistance(userLoc, itemLoc) {
        const RADIUS_OF_EARTH = 6371;
        var dLat = Math.abs(((itemLoc[0]-userLoc[0])*Math.PI)/180)
        var dLong = Math.abs(((itemLoc[1]-userLoc[1])*Math.PI)/180)

        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((itemLoc[0]*Math.PI)/180) * Math.cos((userLoc[0]*Math.PI)/180) * Math.sin(dLong / 2) * Math.sin(dLong / 2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
        var finalDist = RADIUS_OF_EARTH*c;
        return finalDist;
    }

    render() {
        const {search, value} = this.state
        return(
            <div className="home">
                <NavbarBuyer/>
                <ReactGoogleMapLoader
                    params={{
                    key: API_KEY,
                    libraries: "places,geocode",
                    }}
                    render={googleMaps =>
                    googleMaps && (
                        <div>
                            <ReactGooglePlacesSuggest
                                autocompletionRequest={{input: search}}
                                googleMaps={googleMaps}
                                onSelectSuggest={this.handleSelectSuggest.bind(this)}
                            >
                                <input
                                type="text"
                                value={value}
                                placeholder="Enter the Address"
                                onChange={this.handleInputChange.bind(this)}
                                className="inputLocation"
                                />
                                <button onClick={this.submitAddress} className='submit-button'>Save</button>
                            </ReactGooglePlacesSuggest>
                        </div>
                    )}
                />
                {this.state.items.length === 0? (<h3>There are no items around you</h3>):
                    (<Grid className="showItems" container spacing={16}>
                        {
                            this.state.items.map((item) => {
                            return (<Grid item xs={12} sm={4} key={Math.random()}>
                                            <div className="item">
                                                <img src={item.imageUrl} alt={item.nameOfItem} className="foodImage"/>
                                                <h2>{item.nameOfItem}</h2>
                                                <p>{item.price}</p>
                                                <button className='btn' data-param={JSON.stringify({
                                                    price: item.price,
                                                    item: item.nameOfItem,
                                                    sellerid: item.userid
                                                })} onClick={this.createOrder}>Order Now</button>
                                            </div>
                                        </Grid>)
                            })
                        }
                    </Grid>)
                }
            </div>
        );
    }
}

export default withRouter(Home);