import React, { useEffect, useState, useRef, useMemo } from "react";
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
  CInput,
  CFormText,
  CDropdown,
  CDropdownToggle,
  CInputGroup,
  CDropdownMenu,
  CDropdownItem,
  CSelect,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
} from "react-google-maps";
import { ProBadge, DocsLink } from "src/reusable";
import "./style.css";
import { Button, CardHeader } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { getMappingAddress } from "src/services/CommonService";
import {
  searchOverpassesByUserId,
  getOverpassesAll,
} from "src/services/OverpassService";
import { capitalize } from "src/utils/common";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

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

  // local
  const apiKey = "AIzaSyASyYRBZmULmrmw_P9kgr7_266OhFNinPA";
  
  // production
  //const apiKey = "AIzaSyANe0OjAC6ILZQGF9udm0BlN0QHW1JMMME";

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
    body.append("overpassRef", overpassRef.current.value);
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
        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${apiKey}`}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `400px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    );
  }, [locations]);

  const toKebabCase = (str) => {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();
  };

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

  const getOverpassDetailsPage = useMemo(() => {
    let buffer = [];
    let row = [];
    let key = 0;
    overpassDetails.forEach((item, i) => {
      let details = [];
      let color = "";
      
      if (item.overpassStatus === "ON") {
        color = "success";
      } else if (item.overpassStatus === "OFF") {
        color = "danger";
      } else if (item.overpassStatus === "WARNING") {
        color = "warning";
      } else {
        color = "secondary";
      }

      let status = [];
      status.push(<b key={key++}>สถานะ: </b>);
      if (item.overpassStatus !== null && item.overpassStatus !== "") {
        status.push(item.overpassStatus);
      } else {
        status.push("Not Available");
      }
      details.push(status);
      details.push(<br key={key++}/>);

      if (item.location !== null && item.location !== "") {
        details.push(item.location);
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
      buffer.push(
        <CCol xs="12" sm="6" md="4" key={key++}>
          <CCard accentColor={color} key={key++}>
            <CCardHeader key={key++}>
              <b key={key++}>{item.name}</b>
            </CCardHeader>
            <CCardBody key={key++}>{details}</CCardBody>
          </CCard>
        </CCol>
      );
      if (Math.ceil(i / 3) === 0) {
        row.push(<CRow key={key++}>{buffer}</CRow>);
        buffer = [];
      }
    });
    return row;
  }, [overpassDetails]);

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

  return (
    <CRow>
      <CCol xs="12" md="9" sm="12" className="mb-4">
        <CTabs activeTab="home">
          <CNav variant="tabs">
            <CNavItem>
              <CNavLink data-tab="home">ปริมาณข้อมูลรายเดือน</CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink data-tab="profile" className={"text-mute"}>
                อัตราอุปกรณ์ไฟฟ้าติด-ดับ
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
                <CCardBody>{getOverpassDetailsPage}</CCardBody>
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
  )
};

export default ReactGoogleMaps;
