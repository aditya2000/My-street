import React, {Component} from 'react';
import firebase from '../../../firebaseConfig';
import NavbarBuyer from '../navbarBuyer/navbarBuyer';
import './createOrder.css';

class CreateOrder extends Component {
    _ismounted = false;
    constructor(props) {
        super(props);
        this.state = {
            quantity: 0,
        }
        this.changeQuantity = this.changeQuantity.bind(this)
        this.createFinalOrder = this.createFinalOrder.bind(this)

        this.db = firebase.firestore();
        this.db.settings({
            timestampsInSnapshots: true
        })
    }

    componentDidMount() {
        this._ismounted = true;
    }

    componentWillUnmount() {
        this._ismounted =false;
    }

    changeQuantity(e) {
        const { param } = e.target.dataset
        const paramData = JSON.parse(param)

        if(paramData.operator === '+') {
           this.setState(previousState => ({
               quantity: previousState.quantity+1
           }))
        } else {
            if(this.state.quantity > 0) {
                this.setState(previousState => ({
                    quantity: previousState.quantity-1
                }))  
            }
        }
    }

    createFinalOrder(e) {
        e.preventDefault();
        const d = new Date();
        const db = this.db;
        const quantity = this.state.quantity;
        const locState = this.props.location.state;

        db.collection("orders").add({
            sellerid: locState.sellerid,
            userid: firebase.auth().currentUser.uid,
            price: locState.price*quantity,
            itemName: locState.itemName,
            time: d.getTime(),
            quantity: quantity,
            state: "Pending"
        }).then(() => console.log("Order Created")).catch(error => console.log(error))
    }

    render() {
        return(
            <div className="createOrder">
                <NavbarBuyer/>
                <h2>Your Order</h2>
                <h3>
                    {this.props.location.state.itemName}
                </h3>
                <p>
                    {this.props.location.state.price}
                </p>
                <button onClick={this.changeQuantity} data-param={JSON.stringify({operator: '-'})} className="minusBtn">-</button>
                <input value={this.state.quantity} className="inputQty" readOnly></input>
                <button onClick={this.changeQuantity} data-param={JSON.stringify({operator: '+'})} className="plusBtn">+</button>
                <div>
                    <button onClick={this.createFinalOrder} className="btn">Bring it to me</button>
                </div>
            </div>
        )
    }
}

export default CreateOrder;