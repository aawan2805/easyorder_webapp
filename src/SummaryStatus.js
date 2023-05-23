import React, { useState, useEffect } from 'react';
import { Col, Row, Card, Button, FloatButton, message, Spin, Alert } from 'antd';
import { PlusOutlined, ShoppingCartOutlined, CloseCircleOutlined } from '@ant-design/icons';
import {connect} from 'react-redux';

import { useSelector, useDispatch } from 'react-redux'
import { addOne, reset } from './store/actions/order.actions'
import { v4 as uuidv4 } from 'uuid';

import { save } from "./orderSlice";
import { Layout, Menu, Descriptions } from 'antd';
import { LaptopOutlined, NotificationOutlined, UserOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Space, Table, Tag, Divider } from 'antd';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { API_URL, getBrand, getCollectionCode, removeBrand, removeCollectionCode } from './helper.js';
import { SmileOutlined } from '@ant-design/icons';
import { Result, Typography } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

const { Meta } = Card;
const { Content, Sider } = Layout;



function SummaryStatus({dishes, brand_uuid}) {
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    const [loadingData, setLoadingData] = useState(false);
    const [apiFetchError, setApiFetchError] = useState(false);
    const [WSError, setWSError] = useState(false);
    const [order, setOrder] = useState({});

    const dispatch = useDispatch();
    const state = useSelector(state => state)
    const { Paragraph, Text } = Typography;

    useEffect(() => {
        if(getCollectionCode() === null || getCollectionCode() === undefined) {
            navigate("/")
        }
        if(getCollectionCode() !== null && getCollectionCode() !== undefined) {
            connect_to_ws(getCollectionCode());
            checkOrderStatus();
            updateOrderStatus();
        }
    }, [order.order_status])

    const checkOrderStatus = async () => {
      try {
        const collection_code = getCollectionCode();
        const response = await axios.get(`${API_URL}/check-order-status/${collection_code}`);
        if(response.data.remove_token === true) {
          console.log("DELETING TOKEN...")
          removeCollectionCode();
          removeBrand();
          navigate("/")
        }
      } catch(e) {
        console.log(e)
      }
    }

    const connect_to_ws = (collection_code) => {
        const chatSocket = new WebSocket(`wss://rocket-order.com/orders/client/${collection_code}`);

        chatSocket.onopen = function(e) {
            setWSError(false);
            console.log("Successfully connected to the WebSocket.");
        }

        chatSocket.onclose = function(e) {
            // Refresh page.
            console.log("WebSocket connection closed unexpectedly. Trying to reconnect in 2s...");
        };

        chatSocket.onmessage = function(e) {
          try {
            let data = JSON.parse(e.data)
            if(data.status === '3' || data.status === 3 || data.status === '0' || data.status === 0 || data.status === '4' || data.status === 4) {
              setOrder(prev => ({
                ...prev,
                order_status: Number(data.status)
              }))
            }
          } catch(e) {
            console.log(e)
          }
        };

        chatSocket.onerror = function(err) {
            setWSError(true);
            chatSocket.close();
        }
    }

    const updateOrderStatus = async () => {
        setLoadingData(true);

        try {
            const collection_code = getCollectionCode();
            const response = await axios.get(`${API_URL}/summary-order-status/${collection_code}`)
            console.log(response.data)
            setOrder(response.data)
        } catch (error) {
            setApiFetchError(true)
        }

        setLoadingData(false);
    }

    const getOrderCard = (status) => {
        if(status === 1){
            return (
                <Result
                status="success"
                title="Successfully Purchased Cloud Server ECS!"
                subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
                extra={[
                  <Button type="primary" key="console">
                    Go Console
                  </Button>,
                  <Button key="buy">Buy Again</Button>,
                ]}
              />
            );
        }
    }

  // const { dishes } = useSelector(state=>state)
    return (
        <>
            {contextHolder}
            {apiFetchError === true
                ?
                    <Alert message="We couldn't retrieve the order's data. Try again refreshing the page." type="error" showIcon closable />
                :
                null
            }
            {WSError === true
                ?
                    <Alert message="You won't recieve live notifications. Please try refreshing the page." type="warning" showIcon closable />
                :
                    <Alert message="All set up for notifications." type="success" showIcon closable />
            }

            {loadingData
                ?
                    <Row>
                        <Col span={12} offset={12}>
                            <Spin tip="Loading data..." size="large"></Spin>
                        </Col>
                    </Row>
                :
                    <>
                        {(Object.keys(order).length > 0  && order.order_status === 0) ? (
                            <div>
                              <Result
                                  key={uuidv4()}
                                  status="success"
                                  title="Preparing order."
                                  subTitle={`Successfully placed the order and payed. Collectiin number is ${getCollectionCode()}`}
                                  extra={[]}
                              >
                                  <div className="desc">
                                      {order.dishes.map(dish => (
                                            <Descriptions title={`${dish.dish__name} | ${dish.dish__price}`} key={uuidv4()}>
                                              <Descriptions.Item label="" key={uuidv4()}>
                                                {dish.exclude_ingredients.map(ing => (
                                                  <>
                                                  <CloseCircleOutlined key={uuidv4()} style={{ color: 'red' }} className="site-result-demo-error-icon" key={uuidv4()} /> {ing}
                                                  </>
                                                ))}
                                              </Descriptions.Item>
                                            </Descriptions>
                                      ))}
                                  </div>
                              </Result>
                            </div>
                        ) : (Object.keys(order).length > 0  && order.order_status === 3) ? (
                          <div>
                            <Result
                                key={uuidv4()}
                                status="success"
                                title="Order ready for COLLECTION."
                                subTitle={`Please collect your order ${getCollectionCode()}`}
                                extra={[]}
                            >
                                <div className="desc">
                                    {order.dishes.map(dish => (
                                          <Descriptions title={dish.dish__name} key={uuidv4()}>
                                            <Descriptions.Item label="" key={uuidv4()}>
                                              {dish.exclude_ingredients.map(ing => (
                                                <>
                                                <CloseCircleOutlined key={uuidv4()} style={{ color: 'red' }} className="site-result-demo-error-icon" key={uuidv4()} /> {ing}
                                                </>
                                              ))}
                                            </Descriptions.Item>
                                          </Descriptions>
                                    ))}
                                </div>
                            </Result>
                          </div>
                        ) : (
                            <p>Neither condition is true</p>
                        )}
                    </>
            }
        </>
    );
}

const goBackFloatButton = () => {

}

const mapStateToProps = (state) => {
    return {
        dishes: state
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getDishes: () => { dispatch() }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SummaryStatus);
