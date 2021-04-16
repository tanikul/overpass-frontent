import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CListGroup,
  CListGroupItem,
  CRow,
  CLink,
} from '@coreui/react'
import 
    { getOverpassStatusByGroupId }
   from "src/services/OverpassService";
import { useDispatch, useSelector } from "react-redux";
import Pagination from '@material-ui/lab/Pagination';
import Moment from "react-moment";

import { Redirect } from "react-router-dom";
import { redirect } from "../../actions/redirect";
import { useHistory } from "react-router-dom";

const Repairs = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const isAuth = useSelector((state) => state.authen.isAuth);
    const accessToken = useSelector((state) => state.authen.access_token);
    const overpassGroup = useSelector((state) => state.authen.overpassGroup);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(1);
    const [dataAll, setDataAll] = useState([]);
    const [dataPage, setDataPage] = useState([]);
    const limit = 20;

    const handleChange = (event, value) => {
        setPage(value);
        setupData(value);
    };

    const setupData = (page) => {
        if(dataAll.length > 0){
            let arr = [];
            let j = ((page * limit) >= dataAll.length) ? dataAll.length : page * limit;
            console.log(j);
            for(let i = (page - 1) * limit ; i < j; i++){
                arr[arr.length] = dataAll[i];
            }
            setDataPage(arr);
        }
    }

    const getoDetail = (id) => {
        dispatch(redirect(`/repairs/${id}` ));
        history.push({
          pathname: `/repairs/${id}`
        })
    }

    useEffect(() => { 
        setupData(1);
    }, [dataAll])

    useEffect(() => {
 
        getOverpassStatusByGroupId(accessToken, overpassGroup).then(({ status, data }) => {
          if(status === 200){
              setCount(Math.ceil(data.length / limit));
              setDataAll(data);
          }
        });
    }, []);
    if (!isAuth) {
        return <Redirect to="/" />;
      } 
    return (
        <CRow>
        <CCol sm="12" xl="12">

        <CCard>
        <CCardHeader>
            รายการแจ้งซ่อม
        </CCardHeader>
        <CCardBody>

            <CListGroup>
                {dataPage.map((value, index) => {
                    return <CListGroupItem action  key={'g-' + index}>
               
                            <h5 className="d-flex w-100 justify-content-between">
                            
                            <CLink
                              onClick={() => getoDetail(value.id)}
                              className={(value.status === 'OFF') ? "text-danger" : "text-warning"} 
                            >{value.topic}</CLink>
                            </h5>
                            <small>{value.effectiveDate}</small>
                            
                            <div className="mb-1">
                            <b>สถานที่</b>: {value.locationDisplay}
                            </div>
                            
                            <div className="mb-1" style={{display: (value.location !== "" && value.location !== null) ? "" : "none"}}>
                            <b>Note</b>: {value.location}
                            </div>
                            <div className="mb-1">
                            <b>วันเวลาที่ได้รับแจ้ง</b>: <Moment format="DD/MM/YYYY HH:mm:ss">{value.effectiveDate}</Moment>
                            </div>
                        </CListGroupItem>
                    
                })}
                
               
            </CListGroup>
            <div style={{marginTop: "10px"}}>
            <Pagination count={count} page={page} onChange={handleChange} />
            </div>
        </CCardBody>
        </CCard>
        </CCol>
        </CRow>
    );
}
export default Repairs