import React, { Component } from 'react';
import firebase from './firebaseConfig';
import './App.css';
import Home from './components/home/home';
import SellerDashboard from './components/sellerDashboard/sellerDashboard';
import LandingPage from './components/landingPage/landingPage';
import SellerLogin from './components/sellerLogin/sellerLogin';
import SellerSignup from './components/sellerSignup/sellerSignup';
import BuyerLogin from './components/buyerLogin/buyerLogin';
import BuyerSignup from './components/buyerSignup/buyerSignup';
import InvalidUrl from './components/invalidUrl/invalidUrl';
import ConfirmedOrders from './components/sellerDashboard/confirmedOrders/confirmedOrders';
import AddItems from './components/sellerDashboard/addItems/addItems';
import CreateOrder from './components/home/createOrder/createOrder';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      userType: '',
    }

    this.db = firebase.firestore();
    this.db.settings({
      timestampsInSnapshots: true
  })
  }
  componentDidMount() {
    this.authListener();
  }

  authListener() {
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.db.collection("users").where("userid", "==", firebase.auth().currentUser.uid)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.setState({
              userType: doc.data().type
            })
          })
        }).catch((error) => console.log(error));
        this.setState({user});
      } else {
        this.setState({user: null});
      }
    })
  }
  render() {
    return (
      <BrowserRouter>
      <div>
        <div>
          {this.state.user ? (this.state.userType === "buyer"? <Redirect to="/home"/>: <Redirect to="/sellerDashboard"/>): (<Redirect to="/landingPage"/>)}
        </div>

        <Switch>
          <Route path="/home" component={Home} exact/> 
          <Route path="/sellerDashboard" component={SellerDashboard} exact/> 
          <Route path="/landingPage" component={LandingPage} exact/>
          <Route path="/seller" component={SellerLogin} exact/>
          <Route path="/buyer" component={BuyerLogin} exact/>
          <Route path="/buyer-signup" component={BuyerSignup} exact/>
          <Route path="/seller-signup" component={SellerSignup} exact/>
          <Route path="/confirmedOrders" component={ConfirmedOrders} exact/>
          <Route path="/addItems" component={AddItems} exact/>
          <Route path="/createOrder" component={CreateOrder} exact/>
          <Route component={InvalidUrl}/>
        </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
