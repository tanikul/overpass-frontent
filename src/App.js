import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import "./scss/style.scss";
import {
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
  CButton,
} from '@coreui/react'
// React Notification
import 'react-notifications/lib/notifications.css';
import "firebase/messaging";
import { messaging, subscribeTokenToTopic } from "./init-fcm";

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
      //toasters: { 'top-right': [{ position: 'top-right', autohide: false, closeButton: true, fade: false, title: "data.topic", body: "str", headerColor: "danger", bodyColor: "danger", buttonColor: "danger", id: 74055 }]}
    };
  }
  
  showNotification(message) {
    
    //console.log(message.data['firebase-messaging-msg-data']);
    /*message.data.map((item, key) => {
      console.log(item);
    });*/
    
    let toaster = [];
    toaster['top-right'] = [];
    if(message.data !== undefined && ("firebase-messaging-msg-data" in message.data || "data" in message.data)){
      let data = {};
      if("firebase-messaging-msg-data" in message.data){
        data = message.data['firebase-messaging-msg-data']['data'];
      }else{
        data = message.data.data;
      }
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
      }else if(data.status === 'ON'){
        headerColor = 'toast-header-info';
        bodyColor = 'notification-info';
        buttonColor = "success";
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
      var joined = this.state.toasters['top-right'].concat({ position, autohide: false, closeButton, fade, title: data.topic, body: str, headerColor, bodyColor, buttonColor, id: data.id });
      this.setState({
        toasters: { 'top-right': joined }
        
      })
    }  
  }

  openInBrowser(e, id) {
    var array = this.state.toasters['top-right']; 
    array.splice(e, 1);  
    let toaster = [];
    toaster['top-right'] = [];
    this.setState({toaster: array});
    
    const str = `/repairs/${id}`
    window.open(str, "_blank")
  }
  async componentDidMount() {
    if(messaging !== null && this.props.store.getState().authen.overpassGroup !== undefined){
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
                path="/"
                render={() => {
                    return (
                      this.props.store.getState().authen.isAuth ?
                      <Redirect to="/dashboard" /> :
                      <Redirect to="/login" /> 
                    )
                }}
              />
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
                    <CButton block color={toast.buttonColor} onClick={(e) => this.openInBrowser(key, toast.id)}>Open in browser</CButton>
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
