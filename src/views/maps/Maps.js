import React, { useEffect, useState, useRef, useMemo, useLayoutEffect } from "react";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CNavLink,
  CRow,
  CCol,
  CNav,
  CNavItem,
  CTabs,
  CTabContent,
  CTabPane,
  CListGroup,
  CListGroupItem,
  CFormGroup,
  CLabel,
  CSelect,
  CButton,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
} from "react-google-maps";
import "./style.css";
import { useSelector } from "react-redux";
import { getMappingAddress } from "src/services/CommonService";
import {
  searchOverpassesByUserId,
} from "src/services/OverpassService";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { API_KEY_GOOGLE_MAP } from "../../config"
import ApexCharts from 'apexcharts'
import SemiCircleProgressBar from "react-progressbar-semicircle";

// To use the Google Maps JavaScript API, you must register your app project on the Google API Console and get a Google API key which you can add to your app

const ReactGoogleMaps = () => {
  const accessToken = useSelector((state) => state.authen.access_token);
  const [provinces, setProvinces] = useState([]);
  const [amphurs, setAmphurs] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectDistrict, setSelectDistrict] = useState([]);
  const [locations, setLocations] = useState([]);
  const [overpasses, setOverpasses] = useState([]);
  const [overpassDetails, setOverpassDetails] = useState([]);
  const [graphDetail, setGraphDetail] = useState([]);

  // local
  //const apiKey = "AIzaSyASyYRBZmULmrmw_P9kgr7_266OhFNinPA";

  const [defaultCenter, setDefaultCenter] = useState({
    lat: parseFloat(13.8583),
    lng: parseFloat(100.4688)
  });
  const [modal, setModal] = useState(false);
  const provinceRef = useRef();
  const amphurRef = useRef();
  const districtRef = useRef();
  const overpassRef = useRef();
  const defaultZoom = 11;

  const MySwal = withReactContent(Swal);

  const handleSearch = () => {
    const body = new FormData();
    body.append("provinceId", provinceRef.current.value);
    body.append("amphurId", amphurRef.current.value);
    body.append("districtId", districtRef.current.value);
    body.append("overpassId", overpassRef.current.value);
    searchOverpassesByUserId(accessToken, body)
      .then((response) => {
        if (response.status === 200) {
          //setLoading(false);
          setLocationData(response.data);
          setOverpassDetails(response.data);
          if (response.data.length === 0) {
            MySwal.fire({
              //title: "Success",
              text: "ไม่พบข้อมูลในระบบ",
              icon: "success",
              didClose: () => {
                //setModal(false);
              },
            });
          }
        } else {
          //setLoading(false);
          MySwal.fire({
            title: "Failed",
            text: response.data,
            icon: "error",
            didClose: () => {
              //setModal(false);
            },
          });
        }
      })
      .then(() => {
        //resetForm();
      });
  };

  const MarkerList = () => {
    return locations.map((location, index) => {
      return (
        <MarkerWithInfoWindow key={index.toString()} location={location} />
      );
    });
  };

  const MarkerWithInfoWindow = ({ location }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
      <Marker
        onClick={() => setIsOpen(!isOpen)}
        position={location}
        title={location.title}
        label={location.label}
      >
        {isOpen && (
          <InfoWindow onCloseClick={() => setIsOpen(false)}>
            <CNavLink href={location.www} target="_blank">
              {location.title}
            </CNavLink>
          </InfoWindow>
        )}
      </Marker>
    );
  };

  const GoogleMapsComponent = withScriptjs(
    withGoogleMap(() => {
      return (
        <GoogleMap defaultZoom={defaultZoom} defaultCenter={defaultCenter}>
          {<MarkerList locations={locations} />}
        </GoogleMap>
      );
    })
  );

  const googleMap = useMemo(() => {
    return (
      <GoogleMapsComponent
        key="map"
        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${API_KEY_GOOGLE_MAP}`}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `400px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    );
  }, [locations]);

  const selectProvince = (id) => {
    let a = provinces.find((val) => {
      return val.key == id;
    });
    setAmphurs(a ? a.amphur : []);
  };

  const selectAmphur = (id) => {
    let ds = amphurs.find((val) => {
      return val.key == id;
    });
    setDistricts(ds ? ds.district : []);
  };

  const setLocationData = (data) => {
    let response = [];
    data.forEach((item) => {
      if (response.length == 0)
        setDefaultCenter({
          lat: parseFloat(item.latitude),
          lng: parseFloat(item.longtitude),
        });
      response[response.length] = {
        lat: parseFloat(item.latitude),
        lng: parseFloat(item.longtitude),
        label: "S",
        draggable: false,
        title: item.name,
      };
    });
    setLocations(response);
  };

  const xxx = () => {
    var options = {
      series: [76],
      chart: {
      type: 'radialBar',
      offsetY: -20,
      sparkline: {
        enabled: true
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: "#e7e7e7",
          strokeWidth: '97%',
          margin: 5, // margin is in pixels
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            color: '#999',
            opacity: 1,
            blur: 2
          }
        },
        dataLabels: {
          name: {
            show: false
          },
          value: {
            offsetY: -2,
            fontSize: '22px'
          }
        }
      }
    },
    grid: {
      padding: {
        top: -10
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        shadeIntensity: 0.4,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 53, 91]
      },
    },
    labels: ['Average Results'],
    };
    var chart = new ApexCharts(document.querySelector("#chart"), options);
    //console.log(chart.render());
    return chart.render()
    
  }

  const getOverpassDetailsPage = useMemo(() => {
    let buffer = [];
    let row = [];
    let key = 0;
    let j = 0;
    overpassDetails.forEach((item, i) => {
      let details = [];
      let color = "";
      let text = ""
      if (item.overpassStatus === "ON") {
        color = "success";
        text = "text-success"
      } else if (item.overpassStatus === "OFF") {
        color = "danger";
        text = "text-danger"
      } else if (item.overpassStatus === "WARNING") {
        color = "warning";
        text = "text-warning"
      } else {
        color = "secondary";
        text = "text-secondary"
      }

      let status = [];
      status.push(<b key={key++}>สถานะ: </b>);
      
      if (item.overpassStatus !== undefined && item.overpassStatus !== null && item.overpassStatus !== "") {
        status.push(<i className={text} key={key++}><b key={key++}>{item.overpassStatus}</b></i>);
      } else {
        status.push(<i key={key++}>ไม่มีการติดตั้งอุปกรณ์</i>);
      }
      details.push(status);
      details.push(<br key={key++}/>);

      if (item.location !== null && item.location !== "") {
        details.push(<b key={key++}>สถานที่: </b>);
        details.push(item.location);
        details.push(<br key={key++} />);
      }
      if (item.districtName !== null && item.districtName != "") {
        details.push(<b key={key++}>แขวง/ตำบล: </b>);
        details.push(item.districtName);
        details.push(<br key={key++} />);
      }
      if (item.amphurName !== null && item.amphurName != "") {
        details.push(<b key={key++}>เขต/อำเภอ: </b>);
        details.push(item.amphurName);
        details.push(<br key={key++} />);
      }
      if (item.provinceName !== null && item.provinceName != "") {
        details.push(<b key={key++}>จังหวัด: </b>);
        details.push(item.provinceName);
        details.push(<br key={key++}/>);
      }
      let percent = 0;
      let textDisplay = "";
      let stroke = "#e55353";
      textDisplay = percent + "/" + item.lightBulbCnt + " หลอด";
      if(item.overpassStatus === 'ON'){
        percent = 100;
        textDisplay = item.lightBulbCnt + "/" + item.lightBulbCnt + " หลอด";
        stroke = "#02B732";
      }else if(item.overpassStatus === 'WARNING'){
        let full = item.lightBulbCnt * item.lightBulb.watt;
        percent = Math.floor(item.watt / item.lightBulb.watt)
        console.log(Math.floor(65.1));
        textDisplay = percent + "/" + item.lightBulbCnt + " หลอด";
        stroke = "#f9b115"
      }
      buffer.push(
        <CCol xs="12" sm="6" md="4" key={key++}>
          <CCard accentColor={color} key={key++}>
            <CCardHeader key={key++}>
              <b key={key++}>{item.name}</b>
            </CCardHeader>
            <CCardBody key={key++}>
            <SemiCircleProgressBar percentage={percent} showPercentValue showPercentValue={false} stroke={stroke} />
            <div style={{textAlign: "center"}}>{textDisplay}</div><br/>
              {details}</CCardBody>
          </CCard>
        </CCol>
      );
      
      j++
      if (j === 3) {
        row.push(<CRow key={key++}>{buffer}</CRow>);
        buffer = [];
        j = 0;
      }
    });
    if(buffer.length > 0){
      row.push(<CRow key={key++}>{buffer}</CRow>);
      buffer = [];
    }
    return row;
  }, [overpassDetails]);

  useLayoutEffect(() => {
    //console.log(document.getElementById("#chart"))
  })
  const ccc = () => {
    console.log(document.getElementById("#chart"))
  }
  useEffect(() => {
    if (provinces.length === 0) {
      getMappingAddress(accessToken).then(({ status, data }) => {
        return status === 200 ? setProvinces(data) : setProvinces([]);
      });
    }
    const body = new FormData();
    searchOverpassesByUserId(accessToken, body).then(({ status, data }) => {
      if (status === 200) {
        setLocationData(data);
        setOverpasses(data);
        setOverpassDetails(data);
      } else {
        setLocationData([]);
      }
    });
    
  }, []);

  return <>
  <div id="chart">
</div>
    <CRow>
      <CCol xs="12" md="9" sm="12" className="mb-4">
        <CTabs activeTab="home">
          <CNav variant="tabs">
            <CNavItem>
              <CNavLink data-tab="home">แผนที่จุดสะพานลอย</CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink data-tab="profile" className={"text-mute"}>
                รายละเอียดสะพานลอยตามพื้นที่
              </CNavLink>
            </CNavItem>
          </CNav>
          <CTabContent>
            <CTabPane data-tab="home">
              <CCard>
                <CCardBody>{googleMap}</CCardBody>
              </CCard>
            </CTabPane>
            <CTabPane data-tab="profile">
              <CCard>
                <CCardBody>{getOverpassDetailsPage}{ccc()}</CCardBody>
              </CCard>
            </CTabPane>
          </CTabContent>
        </CTabs>
      </CCol>
      <CCol xs="12" sm="12" md="3">
        <CListGroup className={"margin-top"}>
          <CListGroupItem>
            <b className="float-left">ระบุตัวเลือกค้นหา</b>
          </CListGroupItem>

          <CListGroupItem>
            <CFormGroup className="pr-1">
              <CLabel htmlFor="exampleInputName1" className="pr-1">
                สะพานลอย
              </CLabel>
              <CSelect
                custom
                name="overpass"
                id="overpass"
                innerRef={overpassRef}
              >
                <option value="">Please select</option>
                {overpasses.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </CSelect>
            </CFormGroup>
            <CFormGroup className="pr-1">
              <CLabel htmlFor="exampleInputName2" className="pr-1">
                เขตพื้นที่จังหวัด
              </CLabel>
              <CSelect
                custom
                name="province"
                id="province"
                innerRef={provinceRef}
                onChange={(e) => {
                  selectProvince(e.target.value);
                }}
              >
                <option value="">Please select</option>
                {provinces.map((province) => (
                  <option key={province.key} value={province.key}>
                    {province.value.toLowerCase()}
                  </option>
                ))}
              </CSelect>
            </CFormGroup>
            <CFormGroup className="pr-1">
              <CLabel htmlFor="amphur" className="pr-1">
                เขต/อำเภอ
              </CLabel>
              <CSelect
                custom
                name="amphur"
                id="amphur"
                innerRef={amphurRef}
                onChange={(e) => {
                  selectAmphur(e.target.value);
                }}
              >
                <option value="">Please select</option>
                {amphurs.map((amphur) => (
                  <option key={amphur.key} value={amphur.key}>
                    {amphur.value.toLowerCase()}
                  </option>
                ))}
              </CSelect>
            </CFormGroup>
            <CFormGroup className="pr-1">
              <CLabel htmlFor="amphur" className="pr-1">
                แขวง/ตำบล
              </CLabel>
              <CSelect
                custom
                name="district"
                id="district"
                innerRef={districtRef}
                onChange={(e) => {
                  setSelectDistrict(e.target.value);
                }}
              >
                <option value="">Please select</option>
                {districts.map((district) => (
                  <option key={district.key} value={district.key}>
                    {district.value.toLowerCase()}
                  </option>
                ))}
              </CSelect>
            </CFormGroup>
            <CButton
              size="md"
              className="btn-facebook btn-brand mr-4 mb-4"
              onClick={handleSearch}
            >
              <CIcon size="sm" name="cil-magnifying-glass" /> {"  "}ค้นหา
            </CButton>
          </CListGroupItem>
        </CListGroup>
      </CCol>
    </CRow>
  </>
};

export default ReactGoogleMaps;
