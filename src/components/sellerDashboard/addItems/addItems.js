import React, {Component} from 'react';
import firebase from '../../../firebaseConfig';
import Navbar from '../navbar/navbar';
import { withRouter } from 'react-router';
import './addItems.css';

class AddItems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nameOfItem: '',
            price: '',
            image: ''
        }
        this.handleChange = this.handleChange.bind(this)
        this.addItem = this.addItem.bind(this)

        this.storage = firebase.storage();
        this.db = firebase.firestore();
        this.db.settings({
            timestampsInSnapshots: true
        })
    }

    handleChange(e) {
        if(e.target.files){
            this.setState({
                image: e.target.files[0]
            })
        } else{
            this.setState({ [e.target.name]: e.target.value });
        }
    }

    addItem(e) {
        e.preventDefault();
        const d = new Date();
        this.storage.ref().child(`items_image/${new Date().getTime()}`).put(this.state.image).then((snapshot) => {
            snapshot.ref.getDownloadURL().then((downloadUrl) => {
                this.db.collection("users").where("userid", "==", firebase.auth().currentUser.uid)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        this.db.collection("items").add({
                            userid: firebase.auth().currentUser.uid,
                            userCity: doc.data().city,
                            nameOfItem: this.state.nameOfItem,
                            price: this.state.price,
                            imageUrl: downloadUrl,
                            time: d.getTime(),
                            latitude: doc.data().latitude,
                            longitude: doc.data().longitude
                        });
                    })
                })
            })
        })
        this.props.history.push('/sellerDashboard')
    }

    render() {
        return(
            <div className='addItems'>
                <Navbar/>
                <div className='newItem'>
                <h2>Add New Items</h2>  
                    <form>
                        <div className='form-group'>
                            <input value={this.state.nameOfItem} onChange={this.handleChange} type="text" name="nameOfItem" className="form-control" placeholder="Name of item"/>
                            <input value={this.state.price} onChange={this.handleChange} type="text" name="price" className="form-control" placeholder="Price"/>
                        </div>
                        <div className='form-group'>
                            <label for='file' className='file-input-label'>Choose an Image</label>
                            <input onChange={this.handleChange} type="file" name="file" id='file' className="form-control file-input" placeholder="Upload Image"/>
                        </div>
                        <button type="submit" onClick={this.addItem} className="btn btn-primary">Add</button>
                    </form>    
                </div>
            </div>
        )
    }
}

export default withRouter(AddItems);