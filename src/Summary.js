import React, { useState, useEffect } from 'react';
import { Col, Row, Card, Button, FloatButton, message } from 'antd';
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

const { Meta } = Card;
const { Content, Sider } = Layout;



function Summary({dishes, brand_uuid}) {
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [orderPlacing, setOrderPlaced] = useState(false);

    const dispatch = useDispatch();
    const state = useSelector(state => state)

    const data = state.dishes;
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Ingredients',
            dataIndex: 'ingredients',
            key: 'ingredients',
        },
        {
            title: 'Tags',
            dataIndex: 'tags',
            key: 'tags',
        },
        {
            title: 'Quantity',
            dataIndex: 'qty',
            key: 'qty',
        },
    ]

    const dishRemovedFromStore = (dishName, dishUuid) => {
        messageApi.open({
            type: 'success',
            content: `${dishName} eliminado de la cesta.`,
        });
    };

    const OrderPlacedSuccess = (type, msg) => {
        messageApi.open({
            type: type,
            content: msg,
        });
    };

    useEffect(() => {
        if(getCollectionCode() === null || getCollectionCode() === undefined) {
            navigate("/")
        }
    })

    const placeOrder = async () => {
        // Let the button load.
        setOrderPlaced(true);

        let orders = {"dishes": [], "brand_uuid": getBrand()};
        data.map((order) => {
            orders.dishes.push({
                dish_uuid: order.uuid,
                quantity: order.qty,
            })
        })

        await axios.post(`${API_URL}/order`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orders)
        })
        .then(response => {
            if(response.status === 201){
                OrderPlacedSuccess("success", response.data.msg)
                localStorage.setItem("collection_code", response.data.collection_code)
                setOrderPlaced(false)
                dispatch(reset())
            } else {
                console.log(response)
                OrderPlacedSuccess("error", "Error placing order. Try again.")
                setOrderPlaced(false)
            }
        })
    }

  // const { dishes } = useSelector(state=>state)
    return (
        <>
            {contextHolder}
            <Table dataSource={data} columns={columns} />
            <div style={{
                textAlign: "center"
            }}>
                <Button 
                 type="primary"
                 disabled={data.length > 0 ? false : true}
                 onClick={() => placeOrder()}
                 loading={orderPlacing === true ? true : false}
                >
                    Realizar pedido
                </Button>
            </div>
            {orderPlacing === true ? 
                null 
                : 
                <FloatButton onClick={() => navigate("/")}  icon={<ArrowLeftOutlined />} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Summary);
