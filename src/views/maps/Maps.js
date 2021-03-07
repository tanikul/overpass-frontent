import React from 'react'
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
  CButton
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from 'react-google-maps'
import { ProBadge, DocsLink } from 'src/reusable'
import './style.css';
import { Button } from '@material-ui/core'

// To use the Google Maps JavaScript API, you must register your app project on the Google API Console and get a Google API key which you can add to your app
const apiKey = 'AIzaSyASyYRBZmULmrmw_P9kgr7_266OhFNinPA'

const defaultZoom = 11
const defaultCenter = { lat: 37.431489, lng: -122.163719 }
const locations = [
  {
    lat: 37.431489,
    lng: -122.163719,
    label: 'S',
    draggable: false,
    title: 'Stanford',
    www: 'https://www.stanford.edu/'
  },
  {
    lat: 37.394694,
    lng: -122.150333,
    label: 'T',
    draggable: false,
    title: 'Tesla',
    www: 'https://www.tesla.com/'
  },
  {
    lat: 37.331681,
    lng: -122.030100,
    label: 'A',
    draggable: false,
    title: 'Apple',
    www: 'https://www.apple.com/'
  },
  {
    lat: 37.484722,
    lng: -122.148333,
    label: 'F',
    draggable: false,
    title: 'Facebook',
    www: 'https://www.facebook.com/'
  }
]

const MarkerList = () => {
  return locations.map((location, index) => {
    return (
      <MarkerWithInfoWindow key={index.toString()} location={location}/>
    )
  })
}

const MarkerWithInfoWindow = ({location}) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
          
    <Marker 
      onClick={() => setIsOpen(!isOpen)} 
      position={location} 
      title={location.title} 
      label={location.label}
    >
      { isOpen &&
        <InfoWindow onCloseClick={() => setIsOpen(false)}>
          <CNavLink href={location.www} target="_blank">{location.title}</CNavLink>
        </InfoWindow>
      }
    </Marker>
  )
}

const GoogleMapsComponent = withScriptjs(withGoogleMap(() => {
    return (
      <GoogleMap defaultZoom={defaultZoom} defaultCenter={defaultCenter}>
        {<MarkerList locations={locations}/>}
      </GoogleMap>
    )
  }
))

const toKebabCase = (str) => {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase()
}

const ReactGoogleMaps = () => {
  return [
    <CRow>
      <CCol xs="9" sm="9" md="9">
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
            <CCard>
              <CCardHeader>
                React Google Maps{' '}
                <ProBadge/>
                <DocsLink href="https://github.com/tomchentw/react-google-maps"/>
              </CCardHeader>
              <CCardBody>
                <GoogleMapsComponent
                  key="map"
                  googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${apiKey}`}
                  loadingElement={<div style={{height: `100%`}}/>}
                  containerElement={<div style={{height: `400px`}}/>}
                  mapElement={<div style={{height: `100%`}}/>}
                />
              </CCardBody>
            </CCard>
      </CTabPane>
      <CTabPane data-tab="profile">
        
          <CCard>
            <CCardHeader>
              React Google Maps{' '}
              <ProBadge/>
              <DocsLink href="https://github.com/tomchentw/react-google-maps"/>
            </CCardHeader>
            <CCardBody>
            <CRow>
              <CCol xs="12" sm="6" md="3">
                <CCard>
                  <CCardBody borderColor="secondary">
                    <CRow>
                      <CCol xs="3" sm="3" md="3">
                
                        <CIcon name="cil-location-pin" size="2xl"/>
                      
                      </CCol>
                      <CCol xs="9" sm="9" md="9">
                        <CRow><b>District:</b> xxxxxxxxx</CRow>
                        <CRow><b>Point status Flase:</b> xxxxxxx</CRow>
                        <CRow><b>Update:</b> xxxxxxx</CRow>
                      </CCol>
                      </CRow>
                      </CCardBody>
                    </CCard>
                  </CCol>
                  <CCol xs="12" sm="6" md="3">
                    <CCard>
                      <CCardBody borderColor="secondary">
                        Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut
                        laoreet dolore magna aliquam erat volutpat.Ut wisi enim ad minim veniam, quis nostrud exerci tation
                        ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
                      </CCardBody>
                    </CCard>
                  </CCol>
                  <CCol xs="12" sm="6" md="3">
                    <CCard>
                      <CCardBody borderColor="secondary">
                        Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut
                        laoreet dolore magna aliquam erat volutpat.Ut wisi enim ad minim veniam, quis nostrud exerci tation
                        ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
                      </CCardBody>
                    </CCard>
                  </CCol>
                  <CCol xs="12" sm="6" md="3">
                    <CCard>
                      <CCardBody borderColor="secondary">
                        Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut
                        laoreet dolore magna aliquam erat volutpat.Ut wisi enim ad minim veniam, quis nostrud exerci tation
                        ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
                      </CCardBody>
                    </CCard>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          
      </CTabPane>
    </CTabContent>
  </CTabs>
  </CCol>
  <CCol xs="3" sm="3" md="3">

            <CListGroup className={"margin-top"}>
              <CListGroupItem>
                <b class="float-left">ระบุตัวเลือกค้นหา</b>
              </CListGroupItem>
              
              <CListGroupItem>
                <CFormGroup className="pr-1">
                  <CLabel htmlFor="exampleInputName2" className="pr-1">รหัสอุปกรณ์ไฟฟ้า</CLabel>
                  <CSelect custom name="ccmonth" id="ccmonth">
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                      <option value="11">11</option>
                      <option value="12">12</option>
                    </CSelect>
                </CFormGroup>
                <CFormGroup className="pr-1">
                  <CLabel htmlFor="exampleInputName2" className="pr-1">เขตพื้นที่จังหวัด</CLabel>
                  <CSelect custom name="ccmonth" id="ccmonth">
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                      <option value="11">11</option>
                      <option value="12">12</option>
                    </CSelect>
                </CFormGroup>
                <CFormGroup className="pr-1">
                  <CLabel htmlFor="exampleInputName2" className="pr-1">เขตพื้นที่อำเภอ</CLabel>
                  <CSelect custom name="ccmonth" id="ccmonth">
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                      <option value="11">11</option>
                      <option value="12">12</option>
                    </CSelect>
                </CFormGroup>
                <CButton size="md" className="btn-facebook btn-brand mr-4 mb-4"><CIcon size="sm" name="cil-magnifying-glass" /> {"  "}ค้นหา</CButton>
              </CListGroupItem>
              
            </CListGroup>
  </CCol>
  </CRow>
  ]
  
}

export default ReactGoogleMaps
