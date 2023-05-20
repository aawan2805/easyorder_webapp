import {QrScanner} from '@yudiel/react-qr-scanner';
import React, { useState, useEffect } from 'react';
import { getBrand, getCollectionCode} from './helper.js';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { API_URL } from './helper.js';
import { Alert, Space, Col, Row, message } from 'antd';

const Scan = () => {
    // Check if there is a collection code already in localStorage
      // If not, check if qr is valid against the API and store the qr to localStorage
    
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [errorShowing, setErrorShowing] = useState(false);
    const [axiosMessage, setAxiosMessage] = useState(null);

    const displayError = (type, message) => {
      if(!errorShowing) {
        setErrorShowing(true);
        messageApi.open({
          type: type,
          content: message,
          onClose: () => {
            setErrorShowing(false);
          }
        });
      }
    };

    useEffect(() => {
      console.log(getCollectionCode())
      if(getCollectionCode() !== null && getCollectionCode() !== undefined) {
        checkCollectionCodeStatus(getCollectionCode());
      }
    }, [])

    const checkCollectionCodeStatus = async (collection_code) => {
        await axios.get(`${API_URL}/check-order-status/${collection_code}`)
        .then(res => res.data)
        .then(
          (result) => {
            if(result.remove_token === false){
              navigate("/orderStatus");
            } else {
              // Remove token from localStorage
              localStorage.removeItem("collection_code");
            }
          },
          (error) => {
            console.log(error);
          }
        )
    }

    const newScan = async (qr) => {
      // Check if the code is valid.
      const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      }
      await axios.get(`${API_URL}/check-qr/${qr}`)
      .then(res => res.data)
      .then(
        (result) => {
          if(result.qr_ok === true) {
            // Store the qr code in localStorage
            localStorage.setItem("brand_uuid", qr)
            navigate("/home");
          } else {
            displayError("error", "Qr is invalid.");
          }
        },
        (error) => {
          setAxiosMessage(error)
          console.log(error)
          displayError("error", "Not a valid QR.");
        }
      )
    }

    return (
      <>
        {contextHolder}
        <Row>
          <Col span={20} offset={2}>
            {/* <Alert message="Success Tips" type="success" showIcon /> */}
          </Col>
        </Row>
        <Row>
          <Col span={20} offset={2}>
            <QrScanner
                constraints={{
                  facingMode: 'environment'
                }}
                style={{ width: '100%' }}
                key="environment"
                onDecode={(result) => newScan(result)}
                onError={(err) => {
                  console.log(err);
                  displayError("error", "Error occured, please try again.")
                }}
                />
          </Col>
        </Row>
      </>
    );
}

export default Scan;