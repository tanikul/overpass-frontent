import React, { useState, useEffect, useRef } from "react";
import { Multiselect } from "multiselect-react-dropdown";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormGroup,
  CInvalidFeedback,
  CInput,
  CLabel,
  CSelect,
  CRow,
  CSwitch,
  CDataTable,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { useSelector } from "react-redux";
import { capitalize } from "src/utils/common";
import { getMappingAddress } from "src/services/CommonService";
import {
  getOverpassesByCond,
} from "src/services/OverpassService";
import {
  insertMappingOverpasses,
  updateMappingOverpasses,
  getOverpassByGroupId,
} from "src/services/MappingService";
import * as Yup from "yup";
import { Formik } from "formik";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "spinkit/spinkit.min.css";
import { Redirect } from "react-router-dom";

const MySwal = withReactContent(Swal);

const MappingForms = ({ match, history }) => {
  const isAuth = useSelector((state) => state.authen.isAuth);
  const accessToken = useSelector((state) => state.authen.access_token);
  const [province, setProvince] = useState("");
  const [amphur, setAmphur] = useState("");
  const [district, setDistrict] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [amphurs, setAmphurs] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedOverpass, setSelectedOverpass] = useState([]);
  const [selectedOverpassTmp, setSelectedOverpassTmp] = useState([]);
  const [selectedValue, setSelectedValue] = useState([]);
  const [options, setOptions] = useState([]);
  const formikRef = useRef();
  const selectProvinceRef = useRef();
  const selectAmphurRef = useRef();
  const selectDistrictRef = useRef();
  const checkallOverpass = useRef();
  const [disableDraft, setDisableDraft] = useState(true);
  const [disableConfirm, setDisableConfirm] = useState(true);
  const multiselectRef = React.createRef();
  const isEdit = match.params.mode === "edit" ? true : false;
  const [reload, setReload] = useState(false);
  const [checked, setChecked] = useState(false);
  const userRole = useSelector((state) => state.authen.role);
  
  const schema = () => {
    let schema = {
      groupName: Yup.string().required("Name is required!"),
      lineNotifyToken: Yup.string().required("Line Notify token is required!"),
      email: Yup.string().required("Email is required!"),
    };

    return Yup.object().shape(schema);
  };

  const handleAdd = (values) => {
    
    const body = {
      groupId: values.groupId,
      overpasses: selectedOverpass,
      groupName: values.groupName,
      lineNotiToken: values.lineNotifyToken,
      email: values.email,
    };
    console.log(body);
    //return false;
    if (!isEdit) {
      insertMappingOverpasses(accessToken, body)
        .then((response) => {
          if (response.status === 200) {
            MySwal.fire({
              title: "Success",
              text: "Mapping กลุ่มสะพานลอยสำเร็จ  ",
              icon: "success",
              didClose: () => {
                history.push("/mapping-overpass");
              },
            });
          } else {
            MySwal.fire({
              title: "Failed",
              text: response.data,
              icon: "error",
              didClose: () => {},
            });
          }
        })
        .then(() => {});
    } else {
      updateMappingOverpasses(accessToken, body)
        .then((response) => {
          if (response.status === 200) {
            MySwal.fire({
              title: "Success",
              text: "Mapping กลุ่มสะพานลอยสำเร็จ  ",
              icon: "success",
              didClose: () => {
                history.push("/mapping-overpass");
              },
            });
          } else {
            MySwal.fire({
              title: "Failed",
              text: response.data,
              icon: "error",
              didClose: () => {
                //setModal(false);
                //reloadData();
              },
            });
          }
        })
        .then(() => {});
    }
  };

  const selectProvince = (e) => {
    let id = e.target.value;
    getOverpassesByCond(accessToken, id).then(({ status, data }) => {
      return status === 200
        ? setOptionsVal(data, "province")
        : setOptionsVal([], "province");
    });

    setAmphurs(
      provinces.find((val) => {
        return val.key == id;
      }).amphur
    );
    setDistricts([]);
    setProvince(id);
    setSelectedValue([]);
  };

  const selectAmphur = (e) => {
    let id = e.target.value;
    getOverpassesByCond(accessToken, province, id).then(({ status, data }) => {
      return status === 200
        ? setOptionsVal(data, "amphur")
        : setOptionsVal([], "amphur");
    });
    setDistricts(
      amphurs.find((val) => {
        return val.key == id;
      }).district
    );
    setAmphur(id);
  };

  const selectDistrict = (e) => {
    let id = e.target.value;
    getOverpassesByCond(accessToken, province, amphur, id).then(
      ({ status, data }) => {
        return status === 200
          ? setOptionsVal(data, "district")
          : setOptionsVal([], "district");
      }
    );
    setDistrict(id);
  };

  const onSelect = (selectedList, selectedItem) => {
    console.log(selectedItem);
    setSelectedOverpassTmp(Object.values(selectedList));
    setDisableDraft(false);
  };

  const onRemove = (selectedList, removedItem) => {
    setSelectedOverpassTmp(Object.values(selectedList));
    setDisableDraft(selectedList.length > 0 ? false : true);
  };

  const clickRemove = (id) => {
    let arr = [];
    selectedOverpass.forEach((item) => {
      if (item.id !== id) {
        arr.push(item);
      }
    });
    setSelectedOverpass(arr);
    setDisableConfirm(false);
  };

  const clickDraft = () => {
    selectedOverpassTmp.forEach((item, i) => {
      selectedOverpass.push(item);
    });
    setSelectedOverpassTmp([]);
    setSelectedValue([]);
    multiselectRef.current.resetSelectedValues();
    setProvince("");
    setAmphur("");
    setDistrict("");
    setDisableConfirm(false);
    setDisableDraft(true);
  };

  const cancelDraft = () => {
    setProvince("");
    setAmphur("");
    setDistrict("");
    setSelectedOverpassTmp([]);
    setOptions([]);
    setSelectedValue([]);
    multiselectRef.current.resetSelectedValues();
    setDisableDraft(true);
    checkallOverpass.current.checked = false;
  };

  const checkedAll = (e) => {
    if (e.target.checked) {
      setProvince("");
      setAmphur("");
      setDistrict("");
      setSelectedValue([]);
      setSelectedOverpassTmp([]);
      selectProvinceRef.current.disabled = true;
      selectAmphurRef.current.disabled = true;
      selectDistrictRef.current.disabled = true;
      multiselectRef.current.disabled = true;
      setDisableDraft(false);
      getOverpassesByCond(accessToken, 0, 0, 0).then(({ status, data }) => {
        return status === 200 ? setOptionsVal(data, "") : setOptionsVal([], "");
      });
      setChecked(true);
      //checkallOverpass.current.disabled = true;
    } else {
      selectProvinceRef.current.disabled = false;
      selectAmphurRef.current.disabled = false;
      selectDistrictRef.current.disabled = false;
      setSelectedValue([]);
      setOptions([]);
      setChecked(false);
      setDisableDraft(true);
    }
  };

  const setOptionsVal = (data, type) => {
    let arr = [];
    let select = [];
    selectedOverpass.forEach((k, j) => {
      select.push(k.id);
    });
    let j = 0;
    if (type === "province") {
      data.forEach((val, i) => {
        if (select.indexOf(val.id) === -1) {
          arr[j] = val;
          arr[j].cat = val.amphurName;
          j++;
        }
      });
    } else if (type === "amphur" || type === "district" || type === "") {
      data.forEach((val, i) => {
        if (select.indexOf(val.id) === -1) {
          arr[j] = val;
          arr[j] = { ...arr[j], cat: val.districtName };
          j++;
        }
      });
    }
    setOptions(arr);
  };

  useEffect(() => {
    if (checked) {
      setSelectedValue(options);
      setSelectedOverpassTmp(options);
    }
  }, [options]);

  useEffect(() => {
    if (provinces.length === 0) {
      getMappingAddress(accessToken).then(({ status, data }) => {
        return status === 200 ? setProvinces(data) : setProvinces([]);
      });
    }
    setSelectedOverpass([]);
    if (isEdit) {
      getOverpassByGroupId(accessToken, match.params.id).then(
        ({ status, data }) => {
          formikRef.current.setFieldValue("groupName", data.groupName);
          formikRef.current.setFieldValue("groupId", data.groupId);
          formikRef.current.setFieldValue("email", data.email);
          formikRef.current.setFieldValue(
            "lineNotifyToken",
            data.lineNotifyToken
          );

          if(status === 200){
            setSelectedOverpass(data.overpasses)
            setDisableConfirm(false)
          }else{
            setSelectedOverpass([]);
          }
        }
      );
    }
    selectProvinceRef.current.disabled = false;
    selectAmphurRef.current.disabled = false;
    selectDistrictRef.current.disabled = false;
    checkallOverpass.current.disabled = false;
  }, [reload]);

  if (!isAuth) {
    return <Redirect to="/" />;
  } else if (!["SUPER_ADMIN", "ADMIN"].includes(userRole)) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Formik
      innerRef={formikRef}
      enableReinitializing={true}
      initialValues={{
        groupId: 0,
        groupName: "",
        overpasses: {},
        lineNotifyToken: "",
        email: ""
      }}
      validationSchema={schema}
      onSubmit={handleAdd}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
      }) => (
        <>
          <CForm onSubmit={handleSubmit} noValidate name="addUserForm">
            <CRow>
              <CCol>
                <CCard>
                  <CCardHeader>
                    <h5>จับกลุ่มสะพานลอย</h5>
                  </CCardHeader>
                  <CCardBody>
                    <CRow>
                      <CCol>
                        <CFormGroup>
                          <CLabel htmlFor="groupName">ชื่อกลุ่ม</CLabel>

                          <CInput
                            id="groupName"
                            name="groupName"
                            valid={!!values.groupName}
                            invalid={touched.groupName && !!errors.groupName}
                            value={values.groupName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <CInvalidFeedback>
                            {errors.groupName}
                          </CInvalidFeedback>
                        </CFormGroup>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol xs={12} md={4} lg={4}>
                        <CFormGroup>
                          <CLabel htmlFor="province">จังหวัด</CLabel>
                          <CSelect
                            custom
                            name="province"
                            id="province"
                            onChange={selectProvince}
                            value={province}
                            innerRef={selectProvinceRef}
                          >
                            <option value="">-- Please Select --</option>
                            {provinces.map((province) => (
                              <option key={province.key} value={province.key}>
                                {capitalize(province.value.toLowerCase())}
                              </option>
                            ))}
                          </CSelect>
                        </CFormGroup>
                      </CCol>
                      <CCol xs={12} md={4} lg={4}>
                        <CFormGroup>
                          <CLabel htmlFor="amphur">อำเภอ/เขค</CLabel>
                          <CSelect
                            custom
                            name="amphur"
                            id="amphur"
                            value={amphur}
                            onChange={selectAmphur}
                            innerRef={selectAmphurRef}
                          >
                            <option value="">-- Please Select --</option>
                            {amphurs.map((amphur) => (
                              <option key={amphur.key} value={amphur.key}>
                                {capitalize(amphur.value)}
                              </option>
                            ))}
                          </CSelect>
                        </CFormGroup>
                      </CCol>
                      <CCol xs={12} md={4} lg={4}>
                        <CFormGroup>
                          <CLabel htmlFor="district">ตำบล/แขวง</CLabel>
                          <CSelect
                            custom
                            name="district"
                            id="district"
                            value={district}
                            onChange={selectDistrict}
                            innerRef={selectDistrictRef}
                          >
                            <option value="">-- Please Select --</option>
                            {districts.map((district) => (
                              <option key={district.key} value={district.key}>
                                {capitalize(district.value)}
                              </option>
                            ))}
                          </CSelect>
                        </CFormGroup>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol>
                        <CFormGroup>
                          <CSwitch
                            className="mr-1"
                            color="success"
                            id="checkallOverpass"
                            defaultChecked={false}
                            shape="pill"
                            innerRef={checkallOverpass}
                            onChange={(e) => {
                              checkedAll(e);
                            }}
                          />
                          <CLabel
                            variant="checkbox"
                            htmlFor="radio1"
                            style={{ position: "absolute", marginLeft: "10px" }}
                          >
                            เลือกทั้งหมด
                          </CLabel>
                        </CFormGroup>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol>
                        <CFormGroup>
                          <CLabel htmlFor="id">สะพานลอย</CLabel>
                          <Multiselect
                            options={options} // Options to display in the dropdown
                            selectedValues={selectedValue} // Preselected value to persist in dropdown
                            onSelect={onSelect} // Function will trigger on select event
                            onRemove={onRemove} // Function will trigger on remove event
                            displayValue="name" // Property name to display in the dropdown options
                            multiple={true}
                            hidePlaceholder={true}
                            groupBy="cat"
                            closeOnSelect={false}
                            showCheckbox={true}
                            ref={multiselectRef}
                          />
                        </CFormGroup>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol xs={12} md={6} lg={6}>
                        <CFormGroup>
                          <CLabel htmlFor="lineNotifyToken">
                            Line Notify Token
                          </CLabel>

                          <CInput
                            id="lineNotifyToken"
                            name="lineNotifyToken"
                            valid={!!values.lineNotifyToken}
                            invalid={
                              touched.lineNotifyToken &&
                              !!errors.lineNotifyToken
                            }
                            value={values.lineNotifyToken}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <CInvalidFeedback>
                            {errors.lineNotifyToken}
                          </CInvalidFeedback>
                        </CFormGroup>
                      </CCol>
                      <CCol xs={12} md={6} lg={6}>
                        <CFormGroup>
                          <CLabel htmlFor="email">
                            Email
                          </CLabel>

                          <CInput
                            id="email"
                            name="email"
                            valid={!!values.email}
                            invalid={
                              touched.email &&
                              !!errors.email
                            }
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <CInvalidFeedback>
                            {errors.email}
                          </CInvalidFeedback>
                        </CFormGroup>
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol>
                        <CButton
                          type="button"
                          className="btn-github btn-brand mr-1 mb-1 btn btn-xl"
                          onClick={clickDraft}
                          disabled={disableDraft}
                        >
                          Draft
                        </CButton>
                        <CButton
                          type="button"
                          className="btn btn-secondary mr-1 mb-1 btn-xl"
                          onClick={cancelDraft}
                        >
                          Cancel
                        </CButton>
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
            <CRow>
              <CCol>
                <CCard>
                  <CCardBody>
                    <CRow>
                      <CCol xs="12">
                        <CDataTable
                          items={selectedOverpass}
                          fields={[
                            { key: "id", label: "ID", filter: false },
                            {
                              key: "name",
                              label: "ชื่อสะพานลอย",
                              filter: false,
                            },
                            {
                              key: "location",
                              label: "สถานที่",
                              filter: false,
                            },
                            {
                              key: "districtName",
                              label: "แขวง/ตำบล",
                              filter: false,
                            },
                            {
                              key: "amphurName",
                              label: "เขต/อำเภอ",
                              filter: false,
                            },
                            {
                              key: "provinceName",
                              label: "จังหวัด",
                              filter: false,
                            },
                            { key: "delete", label: "ลบ", filter: false },
                          ]}
                          scopedSlots={{
                            delete: (item) => (
                              <td>
                                <CButton
                                  size="sm"
                                  className="btn-youtube btn-brand mr-1 mb-1"
                                  onClick={() => clickRemove(item.id)}
                                >
                                  <CIcon size="sm" name="cil-trash" />
                                </CButton>
                              </td>
                            ),
                          }}
                          bordered
                          itemsPerPage={5}
                          pagination
                        />
                      </CCol>
                    </CRow>
                    <CRow>
                      <CCol>
                        <CButton
                          type="submit"
                          className="mr-1 mb-1 btn btn-xl"
                          color="primary"
                          disabled={disableConfirm}
                        >
                          Submit
                        </CButton>
                        <CButton
                          type="button"
                          className="btn btn-secondary mr-1 mb-1 btn-xl"
                          onClick={() => {
                            setReload(reload ? false : true);
                          }}
                        >
                          Cancel
                        </CButton>
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </CForm>
        </>
      )}
    </Formik>
  );
};

export default MappingForms;
