import React, { useState, useEffect, useRef } from "react";
import {
  CBadge,
  CCard,
  CCardBody,
  CCol,
  CDataTable,
  CRow,
  CPagination,
  CButton,
  CButtonGroup,
  CForm,
  CLabel,
  CSelect,
  CTooltip,
  CLink,
  CInput,
  CFormGroup,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
} from "@coreui/react";
import { TextMask, InputAdapter } from "react-text-mask-hoc";
import CIcon from "@coreui/icons-react";
import OverpassAddEdit from "./OverpassAddEdit";
import { deleteOverpass, getOverpasses } from "src/services/OverpassService";
import { LOGIN_FAILED_CODE, roleUserControl, userFullAccess } from "src/config";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  getMappingAddress,
  getStatuses
} from "src/services/CommonService";
import { capitalize } from "src/utils/common";
import { setLoginExpired } from "src/actions/authen";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "spinkit/spinkit.min.css";
import "./OverpassAddEdit.scss";

const MySwal = withReactContent(Swal);

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const Overpasses = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.authen.isAuth);
  const accessToken = useSelector((state) => state.authen.access_token);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [modal, setModal] = useState(false);
  const [action, setAction] = useState("add");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [items, setItems] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [id, setId] = useState("");
  const prevUsername = usePrevious(id);
  const [name, setName] = useState("");
  const [setpointWatt, setSetpointWatt] = useState("");
  const [status, setStatus] = useState("");
  const [minWatt, setMinWatt] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longtitude, setLongTitude] = useState("");
  const [location, setLocation] = useState("");
  const [amphur, setAmphur] = useState("");
  const [district, setDistrict] = useState("");
  const [statuses, setStatuses] = useState([]);
  const [province, setProvince] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [postcode, setPostcode] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [sorterValue, setSorterValue] = useState();
  const [itemDetail, setItemDetail] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [amphurs, setAmphurs] = useState([]);
  const [districts, setDistricts] = useState([]);

  const pageChange = (newPage) => {
    if (newPage - 1 >= 0 && page !== newPage - 1) {
      setPage(newPage - 1);
    }
  };
  const showModal = (action, item) => {
    setAction(action);
    setModal(!modal);
    if (action === "edit") {
      setItemDetail(item);
    }else{
      setItemDetail({});
    }
  };

  const showDeleteModal = (item) => {
    setId(item.id);
    setDeleteModal(!deleteModal);
  };

  const handleClosedModal = () => {
    //setUserId("");
    //setUsername("");
    setDeleteModal(false);
  };

  const handleReset = () => {
    /*setUsername("");
    setFirstName("");
    setLastName("");
    setStatus("");
    setRole("");
    setEmail("");
    setLineId("");
    setMobileNo("");*/
  };

  const handleSearch = (e, reload = false) => {
    setLoading(true);
    let body = {
      page,
      limit: itemsPerPage,
      filter: {
        id: reload ? prevUsername : id,
        name,
        location,
        district,
        amphur,
        province,
      },
    };

    if (sorterValue && Object.keys(sorterValue).length !== 0) {
      const { column, asc } = sorterValue;
      body = { ...body, sort: column, order: asc ? "asc" : "desc" };
    }

    getOverpasses(accessToken, body).then((users) => {
      if (users.code && users.code === LOGIN_FAILED_CODE) {
        dispatch(setLoginExpired());
        return;
      }
      setItems(users.data);
      setItemsPerPage(itemsPerPage);
      setTotalRecords(Number(users.totalRecords));
      setLoading(false);
    });
  };

  const handleDeleteOverpass = (e) => {
    setDeleteLoading(true);
    deleteOverpass(accessToken, id).then((response) => {
      if (response.status === 200) {
        setDeleteLoading(false);
        MySwal.fire({
          title: "Success",
          text: "Deleted user successfully  ",
          icon: "success",
          didClose: () => {
            setDeleteModal(false);
            handleSearch(e, true);
          },
        });
      } else {
        setDeleteLoading(false);
        MySwal.fire({
          title: "Failed",
          text: "Cannot delete user",
          icon: "error",
          didClose: () => {
            setDeleteModal(false);
          },
        });
      }
    });
  };

  const selectProvince = (e) => {
    let id = e.target.value;
    setAmphurs(provinces.find((val) => { return val.key == id }).amphur);
    setDistricts([]);
    setProvince(id);
  };

  const selectAmphur = (e) => {
    let id = e.target.value;
    setDistricts(amphurs.find((val) => { return val.key == id }).district);
    setAmphur(id);
  };

  useEffect(() => {

    if(provinces.length === 0){
      getMappingAddress(accessToken).then(({ status, data }) => {
        return status === 200 ? setProvinces(data) : setProvinces([]);
      });
    }
    getStatuses(accessToken).then(({ status, data }) => {
      return status === 200 ? setStatuses(data) : setStatuses([]);
    });
    setLoading(true);
    let body = {
      page,
      limit: itemsPerPage,
      setpointWatt,
    };
    if (sorterValue && Object.keys(sorterValue).length !== 0) {
      const { column, asc } = sorterValue;
      body = { ...body, sort: column, order: asc ? "asc" : "desc" };
    }

    getOverpasses(accessToken, body).then((users) => {
      if (users.code && users.code === LOGIN_FAILED_CODE) {
        dispatch(setLoginExpired());
        return;
      }
      setItems(users.data);
      setItemsPerPage(itemsPerPage);
      setTotalRecords(Number(users.totalRecords));
      setLoading(false);
    });
  }, [/*page, itemsPerPage, sorterValue*/]);

  if (!isAuth) {
    return <Redirect to="/" />;
  } 
  
  return (
    <>
      <CRow>
        <CCol xs={6} className="mb-3 d-flex align-items-center">
          <h2>Overpass</h2>
        </CCol>
        <CCol
          xs={6}
          className="d-block d-sm-flex align-items-center justify-content-end mb-4"
        >
          <CButton color="primary" onClick={() => showModal("add")}>
            <CIcon size="sm" name="cil-user-plus" className=" mr-1" />
            Add Overpass
          </CButton>
        </CCol>
      </CRow>
      <CRow className="justify-content-center">
        <CCol xs={12} md={12} xl={12}>
          <CCard>
            <CCardBody>
              <CRow>
                <CCol xs={12} className="mb-3 font-weight-bold">
                  SEARCH
                </CCol>
              </CRow>
              <CRow>
                <CCol xs={6} md={4} lg={3}>
                  <CFormGroup>
                    <CLabel htmlFor="id">Id:</CLabel>
                    <CInput
                      id="id"
                      placeholder="id"
                      value={id}
                      onChange={(e) => setId(e.target.value)}
                    />
                  </CFormGroup>
                </CCol>
                <CCol xs={6} md={4} lg={3}>
                  <CFormGroup>
                    <CLabel htmlFor="name">Name:</CLabel>
                    <CInput
                      id="name"
                      placeholder="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </CFormGroup>
                </CCol>
                <CCol xs={6} md={4} lg={3}>
                  <CFormGroup>
                    <CLabel htmlFor="province">Province</CLabel>
                    <CSelect
                      custom
                      name="province"
                      id="province"
                      onChange={selectProvince}
                      value={province}
                    >
                      <option value=""></option>
                      {provinces.map((province) => (
                        <option key={province.key} value={province.key}>
                          {capitalize(province.value.toLowerCase())}
                        </option>
                      ))}
                    </CSelect>
                  </CFormGroup>
                </CCol>
                <CCol xs={6} md={4} lg={3}>
                  <CFormGroup>
                    <CLabel htmlFor="amphur">Amphur</CLabel>
                    <CSelect
                      custom
                      name="amphur"
                      id="amphur"
                      value={amphur}
                      onChange={selectAmphur}
                    >
                      <option value=""></option>
                      {amphurs.map((amphur) => (
                        <option key={amphur.key} value={amphur.key}>
                          {capitalize(amphur.value)}
                        </option>
                      ))}
                    </CSelect>
                  </CFormGroup>
                </CCol>
                <CCol xs={6} md={4} lg={3}>
                  <CFormGroup>
                    <CLabel htmlFor="district">District</CLabel>
                    <CSelect
                      custom
                      name="district"
                      id="district"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                    >
                      <option value=""></option>
                      {districts.map((district) => (
                        <option key={district.key} value={district.key}>
                          {capitalize(district.value)}
                        </option>
                      ))}
                    </CSelect>
                  </CFormGroup>
                </CCol>
              </CRow>
              <CCol
                xs={12}
                className="mt-3 d-block d-sm-flex justify-content-end"
              >
                <CFormGroup>
                  <CButton
                    variant="outline"
                    color="secondary"
                    className="px-4 text-black-50"
                    onClick={handleReset}
                  >
                    Reset
                  </CButton>
                  <CButton
                    variant="outline"
                    color="primary"
                    className="ml-3 px-3"
                    onClick={handleSearch}
                  >
                    Search
                    <CIcon size="sm" name="cil-search" className="ml-2" />
                  </CButton>
                </CFormGroup>
              </CCol>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol xl={12}>
          <CCard>
            <CCardBody>
              <CDataTable
                loading={loading}
                items={items}
                fields={[
                  "id",
                  "name",
                  "location",
                  "districtName",
                  "amphurName",
                  "provinceName",
                  "postcode",
                  {
                    key: "action",
                    label: "",
                    _style: { width: "1%" },
                    filter: false,
                  },
                ]
                }
                hover
                itemsPerPage={itemsPerPage}
                // clickableRows
                // onRowClick={(item) => history.push(`/users/${item.id}`)}

                scopedSlots={{
                  action: (item) => (
                    <td className="py-2">
                      <CButtonGroup className="mr-2">
                        <CTooltip content="Edit">
                          <CLink
                            size="sm"
                            className="mr-3"
                            onClick={() => showModal("edit", item)}
                          >
                            <CIcon
                              size="sm"
                              name="cil-pencil"
                              className="text-dark"
                            />
                          </CLink>
                        </CTooltip>
                        <CTooltip content="Delete">
                          <CLink
                            size="sm"
                            className="mr-2"
                            onClick={() => showDeleteModal(item)}
                          >
                            <CIcon
                              size="sm"
                              name="cil-trash"
                              className="text-dark"
                            />
                          </CLink>
                        </CTooltip>
                      </CButtonGroup>
                    </td>
                  ),
                }}
                sorter
                sorterValue={sorterValue}
                onSorterValueChange={setSorterValue}
              />
              <CRow>
                <CCol xs={12} md={6}>
                  <CForm inline className="mt-2">
                    <CLabel className="mr-2">Show</CLabel>{" "}
                    <CSelect
                      size="sm"
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    >
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                    </CSelect>
                    <CLabel className="ml-2">entries</CLabel>
                  </CForm>
                </CCol>
                <CCol xs={12} md={6}>
                  <CPagination
                    activePage={page + 1}
                    onActivePageChange={pageChange}
                    pages={Math.ceil(totalRecords / itemsPerPage)}
                    doubleArrows={false}
                    align="end"
                  />
                </CCol>
              </CRow>
              <OverpassAddEdit
                action={action}
                modal={modal}
                setModal={setModal}
                itemDetail={itemDetail}
                reloadData={handleSearch}
                provinces={provinces}
                amphurs={[]}
                districts={[]}
                statuses={statuses}
              />
              <CModal
                centered
                show={deleteModal}
                closeOnBackdrop={false}
                onClosed={handleClosedModal}
              >
                {deleteLoading && (
                  <div className={deleteLoading ? "spinner-container" : ""}>
                    <div className="position-absolute spinner-center">
                      <div className="sk-grid mx-auto">
                        <div className="sk-grid-cube"></div>
                        <div className="sk-grid-cube"></div>
                        <div className="sk-grid-cube"></div>
                        <div className="sk-grid-cube"></div>
                        <div className="sk-grid-cube"></div>
                        <div className="sk-grid-cube"></div>
                        <div className="sk-grid-cube"></div>
                        <div className="sk-grid-cube"></div>
                        <div className="sk-grid-cube"></div>
                      </div>
                      <div className="text-center">Loading....</div>
                    </div>
                  </div>
                )}
                <CModalHeader>
                  <h5>Are you sure to delete user?</h5>
                </CModalHeader>
                <CModalBody>
                  Deleting overpass <strong>{id}</strong> will permanently
                  delete, this process cannot be recovered.
                </CModalBody>
                <CModalFooter>
                  <CButton color="light" onClick={handleClosedModal}>
                    Cancel
                  </CButton>
                  <CButton
                    color="danger"
                    onClick={handleDeleteOverpass}
                    disabled={deleteLoading}
                  >
                    Confirm
                  </CButton>{" "}
                </CModalFooter>
              </CModal>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default Overpasses;
