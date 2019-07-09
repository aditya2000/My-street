import React, {Component} from 'react';
import firebase from '../../../firebaseConfig';
//import { NavLink } from 'react-router-dom';
import './navbarBuyer.css';

class NavbarBuyer extends Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
        this.state = {
            user: {}
        }
        this.db = firebase.firestore();
        this.db.settings({
            timestampsInSnapshots: true
        })
    }

    componentDidMount() {
        const db = this.db;
        const state = this.state;
        firebase.auth().onAuthStateChanged((user) => {
            if(user) {
                db.collection('users').where("userid", "==", firebase.auth().currentUser.uid)
                .get()
                .then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                       state.user = doc.data()
                    })
                })  
            } else {
                console.log('User not logged in!!')
            }
        })
    }

    logout() {
        firebase.auth().signOut();
    }

    render() {
        return(
            <div className='navbar'>
                <div className="nav-header">
                    <a href='/' className='logo'><h1>MyStreet</h1></a>
                </div>
                <div className="nav-links">
                    <a href='/' onClick={this.logout} className='options'>Logout</a>
                </div>
            </div>
        )
    }
}

export default NavbarBuyer;