import React, { Component, useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./scss/style.scss";
import { messaging, subscribeTokenToTopic } from "./init-fcm";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
  CForm,
  CInput,
  CInputCheckbox,
  CButton,
  CContainer,
  CRow,
  CCol,
  CFormGroup,
  CLabel
} from '@coreui/react'
import ReactDOM from 'react-dom';
import Toaster from "./views/notifications/toaster/Toaster";
import { useDispatch, useSelector } from "react-redux";
// React Notification
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager}  from 'react-notifications';
import firebase from "firebase/app";
import "firebase/messaging";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

// Containers
const TheLayout = React.lazy(() => import("./containers/TheLayout"));

// Email App
const TheEmailApp = React.lazy(() => import("./views/apps/email/TheEmailApp"));

// Pages
const Login = React.lazy(() => import("./views/pages/login/Login"));
const Register = React.lazy(() => import("./views/pages/register/Register"));
const ResetPassword = React.lazy(() =>
  import("./views/pages/reset-password/ResetPassword")
);
const Page404 = React.lazy(() => import("./views/pages/page404/Page404"));
const Page500 = React.lazy(() => import("./views/pages/page500/Page500"));

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      toasters: { 'top-right': []}
    };
  }
  
  showNotification(message) {
    
    //console.log(message.data['firebase-messaging-msg-data']);
    /*message.data.map((item, key) => {
      console.log(item);
    });*/
    
    let toaster = [];
    toaster['top-right'] = [];
    console.log(message.data.data);
    if(message.data !== undefined && ("firebase-messaging-msg-data" in message.data || "data" in message.data)){
      let data = {};
      if("firebase-messaging-msg-data" in message.data){
        data = message.data['firebase-messaging-msg-data']['data'];
      }else{
        data = message.data.data;
      }
      console.log(data);
      const position = 'top-right';
      const closeButton = true;
      const fade = false;
      let headerColor = '';
      let bodyColor = '';
      let buttonColor = '';
      if(data.status === 'WARNING'){
        headerColor = 'toast-header-warning';
        bodyColor = 'notification-warning';
        buttonColor = "warning";
      }else if(data.status === 'OFF'){
        headerColor = 'toast-header-danger';
        bodyColor = 'notification-danger';
        buttonColor = "danger";
      }
      let str = "";
      if(data.location !== ""){
        str += "<b>สถานที่</b>: " + data.location + "<br/>"; 
      }
      if(data.note !== ""){
        str += "<b>Note</b>: " + data.note + "<br/>"; 
      }
      if(data.timeToHang !== ""){
        str += "<b>วันเวลาที่ได้รับแจ้ง</b>: " + data.timeToHang + "<br/>"; 
      }
      /*if(data.coordinate !== ""){
        str += "พิกัด: " + `<a href=${data.coordinate}>${data.coordinate}</a><br/>`; 
      }*/
      var joined = this.state.toasters['top-right'].concat({ position, autohide: false, closeButton, fade, title: data.topic, body: str, headerColor, bodyColor, buttonColor });
      this.setState({
        toasters: { 'top-right': joined}
        
      })
      console.log(this.state.toasters);
      //this.setState({toasters: toasters});
    }
    
    
    //return toasters;
    //setToasters({toasters: toasters})
    
    //console.log(this.state);
    //let toasters = {toasters: toasters};
    /*return Object.keys(toasters).map((toasterKey) => (
      <CToaster
        position={toasterKey}
        key={'toaster' + toasterKey}
      >
        {
          toasters[toasterKey].map((toast, key)=>{
          return(
            <CToast
              key={'toast' + key}
              show={true}
              autohide={toast.autohide}
              fade={toast.fade}
            >
              <CToastHeader closeButton={toast.closeButton}>
                Toast title
              </CToastHeader>
              <CToastBody>
                {`This is a toast in ${toasterKey} positioned toaster number ${key + 1}.`}
              </CToastBody>
            </CToast>
          )
        })
        }
      </CToaster>
      ))*/
    
      
  }

  async componentDidMount() {
    if(messaging !== null){
      try{
        await messaging.requestPermission();
        const token = await messaging.getToken();
        await subscribeTokenToTopic(token, `overpass-${this.props.store.getState().authen.overpassGroup}`);
      } catch (error) {
        console.error(error);
        //console.log("Unable to get permission to notify.", err);
      }

      navigator.serviceWorker.addEventListener("message", (message) => {
        this.showNotification(message);
      });
    }
  }

  render() {
    return <>
      <Router key="route">
        <React.Suspense fallback={loading}>
          <Switch>
            <Route
              exact
              path="/login"
              name="Login Page"
              render={(props) => <Login {...props} />}
            />
            <Route
              exact
              path="/register"
              name="Register Page"
              render={(props) => <Register {...props} />}
            />
            <Route
              exact
              path="/reset-password"
              name="Reset Password Page"
              render={(props) => <ResetPassword {...props} />}
            />
            <Route
              exact
              path="/404"
              name="Page 404"
              render={(props) => <Page404 {...props} />}
            />
            <Route
              exact
              path="/500"
              name="Page 500"
              render={(props) => <Page500 {...props} />}
            />
            <Route
              path="/apps/email"
              name="Email App"
              render={(props) => <TheEmailApp {...props} />}
            />
            <Route
              path="/"
              name="Home"
              render={(props) => <TheLayout {...props} />}
            />
            <NotificationContainer />
          </Switch>
        </React.Suspense>
      </Router>
      
      {
        Object.keys(this.state.toasters).map((toasterKey) => (
        <CToaster
          position={toasterKey}
          key={'toaster' + toasterKey}
        >
          {
            this.state.toasters[toasterKey].map((toast, key)=>{
            return(
              <CToast
                key={'toast' + key}
                show={true}
                autohide={toast.autohide}
                fade={toast.fade}
              >
                 <CToastHeader closeButton={toast.closeButton} className={toast.headerColor}>
                <b>{toast.title}</b>
                </CToastHeader>
                <CToastBody className={toast.bodyColor}>
                  <div dangerouslySetInnerHTML={{__html: toast.body}} />
                    <br/>
                    <CButton block color={toast.buttonColor}>Open in browser</CButton>
                </CToastBody>
              </CToast>
            )
          })
          }
        </CToaster>
        ))}
      </>
  }
}

export default App;
