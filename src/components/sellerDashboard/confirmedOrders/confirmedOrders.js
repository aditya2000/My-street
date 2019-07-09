import React, {Component} from 'react';
import firebase from '../../../firebaseConfig';
import Navbar from '../navbar/navbar';
import Grid from '@material-ui/core/Grid';
import './confirmedOrders.css';

class ConfirmedOrders extends Component {
    constructor(props) {
        super();
        this.getConfirmedOrders = this.getConfirmedOrders.bind(this)
        this.deliveredOrder = this.deliveredOrder.bind(this)
        this.rejectOrder = this.rejectOrder.bind(this)
        this.state = {
            confirmedOrders: [],
            loading: false
        }
        this.storage = firebase.storage();
        this.db = firebase.firestore();
        this.db.settings({
            timestampsInSnapshots: true
        })
    }

    componentDidMount() {
        this.setState({
            loading: true
        })
        this.getConfirmedOrders()
    }

    componentWillUnmount() {

    }

    getConfirmedOrders() {
        firebase.auth().onAuthStateChanged((user) => {
            if(user) {
                this.db.collection("orders").where("state", "==", "Confirmed").where("sellerid", "==", firebase.auth().currentUser.uid)
                .onSnapshot((querySnapshot) => {
                    this.setState({
                        confirmedOrders: []
                    })
                    querySnapshot.forEach((doc) => {
                        console.log(doc.data())
                        this.setState({
                            confirmedOrders: [doc.data()]
                        })
                    })
                })
            } else {
                console.log("User not logged in!!")
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
                this.getConfirmedOrders();
                console.log('Order Rejected!')
                console.log(this.state.confirmedOrders)
            } else {
                console.log('User not logged in!!')
            }
        })
        
    }

    deliveredOrder(e) {
        e.preventDefault();
        const { param } = e.target.dataset
        const paramData = JSON.parse(param)

        firebase.auth().onAuthStateChanged((user) => {
            if(user) {
                this.db.collection('orders').where("sellerid", "==", firebase.auth().currentUser.uid).where("time", "==", paramData.time)
                .onSnapshot((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        this.db.collection('orders').doc(doc.id).update({
                            state: "Delivered"
                        })  
                    })
                })
                // console.log('Order Delviered!')
                // console.log(this.state.confirmedOrders)
            } else {
                console.log('User not logged in!!')
            }
        })
    }
    
    render() {
        return(
            <div className='confirmedOrders'>
                <Navbar/>
                <h2>Confirmed Orders</h2>
                <Grid className="showItems" container spacing={16}>
                    {
                        this.state.confirmedOrders.map((orders) => {
                           return (
                                    <Grid item xs={4} key={Math.random()}>
                                        <div className="item">
                                            <p>{orders.itemName}</p>
                                            <p>{orders.price}</p>
                                            <button className="btn" data-param={JSON.stringify({
                                                time: orders.time
                                            })} onClick={this.deliveredOrder}>Delivered</button>
                                            <button className="btn" data-param={JSON.stringify({
                                                time: orders.time
                                            })} onClick={this.rejectOrder}>Reject</button>
                                        </div>
                                    </Grid>
                                )
                        })
                    }
                </Grid>
            </div>
        )
    }
}

export default ConfirmedOrders;