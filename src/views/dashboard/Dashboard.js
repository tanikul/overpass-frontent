import React, { useEffect, useState } from "react";
import Moment from "react-moment";
import {
  CCard,
  CCardBody,
  CCardFooter,
  CCol,
  CRow,
  CNav,
  CNavItem,
  CNavLink,
  CTabs,
  CTabContent,
  CTabPane,
  CLink,
  CListGroupItem,
  CListGroup,
} from "@coreui/react";
import {
  CChartBar,
  CChartDoughnut,
} from "@coreui/react-chartjs";
import { useSelector } from "react-redux";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { PROD_API_URL } from "../../config";
import {
  getDataOverpass,
} from "src/services/DashboardService";
import { COLOR_AMPHUR } from "../../config"
import Chart from "react-apexcharts";
import { useDispatch } from "react-redux";
import { setLoginExpired } from "../../actions/authen";
import { redirect } from "../../actions/redirect";

const Dashboard = () => {
  const accessToken = useSelector((state) => state.authen.access_token);
  const overpassGroup = useSelector((state) => state.authen.overpassGroup);
  const [overpassData, setOverpassData] = useState({});
  const [graph, setGraph] = useState([]);
  const [backgroundColorDonut, setBackgroundColorDonut] = useState([]);
  const [dataDonut, setDataDonut] = useState([]);
  const [labelsDonut, setLabelsDonut] = useState([]);
  const [overpassOnMax, setOverpassOnMax] = useState(0);
  const [overpassOffMax, setOverpassOffMax] = useState(0);
  const [overpassOffAverage, setOverpassOffAverage] = useState(0);
  const [graphOptions, setGraphOptions] = useState({options: {}, series: []});
  const [graphSeries, setGraphSeries] = useState([]);
  const dispatch = useDispatch();
  
  const genDataSets = (body) => {
    let data = [];
    let max = 0;
    let _array = []
    let chk = false;
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
        data.forEach((item, i) => {
          if (item !== graph.graphOff.data[i]) {
            chk = true;
          }
        });
      }
    }
    _array = data;
    
    const dataOff = data
    const graphOff = {
      label: "สะพานลอยที่ไฟฟ้ามีปัญหา",
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
    _array.concat(data)
    max = (Math.max.apply(Math,_array))
    const graphOn = {
      label: "สะพานลอยที่ไฟฟ้าปกติ",
      backgroundColor: "#58ACFA",
      data: data,
      name: "graphOn",
    };
    const dataOn = data
    const po = {
      
      options: {
        chart: {
          id: "basic-bar"
        },
        xaxis: {
          categories: ['ม.ค','ก.พ','มี.ค','เม.ย','พ.ค','มิ.ย','ก.ค','ส.ค','ก.ย','ต.ค','พ.ย','ธ.ค'],
        },
        yaxis: {
          min: 0,
          max: max + 5,
          forceNiceScale: true,
          decimalsInFloat: undefined
        },
        colors: ["#e55353", "#58ACFA"],
      },
      
      series: [
        {
          name: "สะพานลอยที่มีหลอดไฟดับ",
          data: dataOff
        },
        {
          name: "สะพานลอยที่ไฟฟ้าปกติ",
          data: dataOn
        }
      ]
    };
    
    
    //if (chk) {
      setGraphOptions(po)
      //setGraph([graphOff, graphOn]);
      setOverpassOnMax(body.overpassOnMax);
      setOverpassOffMax(body.overpassOffMax);
      setOverpassOffAverage(body.overpassOffAverage);
    //}
  };

  const genDataDonutChart = (body) => {
    let backgroundColor = []
    let data = []
    let labels = []
    if(body.donutChart !== undefined && body.donutChart.length > 0){
      body.donutChart.forEach((item, i) => {
        backgroundColor[i] = COLOR_AMPHUR[item.amphur_id];
        data[i] = item.cnt;
        labels[i] = item.amphur_name;
      })
      setBackgroundColorDonut(backgroundColor)
      setDataDonut(data)
      setLabelsDonut(labels)
     
    }else{
      backgroundColor[0] = "#807C7F";
      data[0] = 0;
      labels[0] = "ไม่มีอุปกรณ์ไฟฟ้าดับ";
      setBackgroundColorDonut(backgroundColor)
      setDataDonut(data)
      setLabelsDonut(labels)
    }
    
  }
  
  useEffect(() => {
    getDataOverpass(accessToken).then(({ data }) => {
      if(data.code && data.code === '9999'){
        dispatch(redirect("/"));
        dispatch(setLoginExpired());
      }
      setOverpassData(data);
      genDataSets(data);  
      genDataDonutChart(data);
    }).catch(err => {
      console.log(err);
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
      stompClient.subscribe(`/topic/greetings/${overpassGroup}`, function (data) {
        if (data !== null) {
          const obj = JSON.parse(JSON.stringify(data));
          let body = JSON.parse(JSON.stringify(obj.body));
          body = JSON.parse(body);
          setOverpassData(body);
          genDataSets(body);
          genDataDonutChart(body);
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
                    ? (overpassData.overpassByZone.cnt === null) ? 0 : overpassData.overpassByZone.cnt
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
                    ? (overpassData.overpassAll.cnt === null) ? 0 : overpassData.overpassAll.cnt 
                    : 0}
                </h1>
              </center>
              <center className="text-info"><b>สะพานลอยทั้งหมด</b></center>
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
                    ? (overpassData.overpassOn.cnt === null) ? 0 : overpassData.overpassOn.cnt
                    : 0}
                </h1>
              </center>
              <center className="text-success"><b>สะพานลอยที่เปิดไฟ</b></center>
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
                    ? (overpassData.overpassOff.cnt === null) ? 0 : overpassData.overpassOff.cnt
                    : 0}
                </h1>
              </center>
              <center className="text-danger"><b>สะพานลอยที่ปิดไฟ/มีไฟดับ</b></center>
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
                          อัตราอุปกรณ์ไฟฟ้าดับ
                        </CNavLink>
                      </CNavItem>
                    </CNav>
                    <CTabContent>
                      <CTabPane data-tab="home">
                        <CRow>
                          <CCol>
                          <Chart
                              options={graphOptions.options}
                              series={graphOptions.series}
                              type="bar"
                              width="100%"
                              height='300px'
                              yaxis={graphOptions.yaxis}
                              
                            />
                          </CCol>
                        </CRow>
                      </CTabPane>
                      <CTabPane data-tab="profile">
                        <CChartDoughnut
                          datasets={[
                            {
                              backgroundColor: backgroundColorDonut,
                              data: dataDonut
                            }
                          ]}
                          labels={labelsDonut}
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
                  href=""
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
              <span style={{marginLeft:"2em"}}>{overpassOnMax}</span>
              <span className="float-right"> จุด</span>
            </CListGroupItem>
            <CListGroupItem>
              <span className="float-left">
                อุปกรณ์ไฟฟ้าดับสูงสุด
              </span>
              <span style={{marginLeft:"2em"}}>{overpassOffMax}</span>
              <span className="float-right"> จุด</span>
            </CListGroupItem>
            <CListGroupItem>
              <span className="float-left">
                อุปกรณ์ไฟฟ้าเสียร้อยละ
              </span>
              <span style={{marginLeft:"1.5em"}}>{overpassOffAverage}</span>
              <span className="float-right">  </span>
            </CListGroupItem>
            {/*<CListGroupItem>
              <span className="float-left">
                แจ้งเตือนข้อมูลสะสม
              </span>
              <span className="float-right">จำนวน</span>
            </CListGroupItem>*/}
          </CListGroup>
        </CCol>
      </CRow>
    </>
  );
};

export default Dashboard;
