import React, { useState, useEffect, useRef } from "react";
import {
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
  CInput,
  CFormGroup,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import OverpassAddEdit from "./OverpassAddEdit";
import { deleteOverpass, getOverpasses } from "src/services/OverpassService";
import { LOGIN_FAILED_CODE } from "src/config";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { getMappingAddress, getStatuses } from "src/services/CommonService";
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
  const [location, setLocation] = useState("");
  const [amphur, setAmphur] = useState("");
  const [district, setDistrict] = useState("");
  const [statuses, setStatuses] = useState([]);
  const [province, setProvince] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [sorterValue, setSorterValue] = useState();
  const [itemDetail, setItemDetail] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [amphurs, setAmphurs] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [deleteOverpassName, setDeleteOverpassName] = useState("");
  const [deleteId, setDeleteId] = useState("");

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
    } else {
      setItemDetail({});
    }
  };

  const showDeleteModal = (item) => {
    setId(item.id);
    setDeleteOverpassName(item.name);
    setDeleteModal(!deleteModal);
  };

  const handleClosedModal = () => {
    setDeleteModal(false);
  };

  const handleReset = () => {
    console.log("xxxxx")
    setProvince("");
    setAmphur("");
    setDistrict("");
    setName("");
  };

  const handleSearch = (reload = false) => {
    setLoading(true);
    let body = {
      page,
      limit: itemsPerPage,
      filter: {
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

  const handleDeleteOverpass = () => {
    setDeleteLoading(true);
    deleteOverpass(accessToken, id).then((response) => {
      if (response.status === 200) {
        setDeleteLoading(false);
        MySwal.fire({
          title: "Success",
          text: "ลบสะพานลอยสำเร็จ  ",
          icon: "success",
          didClose: () => {
            setDeleteModal(false);
            handleSearch(true);
          },
        });
      } else {
        setDeleteLoading(false);
        MySwal.fire({
          title: "Failed",
          text: "ไม่สามารถลบสะพานลอยได้ เนื่องจากมีกลุ่มผูกกับสะพานลอยนี้อยู่",
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
    setAmphurs(
      provinces.find((val) => {
        return val.key == id;
      }).amphur
    );
    setDistricts([]);
    setProvince(id);
  };

  const selectAmphur = (e) => {
    let id = e.target.value;
    setDistricts(
      amphurs.find((val) => {
        return val.key == id;
      }).district
    );
    setAmphur(id);
  };

  useEffect(
    () => {
      if (provinces.length === 0) {
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
    },
    [
      /*page, itemsPerPage, sorterValue*/
    ]
  );

  if (!isAuth) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <CRow>
        <CCol xs={6} md={6} lg={6}>
          <h2>ข้อมูลสะพานลอย</h2>
        </CCol>
        <CCol
          xs={6}
          md={6}
          lg={6}
          className="d-block d-sm-flex align-items-right justify-content-end mb-4"
        >
          <CButton color="primary" onClick={() => showModal("add")}>
            <CIcon size="sm" name="cil-user-plus" className=" mr-1" />
            เพิ่มสะพานลอย
          </CButton>
        </CCol>
      </CRow>
      <CRow className="justify-content-center">
        <CCol>
          <CCard>
            <CCardBody>
              <CRow>
                <CCol className="mb-3 font-weight-bold">
                  <h4>ค้นหา</h4>
                </CCol>
              </CRow>
              <CRow>
                <CCol xs={12} md={3} lg={3} sm="12">
                  <CFormGroup>
                    <CLabel htmlFor="name">ชื่อสะพานลอย:</CLabel>
                    <CInput
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </CFormGroup>
                </CCol>
                <CCol xs={12} md={3} lg={3} sm="12">
                  <CFormGroup>
                    <CLabel htmlFor="province">จังหวัด</CLabel>
                    <CSelect
                      custom
                      name="province"
                      id="province"
                      onChange={selectProvince}
                      value={province}
                    >
                      <option value="">All</option>
                      {provinces.map((province) => (
                        <option key={province.key} value={province.key}>
                          {capitalize(province.value.toLowerCase())}
                        </option>
                      ))}
                    </CSelect>
                  </CFormGroup>
                </CCol>
                <CCol xs={12} md={3} lg={3} sm="12">
                  <CFormGroup>
                    <CLabel htmlFor="amphur">อำเภอ/เขต</CLabel>
                    <CSelect
                      custom
                      name="amphur"
                      id="amphur"
                      value={amphur}
                      onChange={selectAmphur}
                    >
                      <option value="">All</option>
                      {amphurs.map((amphur) => (
                        <option key={amphur.key} value={amphur.key}>
                          {capitalize(amphur.value)}
                        </option>
                      ))}
                    </CSelect>
                  </CFormGroup>
                </CCol>
                <CCol xs={12} md={3} lg={3} sm="12">
                  <CFormGroup>
                    <CLabel htmlFor="district">ตำบล/แขวง</CLabel>
                    <CSelect
                      custom
                      name="district"
                      id="district"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                    >
                      <option value="">All</option>
                      {districts.map((district) => (
                        <option key={district.key} value={district.key}>
                          {capitalize(district.value)}
                        </option>
                      ))}
                    </CSelect>
                  </CFormGroup>
                </CCol>
              </CRow>
              <CCol className="mt-3 d-block d-sm-flex justify-content-end">
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
        <CCol>
          <CCard>
            <CCardBody>
              <CDataTable
                loading={loading}
                items={items}
                fields={[
                  {
                    key: "id",
                    label: "ID",
                  },
                  {
                    key: "name",
                    label: "ชื่อสะพานลอย",
                  },
                  {
                    key: "location",
                    label: "สถานที่",
                  },
                  {
                    key: "districtName",
                    label: "ตำบล/แขวง",
                  },
                  {
                    key: "amphurName",
                    label: "อำเภอ/เขค",
                  },
                  {
                    key: "provinceName",
                    label: "จังหวัด",
                  },
                  {
                    key: "status",
                    label: "สถานะ",
                  },
                  {
                    key: "action",
                    label: "",
                    _style: { width: "1%" },
                    filter: false,
                  },
                ]}
                hover
                itemsPerPage={itemsPerPage}
                // clickableRows
                // onRowClick={(item) => history.push(`/users/${item.id}`)}

                scopedSlots={{
                  action: (item) => (
                    <td className="py-2">
                      <CButtonGroup className="mr-2">
                        <CButton
                          size="sm"
                          className="btn-github btn-brand mr-1 mb-1"
                          onClick={() => showModal("edit", item)}
                        >
                          <CIcon size="sm" name="cil-pencil" />
                        </CButton>
                        <CButton
                          size="sm"
                          className="btn-youtube btn-brand mr-1 mb-1"
                          onClick={() => showDeleteModal(item)}
                        >
                          <CIcon size="sm" name="cil-trash" />
                        </CButton>
                      </CButtonGroup>
                    </td>
                  ),
                  districtName: (item) => (
                      <td>{(item.districtName === null || item.districtName === 'null') ? "" : item.districtName}</td>
                  ),
                  location: (item) => (
                    <td>{(item.location === null || item.location === 'null') ? "" : item.location}</td>
                )
  
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
                handleReset={handleReset}
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
                  <h5>คุณต้องการลบ ?</h5>
                </CModalHeader>
                <CModalBody>
                  ลบสะพานลอย <strong>{deleteOverpassName}</strong>
                </CModalBody>
                <CModalFooter>
                  <CButton color="light" onClick={handleClosedModal}>
                    Cancel
                  </CButton>
                  <CButton
                    color="danger"
                    onClick={() => {handleDeleteOverpass()}}
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
