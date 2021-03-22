import React, { lazy, useEffect, useState } from "react";
import Moment from "react-moment";
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
} from "@coreui/react-chartjs";
import CIcon from "@coreui/icons-react";
import { DocsLink } from "src/reusable";
import MainChartExample from "../charts/MainChartExample.js";
import socketIOClient from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { LOCALE, PROD_API_URL } from "../../config";
import {
  getDataOverpass,
  send
} from "src/services/DashboardService";

const DeviceStatus = lazy(() => import("../../reusable/DeviceStatus"));
const WidgetsDropdown = lazy(() => import("../widgets/WidgetsDropdown.js"));
const WidgetsBrand = lazy(() => import("../widgets/WidgetsBrand.js"));

const Dashboard = () => {
  const accessToken = useSelector((state) => state.authen.access_token);
  const overpassGroup = useSelector((state) => state.authen.overpassGroup);
  const [overpassData, setOverpassData] = useState({});
  const [graph, setGraph] = useState([]);
  
  const genDataSets = (body) => {
    let data = [];
    let chk = graph.length === 0 ? true : false;
    if (body !== []) {
      data[0] =
        body.overpassOffByMonth.Jan === null ? 0 : body.overpassOffByMonth.Jan;
      data[1] =
        body.overpassOffByMonth.Feb === null ? 0 : body.overpassOffByMonth.Feb;
      data[2] =
        body.overpassOffByMonth.Mar === null ? 0 : body.overpassOffByMonth.Mar;
      data[3] =
        body.overpassOffByMonth.Apr === null ? 0 : body.overpassOffByMonth.Apr;
      data[4] =
        body.overpassOffByMonth.May === null ? 0 : body.overpassOffByMonth.May;
      data[5] =
        body.overpassOffByMonth.Jan === null ? 0 : body.overpassOffByMonth.Jun;
      data[6] =
        body.overpassOffByMonth.Jul === null ? 0 : body.overpassOffByMonth.Jul;
      data[7] =
        body.overpassOffByMonth.Aug === null ? 0 : body.overpassOffByMonth.Aug;
      data[8] =
        body.overpassOffByMonth.Sep === null ? 0 : body.overpassOffByMonth.Sep;
      data[9] =
        body.overpassOffByMonth.Oct === null ? 0 : body.overpassOffByMonth.Oct;
      data[10] =
        body.overpassOffByMonth.Nov === null ? 0 : body.overpassOffByMonth.Nov;
      data[11] =
        body.overpassOffByMonth.Dec === null ? 0 : body.overpassOffByMonth.Dec;
      if (graph.length > 0) {
        console.log('xxx');
        console.log(data);
        data.forEach((item, i) => {
          console.log(graph);
          if (item !== graph.graphOff.data[i]) {
            chk = true;
          }
        });
      }
    }
    const graphOff = {
      label: "อุปกรณ์ไฟฟ้าดับ",
      backgroundColor: "#e55353",
      data: data,
      name: "graphOff",
    };

    data = [];
    if (body !== []) {
      data[0] =
        body.overpassOnByMonth.Jan === null ? 0 : body.overpassOnByMonth.Jan;
      data[1] =
        body.overpassOnByMonth.Feb === null ? 0 : body.overpassOnByMonth.Feb;
      data[2] =
        body.overpassOnByMonth.Mar === null ? 0 : body.overpassOnByMonth.Mar;
      data[3] =
        body.overpassOnByMonth.Apr === null ? 0 : body.overpassOnByMonth.Apr;
      data[4] =
        body.overpassOnByMonth.May === null ? 0 : body.overpassOnByMonth.May;
      data[5] =
        body.overpassOnByMonth.Jan === null ? 0 : body.overpassOnByMonth.Jun;
      data[6] =
        body.overpassOnByMonth.Jul === null ? 0 : body.overpassOnByMonth.Jul;
      data[7] =
        body.overpassOnByMonth.Aug === null ? 0 : body.overpassOnByMonth.Aug;
      data[8] =
        body.overpassOnByMonth.Sep === null ? 0 : body.overpassOnByMonth.Sep;
      data[9] =
        body.overpassOnByMonth.Oct === null ? 0 : body.overpassOnByMonth.Oct;
      data[10] =
        body.overpassOnByMonth.Nov === null ? 0 : body.overpassOnByMonth.Nov;
      data[11] =
        body.overpassOnByMonth.Dec === null ? 0 : body.overpassOnByMonth.Dec;
      if (graph.length > 0) {
        data.forEach((item, i) => {
          if (item !== graph.graphOn.data[i]) {
            chk = true;
          }
        });
      }
    }
    const graphOn = {
      label: "อุปกรณ์ไฟฟ้าติด",
      backgroundColor: "#58ACFA",
      data: data,
      name: "graphOn",
    };
    if (chk) {
      setGraph([graphOff, graphOn]);
    }
  };

  useEffect(() => {
    getDataOverpass(accessToken).then(({ status, data }) => {
      if(status === 200){
        setOverpassData(data);
        genDataSets(data);  
      }
    });

    var thisheaders = {
      Authorization: `Bearer ${accessToken}`,
    };
    var sock = new SockJS(`${PROD_API_URL}/websocket`);
    let stompClient = Stomp.over(sock);
    sock.onopen = function () {
      console.log("open");
    };

    stompClient.connect(thisheaders, function (frame) {
      //console.log('Connected: ' + frame);
      stompClient.subscribe("/topic/greetings", function (data) {
        if (data !== null) {
          console.log(data);
          const obj = JSON.parse(JSON.stringify(data));
          let body = JSON.parse(JSON.stringify(obj.body));
          body = JSON.parse(body);
          setOverpassData(body);
          genDataSets(body);
        } else {
          setOverpassData([]);
          genDataSets([]);
        }
      });
    });
  }, []);

  return (
    <>
      <h3 className="mb-4">แผงงานวิเคราะห์ข้อมูล</h3>
      <CRow>
        <CCol xs="12" sm="6" md="3">
          <CCard>
            <CCardBody>
              <center>
                <h1>
                  {"overpassByZone" in overpassData
                    ? overpassData.overpassByZone.cnt
                    : 0}
                </h1>
              </center>
              <center><b>เขตพื้นที่ติดตั้งอุปกรณ์</b></center>
            </CCardBody>
            <CCardFooter className="bg-secondary text-black">
              <center>
                <Moment format="DD/MM/YYYY HH:mm:ss">
                  {"overpassByZone" in overpassData &&
                  overpassData.overpassByZone.update_dt !== null
                    ? overpassData.overpassByZone.update_dt
                    : new Date()}
                </Moment>
              </center>
            </CCardFooter>
          </CCard>
        </CCol>
        <CCol xs="12" sm="6" md="3">
          <CCard>
            <CCardBody>
              <center>
                <h1>
                  {"overpassAll" in overpassData
                    ? overpassData.overpassAll.cnt
                    : 0}
                </h1>
              </center>
              <center className="text-info"><b>รวมอุปกรณ์ไฟฟ้าทั้งหมด</b></center>
            </CCardBody>
            <CCardFooter className="bg-info text-white">
              <center>
                <Moment format="DD/MM/YYYY HH:mm:ss">
                  {"overpassAll" in overpassData &&
                  overpassData.overpassAll.effective_date !== null
                    ? overpassData.overpassAll.effective_date
                    : new Date()}
                </Moment>
              </center>
            </CCardFooter>
          </CCard>
        </CCol>
        <CCol xs="12" sm="6" md="3">
          <CCard>
            <CCardBody>
              <center>
                <h1>
                  {"overpassOn" in overpassData
                    ? overpassData.overpassOn.cnt
                    : 0}
                </h1>
              </center>
              <center className="text-success"><b>อุปกรณ์หลอดไฟฟ้าติด</b></center>
            </CCardBody>
            <CCardFooter className="bg-success">
              <center>
                <Moment format="DD/MM/YYYY HH:mm:ss">
                  {"overpassOn" in overpassData &&
                  overpassData.overpassOn.effective_date !== null
                    ? overpassData.overpassOn.effective_date
                    : new Date()}
                </Moment>
              </center>
            </CCardFooter>
          </CCard>
        </CCol>
        <CCol xs="12" sm="6" md="3">
          <CCard>
            <CCardBody>
              <center>
                <h1>
                  {"overpassOff" in overpassData
                    ? overpassData.overpassOff.cnt
                    : 0}
                </h1>
              </center>
              <center className="text-danger"><b>อุปกรณ์หลอดไฟฟ้าดับ</b></center>
            </CCardBody>
            <CCardFooter className="bg-danger text-white">
              <center>
                <Moment format="DD/MM/YYYY HH:mm:ss">
                  {"overpassOff" in overpassData &&
                  overpassData.overpassOff.effective_date !== null
                    ? overpassData.overpassOff.effective_date
                    : new Date()}
                </Moment>
              </center>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs="12" md="9" sm="12" className="mb-4">
          <CCard>
            <CCardBody>
              <CCard>
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
                          <CCol>
                            <CChartBar
                              datasets={graph}
                              labels="months"
                              options={{
                                tooltips: {
                                  enabled: true,
                                },
                              }}
                            />
                          </CCol>
                        </CRow>
                      </CTabPane>
                      <CTabPane data-tab="profile">
                        <CChartDoughnut
                          datasets={[
                            {
                              backgroundColor: [
                                '#41B883',
                                '#E46651',
                                '#00D8FF',
                                '#DD1B16'
                              ],
                              data: [40, 20, 80, 10]
                            }
                          ]}
                          labels={['VueJs', 'EmberJs', 'ReactJs', 'AngularJs']}
                          options={{
                            tooltips: {
                              enabled: true
                            }
                          }}
                        />
                      </CTabPane>
                    </CTabContent>
                  </CTabs>
                </CCardBody>
              </CCard>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs="12" md="3" sm="3">
          <CListGroup>
            <CListGroupItem>
              <b className={"float-left"}>Top Referrals</b>
              <b className="float-right">
                <CLink
                  href="https://coreui.io"
                  target="_blank"
                >
                  View Report
                </CLink>
              </b>
            </CListGroupItem>
            <CListGroupItem>
              <span className="float-left">
                หัวเรื่อง/แหล่งที่มา
              </span>
              <span className="float-right">จำนวน</span>
            </CListGroupItem>
            <CListGroupItem>
              <span className="float-left">
                อุปกรณ์ไฟฟ้าติดสูงสุด
              </span>
              <span className="float-right">2 จุด</span>
            </CListGroupItem>
            <CListGroupItem>
              <span className="float-left">
                อุปกรณ์ไฟฟ้าดับสูงสุด
              </span>
              <span className="float-right">2 จุด</span>
            </CListGroupItem>
            <CListGroupItem>
              <span className="float-left">
                อุปกรณ์ไฟฟ้าเสียร้อยละ
              </span>
              <span className="float-right">2 จุด</span>
            </CListGroupItem>
            <CListGroupItem>
              <span className="float-left">
                แจ้งเตือนข้อมูลสะสม
              </span>
              <span className="float-right">จำนวน</span>
            </CListGroupItem>
          </CListGroup>
        </CCol>
      </CRow>
    </>
  );
};

export default Dashboard;
