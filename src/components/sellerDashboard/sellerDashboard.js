import React, {Component} from 'react';
import firebase from '../../firebaseConfig';
import ReactGoogleMapLoader from 'react-google-maps-loader';
import ReactGooglePlacesSuggest from 'react-google-places-suggest';
import Grid from '@material-ui/core/Grid';
import Navbar from '../sellerDashboard/navbar/navbar';
import './sellerDashboard.css';

const API_KEY = 'AIzaSyCToLsEKMFp9LSUpgp4aiM2qbo7yXOwkr8'

class SellerDashboard extends Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
        // this.handleChange = this.handleChange.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleSelectSuggest = this.handleSelectSuggest.bind(this)
        this.submitAddress = this.submitAddress.bind(this)
        // this.addItem = this.addItem.bind(this)
        this.getItems = this.getItems.bind(this)
        this.deleteItems = this.deleteItems.bind(this)
        this.getPendingOrders = this.getPendingOrders.bind(this)
        this.confirmOrder = this.confirmOrder.bind(this)
        this.rejectOrder = this.rejectOrder.bind(this)
        this.updateLocation = this.updateLocation.bind(this)
        this.state = {
            search: '',
            value: '',
            nameOfItem: '',
            price: '',
            items: [],
            orders: [],
            loading: false,
            image: ''
        }
        this.storage = firebase.storage();
        this.db = firebase.firestore();
        this.db.settings({
            timestampsInSnapshots: true
        })
    }   

    componentDidMount(){
        this.setState({
            loading: true
        })
        this.getItems()
        this.getPendingOrders()

        navigator.geolocation.watchPosition((position) => {
            this.setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }, ()=> {this.updateLocation()})}
        );
    }

    componentWillUnmount() {
        //this.unsubscribe();
    }

    // handleChange(e) {
    //     if(e.target.files){
    //         this.setState({
    //             image: e.target.files[0]
    //         })
    //     } else{
    //         this.setState({ [e.target.name]: e.target.value });
    //     }
    // }

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

    logout() {
        firebase.auth().signOut();
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

    // addItem(e) {
    //     e.preventDefault();
    //     const d = new Date();
    //     this.storage.ref().child(`items_image/${new Date().getTime()}`).put(this.state.image).then((snapshot) => {
    //         snapshot.ref.getDownloadURL().then((downloadUrl) => {
    //             this.db.collection("items").add({
    //                 userid: firebase.auth().currentUser.uid,
    //                 nameOfItem: this.state.nameOfItem,
    //                 price: this.state.price,
    //                 imageUrl: downloadUrl,
    //                 time: d.getTime(),
    //             });
    //         })
    //     })
    // }

    getItems() {
        firebase.auth().onAuthStateChanged((user) => {
            if(user) {
                this.unsubscribe = this.db.collection('items').where("userid", "==", firebase.auth().currentUser.uid)
                .onSnapshot((querySnapshot) => {
                    this.setState({
                        items: []
                    })
                    querySnapshot.forEach((doc) => {
                        this.setState(previousState => ({
                            items: [...previousState.items, doc.data()]
                        }))
                    })
                })
            } else {
                console.log('User not logged in!!')
            }
        })
    }
    deleteItems(e) {
        const { param } = e.target.dataset
        const paramData = JSON.parse(param)

        firebase.auth().onAuthStateChanged((user) => {
            if(user) {
                this.unsubscribe = this.db.collection('items').where("userid", "==", firebase.auth().currentUser.uid).where("time", "==", paramData.time)
                .onSnapshot((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        this.db.collection('items').doc(doc.id).delete().then(() => {
                            console.log('Item Deleted Successfully!')
                        }).catch((error) => {
                            console.log(error)
                        })
                    })
                })
            } else {
                console.log('User not logged in!!')
            }
        })
    }
    
    getPendingOrders() {
        firebase.auth().onAuthStateChanged((user) => {
            if(user) {
                this.db.collection("orders").where("state", "==", "Pending").where("sellerid", "==", firebase.auth().currentUser.uid)
                .onSnapshot((querySnapshot) => {
                    this.setState({
                        orders: []
                    })
                    querySnapshot.forEach((doc) => {
                        this.setState(previousState => ({
                            orders: [...previousState.orders, doc.data()]
                        }))
                    })
                })
                console.log(this.state.orders)
            } else {
                console.log("User not logged in!!")
            }
        })
    }

    confirmOrder(e) {
        e.preventDefault();
        const { param } = e.target.dataset
        const paramData = JSON.parse(param)

        firebase.auth().onAuthStateChanged((user) => {
            if(user) {
                this.db.collection('orders').where("sellerid", "==", firebase.auth().currentUser.uid).where("time", "==", paramData.time)
                .onSnapshot((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        this.db.collection('orders').doc(doc.id).update({
                            state: "Confirmed"
                        })
                    })
                })
                // this.getConfirmedOrders();
                // console.log("Order Confirmed!")
                // console.log(this.state.confirmedOrders)
            } else {
                console.log('User not logged in!!')
            }
        })
    }

    rejectOrder(e) {
        e.preventDefault();
        const { param } = e.target.dataset
        const paramData = JSON.parse(param)

        firebase.auth().onAuthStateChanged((user) => {
            if(user) {
                this.db.collection('orders').where("sellerid", "==", firebase.auth().currentUser.uid).where("time", "==", paramData.time)
                .onSnapshot((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        this.db.collection('orders').doc(doc.id).update({
                            state: "Rejected"
                        })
                    })
                })
                // this.getConfirmedOrders();
                // console.log('Order Rejected!')
                // console.log(this.state.confirmedOrders)
            } else {
                console.log('User not logged in!!')
            }
        })
        
    }

    updateLocation() {
        const db = this.db;
        const state = this.state;

        firebase.auth().onAuthStateChanged((user) => {
            if(user) {
                db.collection('users').where("userid", "==", firebase.auth().currentUser.uid)
                .onSnapshot(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        db.collection('users').doc(doc.id).update({
                            latitude: state.latitude,
                            longitude: state.longitude
                        })
                    })
                })

                db.collection('items').where("userid", "==", firebase.auth().currentUser.uid)
                .onSnapshot(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        db.collection('items').doc(doc.id).update({
                            latitude: state.latitude,
                            longitude: state.longitude
                        })
                    })
                })
            }
        })
    }

    render() {
        const {search, value} = this.state
        return(
            <div className="dashboard">
                <Navbar/>
                <ReactGoogleMapLoader
                    params={{
                    key: API_KEY,
                    libraries: "places,geocode",
                    }}
                    render={googleMaps =>
                    googleMaps && (
                        <div className='inputLocationDiv'>
                            <ReactGooglePlacesSuggest
                                autocompletionRequest={{input: search}}
                                googleMaps={googleMaps}
                                onSelectSuggest={this.handleSelectSuggest.bind(this)}
                            >
                                <input
                                type="text"
                                value={value}
                                placeholder="Enter your location"
                                onChange={this.handleInputChange.bind(this)}
                                className="inputLocation"
                                />
                                <button onClick={this.submitAddress} className='submit-button'>Save</button>
                            </ReactGooglePlacesSuggest>
                        </div>
                    )}
                />
                <h2>Your Items</h2>
                <Grid className="showItems" container spacing={16}>
                    {
                        this.state.items.map((item) => {
                           return (
                                    <Grid item xs={12} sm={4} key={item.time}>
                                        <div className="item">
                                            <img src={item.imageUrl} alt={item.nameOfItem} className="foodImage"/>
                                            <h2>{item.nameOfItem}</h2>
                                            <p>{item.price}</p>
                                            <button className='btn' data-param={JSON.stringify({
                                                time: item.time
                                            })} onClick={this.deleteItems}>Delete</button>
                                        </div>
                                    </Grid>
                                )
                        })
                    }
                </Grid>
                <h2>Pending Orders</h2>
                {this.state.orders.length === 0?(<h3>You have no orders so far</h3>):
                    (<Grid className="showItems" container spacing={16}>
                    {
                        this.state.orders.map((orders) => {
                           return (
                                    <Grid item xs={12} sm={4} key={Math.random()}>
                                        <div className="item">
                                            <p>{orders.itemName}</p>
                                            <p>{orders.price}</p>
                                            <button className="btn" data-param={JSON.stringify({
                                                time: orders.time
                                            })} onClick={this.confirmOrder}>Confirm</button>
                                            <button className="btn" data-param={JSON.stringify({
                                                time: orders.time
                                            })} onClick={this.rejectOrder}>Reject</button>
                                        </div>
                                    </Grid>
                                )
                        })
                    }
                </Grid>)
                }
            </div>
        );
    }
}

export default SellerDashboard;