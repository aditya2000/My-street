import React, {Component} from 'react';
import firebase from '../../firebaseConfig';
import './sellerSignup.css';

class SellerSignup extends Component {
    constructor(props) {
        super(props);
        this.signUp = this.signUp.bind(this); // binding the methods
        this.handleChange = this.handleChange.bind(this); // binding the methods
        this.state = {
            type: 'seller',
            name: '',
            openingName: '',
            phone: '',
            email: '',
            password: '',
            delivery: '',
            deliveryDistance:'', 
            city: ''
        }
        this.db = firebase.firestore();
        this.db.settings({
            timestampsInSnapshots: true
        })
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    
    signUp(e) {
        e.preventDefault();
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then(u => {
            this.db.collection("users").add({
                userid: firebase.auth().currentUser.uid,
                type: this.state.type,
                name: this.state.name,
                openingName: this.state.openingName,
                phone: this.state.phone,
                delivery: this.state.delivery,
                deliveryDistance: this.state.deliveryDistance,
                city: this.state.city,
                address: '',
                latitude: null,
                longitude: null
            });
        }).catch( error => {
            alert(error);
        })

    }
    render() {
        return(
            <div className="sellerSignup">
                <h1>SignUp-Seller</h1>
                <form>
                    <div className="form-group">
                        <input value={this.state.name} onChange={this.handleChange} type="text" name="name" className="form-control" id="inputName" placeholder="Name"/>
                    </div>
                    <div className="form-group">
                        <input value={this.state.opningName} onChange={this.handleChange} type="text" name="openingName" className="form-control" id="inputOpeningName" placeholder="Opening Name"/>
                    </div>
                    <div className="form-group">
                        <input value={this.state.phone} onChange={this.handleChange} type="text" name="phone" className="form-control" id="inputPhone" placeholder="Phone"/>
                    </div>
                    <div className="form-group">
                        <input value={this.state.email} onChange={this.handleChange} type="email" name="email" className="form-control" id="inputEmail" placeholder="Email"/>
                    </div>
                    <div className="form-group">
                        <input value={this.state.password} onChange={this.handleChange} type="password" name="password" className="form-control" id="inputPassword" placeholder="Password"/>
                    </div>
                    <div className="form-choice">
                        <label>
                            Can you offer the delivery service?
                            <select value={this.state.delivery} onChange={this.handleChange} name="delivery">
                                <option value="">Choose one</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>
                        </label>
                    </div>
                    <div className="form-distance">
                        <label for="inputDeliveryDistance">
                            If yes? then tell us the distance in which you can deliver:
                            <input value={this.state.deliveryDistance} onChange={this.handleChange} type="text" name="deliveryDistance" className="form-control" id="inputDeliveryDistance" placeholder="Enter the distance"/>
                        </label>
                    </div>
                    <div className="form-choice">
                        <label for="city">
                            Please Enter Your City:
                            <select value={this.state.city} onChange={this.handleChange} name="city">
                                <option value="">Choose one</option>
                                <option value="Delhi">Delhi</option>
                                <option value="Mumbai">Mumbai</option>
                            </select>
                        </label>
                    </div>
                    <button type="submit" onClick={this.signUp} class="btn btn-primary">SignUp</button>
                </form>
                
            </div>
        );
    }
}

export default SellerSignup;