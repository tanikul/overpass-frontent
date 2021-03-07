import React, { lazy, useEffect, useState } from "react";
import {
  CBadge,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CCallout,
  CWidgetProgress,
  CWidgetIcon,
  CWidgetProgressIcon,
  CWidgetSimple,
  CNav,
  CNavItem,
  CNavLink,
  CTabs,
  CTabContent,
  CTabPane,
  CFormGroup,
  CLabel,
  CInput,
  CFormText,
  CLink,
  CListGroupItem,
  CListGroup,
} from "@coreui/react";
import {
  CChartBar,
  CChartLine,
  CChartDoughnut,
  CChartRadar,
  CChartPie,
  CChartPolarArea,

} from '@coreui/react-chartjs'
import CIcon from "@coreui/icons-react";
import { DocsLink } from 'src/reusable'
import MainChartExample from "../charts/MainChartExample.js";
import socketIOClient from 'socket.io-client'
import { useDispatch, useSelector } from "react-redux";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const DeviceStatus = lazy(() => import("../../reusable/DeviceStatus"));
const WidgetsDropdown = lazy(() => import("../widgets/WidgetsDropdown.js"));
const WidgetsBrand = lazy(() => import("../widgets/WidgetsBrand.js"));

const Dashboard = () => {

  const accessToken = useSelector((state) => state.authen.access_token);
  const [overpassAll, setOverpassAll] = useState(0);
  const [overpassByZone, setOverpassByZone] = useState(0);
  const [overpassOnByMonth, setOverpassOnByMonth] = useState({});
  const [overpassOffByMonth, setOverpassOffByMonth] = useState({});
  const [overpassOn, setOverpassOn] = useState(0);
  const [overpassOff, setOverpassOff] = useState(0);


  const send = () => {
    
    const input = '';
    const socket = socketIOClient(`http://localhost:5001`, {
      path: '/zengcode-websocket',
      origins: '*:*',
      // transports: ['polling'],
      transportOptions: {
        polling: {
            extraHeaders: {
              'Authorization': `Bearer ${accessToken}`,
            }
        }
        }
    })
    socket.emit('sent-message', input)
  }
  const getData = foodItems => {
    console.log(foodItems);
  };

  // รอรับข้อมูลเมื่อ server มีการ update
  const response = () => {
    const endpoint = "http://localhost:5001/topic/greetings";
    const message = [];
    const temp = message
    const socket = socketIOClient(`http://localhost:5001`, {
      path: '/topic/greetings',
      origins: '*:*',
      // transports: ['polling'],
      transportOptions: {
        polling: {
            extraHeaders: {
              'Authorization': `Bearer ${accessToken}`,
            }
        }
        }
    })
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
    socket.on("FromAPI", getData);
   /* socket.on('get_data', (messageNew) => {
      //temp.push(messageNew);
      console.log(messageNew);
    })*/
  }
  useEffect(() => {
    /*var thisheaders={
      'Authorization': `Bearer ${accessToken}`,
      
  };
    var sock = new SockJS('http://localhost:5001/websocket');
    let stompClient = Stomp.over(sock);
    sock.onopen = function() {
      console.log('open');
    }
    
    stompClient.connect(thisheaders, function (frame) {
      console.log('Connected: ' + frame);
      stompClient.subscribe('/topic/greetings', function (greeting) {
        console.log(greeting);
        //you can execute any function here
      });
    });*/
  });

  return (
    <>
      <h3 className="mb-4">Device Activity</h3>
      <CRow>
        <CCol xs="3" sm="3" md="3">
          <CCard>
            <CCardBody>
              <center><h1>1</h1></center>
              <center className="text-warning">เขตพื้นที่ติดตั้งอุปกรณ์</center>
            </CCardBody>
            <CCardFooter className="bg-warning text-white">
              <center>10 มกราคม 2564 11:47</center>
            </CCardFooter>
          </CCard>
        </CCol>
        <CCol xs="3" sm="3" md="3">
          <CCard>
            <CCardBody>
              <center><h1>1</h1></center>
              <center className="text-info">รวมอุปกรณ์ไฟฟ้าทั้งหมด</center>
            </CCardBody>
            <CCardFooter className="bg-warning text-white">
              <center>10 มกราคม 2564 11:47</center>
            </CCardFooter>
          </CCard>
        </CCol>
        <CCol xs="3" sm="3" md="3">
          <CCard>
            <CCardBody>
              <center><h1>1</h1></center>
              <center className="text-success">อุปกรณ์หลอดไฟฟ้าติด</center>
            </CCardBody>
            <CCardFooter className="bg-warning text-white">
              <center>10 มกราคม 2564 11:47</center>
            </CCardFooter>
          </CCard>
        </CCol>
        <CCol xs="3" sm="3" md="3">
          <CCard>
            <CCardBody>
              <center><h1>1</h1></center>
              <center className="text-danger">อุปกรณ์หลอดไฟฟ้าดับ</center>
            </CCardBody>
            <CCardFooter className="bg-secondary text-white">
              <center>10 มกราคม 2564 11:47</center>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
      <CCol xs="12" sm="12" md="12">
        <CCard>
          <CCardBody>
              <CCard>
                <CCardHeader>
                  Navs
                  <small> tabs</small>
                </CCardHeader>
                <CCardBody>
                <CTabs activeTab="home">
                <CNav variant="tabs">
                  <CNavItem>
                    <CNavLink data-tab="home">
                      ปริมาณข้อมูลรายเดือน
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink data-tab="profile" className={"text-mute"}>
                      อัตราอุปกรณ์ไฟฟ้าติด-ดับ
                    </CNavLink>
                  </CNavItem>
                </CNav>
                <CTabContent>
                  <CTabPane data-tab="home">
                    <CRow>
                  <CCol xs="8" sm="8" md="8">
                  <CChartBar
                    datasets={[
                      {
                        label: 'อุปกรณ์ไฟฟ้าติด',
                        backgroundColor: '#f87979',
                        data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11]
                      },
                      {
                        label: 'อุปกรณ์ไฟฟ้าดับ',
                        backgroundColor: '#f87979',
                        data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11]
                      }
                    ]}
                    labels="months"
                    options={{
                      tooltips: {
                        enabled: true
                      }
                    }}
                  />
                  </CCol>
                  <CCol xs="4" sm="4" md="4">
                  <CListGroup>
                    <CListGroupItem><b className={"float-left"}>Top Referrals</b><b className="float-right"><CLink href="https://coreui.io"
                              target="_blank"
                            >View Report</CLink></b></CListGroupItem>
                    <CListGroupItem>
                      <span className="float-left">หัวเรื่อง/แหล่งที่มา</span>
                      <span className="float-right">จำนวน</span>
                    </CListGroupItem>
                    <CListGroupItem>
                      <span className="float-left">อุปกรณ์ไฟฟ้าติดสูงสุด</span>
                      <span className="float-right">2 จุด</span>
                    </CListGroupItem>
                    <CListGroupItem>
                      <span className="float-left">อุปกรณ์ไฟฟ้าดับสูงสุด</span>
                      <span className="float-right">2 จุด</span>
                    </CListGroupItem>
                    <CListGroupItem>
                      <span className="float-left">อุปกรณ์ไฟฟ้าเสียร้อยละ</span>
                      <span className="float-right">2 จุด</span>
                    </CListGroupItem>
                    <CListGroupItem>
                      <span className="float-left">แจ้งเตือนข้อมูลสะสม</span>
                      <span className="float-right">จำนวน</span>
                    </CListGroupItem>
                  </CListGroup>
                  
                    
          </CCol>
          </CRow>
                  </CTabPane>
                  <CTabPane data-tab="profile">
                    456
                  </CTabPane>
                </CTabContent>
              </CTabs>
                  
                </CCardBody>
              </CCard>
            
          </CCardBody>
          
        </CCard>
        </CCol>
      </CRow> 
    </>
  );
};

export default Dashboard;
