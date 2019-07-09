import React, {Component} from 'react';
import firebase from '../../firebaseConfig';
import { NavLink } from 'react-router-dom';
import './buyerLogin.css';

class BuyerLogin extends Component {
    constructor(props) {
        super(props);
        this.login = this.login.bind(this); // binding the methods
        this.handleChange = this.handleChange.bind(this); // binding the methods
        this.state = {
            email: '',
            password: '',
            loginError: '',
        }
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    
    login(e) {
        e.preventDefault();
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(u => {

        }).catch( error => {
            this.setState({
                loginError: error.toString().replace(/Error:/, '')
            })
        })
    }
    render() {
        return(
            <div class='buyerLogin-parent'>
                <div className="buyerLogin">
                    <h1>Welcome back</h1>
                    <p className="loginError">{this.state.loginError}</p>
                    <form className='form'>
                        <div className="form-group">
                            <input value={this.state.email} onChange={this.handleChange} type="email" name="email" className="form-control" id="inputEmail" placeholder="Email"/>
                        </div>
                        <div className="form-group">
                            <input value={this.state.password} onChange={this.handleChange} type="password" name="password" className="form-control" id="inputPassword" placeholder="Password"/>
                        </div>
                        <button type="submit" onClick={this.login} className="btn">Login</button>
                    </form>
                    <p className='rawtext'>New Member? <NavLink to="/buyer-signup">Create New Account</NavLink></p>
                </div>
            </div>
        );
    }
}

export default BuyerLogin;