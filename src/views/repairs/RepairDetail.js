import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CNavLink,
  CFormGroup,
  CLabel,
  CTextarea,
  CInput,
  CButton,
  CForm,
  CInvalidFeedback
} from "@coreui/react";
import { useSelector } from "react-redux";
import Moment from "react-moment";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
} from "react-google-maps";
import {
  insertAnswerOverpass,
  getAnswerByOverpassStatusId,
  getOverpassStatusById,
} from "src/services/answerService";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { API_KEY_GOOGLE_MAP } from "../../config";
import DatePicker from "react-datepicker";
import * as Yup from "yup";
import { Formik } from "formik";
import "react-datepicker/dist/react-datepicker.css";
import { convertTimestampToDatetime } from "../../utils/common"

const RepairDetail = (match) => {
  const isAuth = useSelector((state) => state.authen.isAuth);
  const accessToken = useSelector((state) => state.authen.access_token);
  const [header, setHeader] = useState({});
  const [modal, setModal] = useState(false);
  const formikRef = useRef();
  const refFixedDate = useRef();
  const [fixedDate, setFixedDate] = useState(new Date());
  const MySwal = withReactContent(Swal);
  const [disableRootCuase, setDisableRootCuase] = useState(false);
  const [disableFixed, setDisableFixed] = useState(false);
  const [disableFixedDate, setDisableFixedDate] = useState(false);
  const [disableUserFixed, setDisableUserFixed] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(false);

  const addUserSchema = () => {
    let schema = {
      rootCuase: Yup.string().required("กรุณาระบุสาเหตุ"),
      fixed: Yup.string().required("กรุณาระบุว่าแก้ไขอย่างไร"),
      //fixedDate: Yup.string().required("กรุราระบุวันที่แก้ไข"),
      userFixed: Yup.string().required("กรุณาระบุผู้แก้ไข"),
    };

    return Yup.object().shape(schema);
  };

  const handleAdd = (values, { resetForm }) => {
    const {
      rootCuase,
      fixed,
      userFixed
     } = values;
 
     let body = {
      rootCuase,
      fixed,
      userFixed,
      fixedDate: fixedDate.getTime(),
      overpassStatusId: match.match.params.id
     };
     
       insertAnswerOverpass(accessToken, body)
       .then((response) => {
         if (response.status === 200) {
           //setLoading(false);
           MySwal.fire({
             title: "Success",
             text: "บันทึกข้อมูลสำเร็จ  ",
             icon: "success",
             didClose: () => {
              setDisableRootCuase(true);
              setDisableFixed(true);
              setDisableFixedDate(true);
              setDisableUserFixed(true);
              setDisableSubmit(true);
              setModal(false);
               
             },
           });
         } else {
           //setLoading(false);
           MySwal.fire({
             title: "Failed",
             text: response.data,
             icon: "error",
             didClose: () => {
               setModal(false);
              
             },
           });
         }
       })
       .then(() => {
         //resetForm();
       });
     
   };
  const MarkerList = (props) => {
    return props.locations.map((lo, index) => {
      return <MarkerWithInfoWindow key={index.toString()} location={lo} />;
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
    withGoogleMap((props) => {
      return (
        <GoogleMap defaultZoom={props.defaultZoom} defaultCenter={props.obj}>
          {<MarkerList locations={props.locations} />}
        </GoogleMap>
      );
    })
  );

  const googleMap = () => {
    return (
      <GoogleMapsComponent
        key="map"
        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${API_KEY_GOOGLE_MAP}`}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `400px` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    );
  };

  const genContent = useMemo(() => {
    if (Object.keys(header).length > 0) {
      return (
        <CRow>
          <CCol sm="12" xl="12">
            <CCard>
              <CCardHeader>
                <h5
                  className={
                    header.status === "OFF" ? "text-danger" : "text-warning"
                  }
                >
                  {header.topic}
                </h5>
              </CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol xs="12">
                    <CFormGroup>
                      <CLabel htmlFor="ccnumber">
                        <b>สถานที่</b> : {header.locationDisplay}
                      </CLabel>
                    </CFormGroup>
                  </CCol>
                </CRow>
                <CRow
                  style={{
                    display:
                      header.location !== "" && header.location !== null
                        ? ""
                        : "none",
                  }}
                >
                  <CCol xs="12">
                    <CFormGroup>
                      <CLabel htmlFor="ccnumber">
                        <b>Note</b>: {header.location}
                      </CLabel>
                    </CFormGroup>
                  </CCol>
                </CRow>

                <CRow>
                  <CCol xs="12">
                    <CFormGroup>
                      <b>วันเวลาที่ได้รับแจ้ง</b>:{" "}
                      <Moment format="DD/MM/YYYY HH:mm:ss">
                        {header.effectiveDate}
                      </Moment>
                    </CFormGroup>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol xs="12">
                    <b>พิกัด</b>:
                    <GoogleMapsComponent
                      obj={{
                        lat: parseFloat(header.latitude),
                        lng: parseFloat(header.longtitude),
                      }}
                      locations={[
                        {
                          lat: parseFloat(header.latitude),
                          lng: parseFloat(header.longtitude),
                        },
                      ]}
                      defaultZoom={11}
                      key="map"
                      googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${API_KEY_GOOGLE_MAP}`}
                      loadingElement={<div style={{ height: `100%` }} />}
                      containerElement={<div style={{ height: `400px` }} />}
                      mapElement={<div style={{ height: `100%` }} />}
                    />
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      );
    }
  }, [header]);

  useEffect(() => {
    getOverpassStatusById(accessToken, match.match.params.id).then(
      ({ status, data }) => {
        if (status === 200) {
          console.log(data);
          setHeader(data);
          getAnswerByOverpassStatusId(accessToken, match.match.params.id).then(
            ({ status, data }) => {
              if (status === 200) {
                console.log(data);
                if(data.length > 0){
                  formikRef.current.setFieldValue("rootCuase", data[0].rootCuase);
                  formikRef.current.setFieldValue("fixed", data[0].fixed);
                  formikRef.current.setFieldValue("userFixed", data[0].userFixed);
                  setFixedDate(convertTimestampToDatetime(data[0].fixedDate));
                  setDisableRootCuase(true);
                  setDisableFixed(true);
                  setDisableFixedDate(true);
                  setDisableUserFixed(true);
                  setDisableSubmit(true);
                  setModal(false);
                }
              }
            }
          );
        }
      }
    );
  }, []);

  return (
    <>
      <div>{genContent}</div>
      <Formik
      innerRef={formikRef}
      enableReinitializing={true}
      initialValues={{ 
        rootCuase: "",
        fixed: "",
        userFixed: "",
        //fixedDate: "",
      }}
      validationSchema={addUserSchema}
      onSubmit={handleAdd}
    >
      {({
        values,
        errors,
        touched,
        handleSubmit,
        handleChange,
        handleBlur
      }) => 
      (
        <CForm onSubmit={handleSubmit} noValidate name="addUserForm">

      <CRow>
        <CCol xs="12">
          <CCard>
            <CCardBody>
              <CRow>
                <CCol xs="12">
                  <CFormGroup>
                    <CLabel htmlFor="disabled-input">
                      <h5>สาเหตุ</h5>
                    </CLabel>
                    <CTextarea
                      name="rootCuase"
                      id="rootCuase"
                      rows="9"
                      placeholder=""
                      valid={!!values.rootCuase}
                      invalid={touched.rootCuase && !!errors.rootCuase}
                      placeholder=""
                      value={values.rootCuase}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={disableRootCuase}
                    />
                    <CInvalidFeedback>{errors.rootCuase}</CInvalidFeedback>
                  </CFormGroup>
                  <CFormGroup>
                    <CLabel htmlFor="disabled-input">
                      <h5>วิธีแก้ปัญหา</h5>
                    </CLabel>
                    <CTextarea
                      name="fixed"
                      id="fixed"
                      rows="9"
                      valid={!!values.fixed}
                      invalid={touched.fixed && !!errors.fixed}
                      placeholder=""
                      value={values.fixed}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={disableFixed}
                    />
                    <CInvalidFeedback>{errors.fixed}</CInvalidFeedback>
                  </CFormGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol xs="6">
                  <CFormGroup row>
                    <CCol md="12">
                      <CLabel htmlFor="dateFixed">วันที่แก้ไข</CLabel>
                    </CCol>
                    <CCol xs="12" md="12">
                      <DatePicker
                        selected={fixedDate}
                        id="fixedDate"
                        name="fixedDate"
                        onChange={(e) => { setFixedDate(e);
                        }}
                        disabled={disableFixedDate}
                        className="form-control"
                        showTimeSelect={true}
                        dateFormat="Pp"
                        ref={refFixedDate}
                      />
                      <CInvalidFeedback>{errors.fixedDate}</CInvalidFeedback>
                    </CCol>
                  </CFormGroup>
                </CCol>

                <CCol xs="6">
                  <CFormGroup row>
                    <CCol md="12">
                      <CLabel htmlFor="userFixed">ผู้แก้ไข</CLabel>
                    </CCol>
                    <CCol xs="12" md="12">
                      <CInput id="userFixed" 
                        name="userFixed"
                        valid={!!values.userFixed}
                        invalid={touched.userFixed && !!errors.userFixed}
                        placeholder=""
                        value={values.userFixed}
                        disabled={disableUserFixed}
                        onChange={handleChange}
                        onBlur={handleBlur}
                         />
                      <CInvalidFeedback>{errors.userFixed}</CInvalidFeedback>
                    </CCol>
                  </CFormGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                  <CButton className="btn btn-primary" type="submit" disabled={disableSubmit}>
                    บันทึก
                  </CButton>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      </CForm>
      )}
    </Formik>               
    </>
  );
};

export default RepairDetail;
