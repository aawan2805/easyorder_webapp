import React, { useState, useEffect } from 'react';
import { Col, Row, Card, Button, FloatButton, message, Spin } from 'antd';
import { PlusOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import {connect} from 'react-redux';

import { useSelector, useDispatch } from 'react-redux'
import { addOne, reset } from './store/actions/order.actions'

import { save } from "./orderSlice";
import { Layout, Menu } from 'antd';
import { LaptopOutlined, NotificationOutlined, UserOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Space, Table, Tag } from 'antd';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { API_URL, getBrand, getCollectionCode } from './helper.js';
import { SmileOutlined } from '@ant-design/icons';
import { Result } from 'antd';

const { Meta } = Card;
const { Content, Sider } = Layout;



function SummaryStatus({dishes, brand_uuid}) {
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    const [loadingData, setLoadingData] = useState(false);
    const [orderPlacing, setOrderPlaced] = useState(false);

    const dispatch = useDispatch();
    const state = useSelector(state => state)

    useEffect(() => {
        if(getCollectionCode() === null || getCollectionCode() === undefined) {
            navigate("/")
        }
        updateOrderStatus();
    })

    const updateOrderStatus = async () => {
        setLoadingData(true);

        let collection_code = getCollectionCode();

        await axios.get(`${API_URL}/summary-order-status/${collection_code}`)
        .then(res => res.data)
        .then(
          (result) => {
            console.log(result)
          },
          (error) => {
            console.log(error);
          }
        )

        setLoadingData(false);
    }

  // const { dishes } = useSelector(state=>state)
    return (
        <>
            {contextHolder}
            {loadingData
                ?
                    <Row>
                        <Col span={12} offset={12}>
                            <Spin tip="Cargando datos..." size="large"></Spin> 
                        </Col>
                    </Row>
                        
                :
                <Result
                    icon={<SmileOutlined />}
                    title="Great, we have done all the operations!"
                    extra={<Button type="primary">Next</Button>}
                />
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
