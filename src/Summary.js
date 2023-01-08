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


const { Meta } = Card;
const { Content, Sider } = Layout;



function Summary({dishes}) {
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    const [items, setItems] = useState([]);

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
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Quantity',
            dataIndex: 'qty',
            key: 'qty',
        },
    ]

    const dishRemovedFromStore = (dishName) => {
        messageApi.open({
            type: 'success',
            content: `${dishName} eliminado de la cesta.`,
        });
    };

    useEffect(() => {
        console.log(Object.keys(state.dishes[0]))
    })

  // const { dishes } = useSelector(state=>state)
    return (
        <>
            {contextHolder}
            <Table dataSource={data} columns={columns} />
            <div style={{
                textAlign: "center"
            }}>
                <Button type="primary">Realizar pedido</Button>
            </div>
            <FloatButton onClick={() => navigate("/")} icon={<ArrowLeftOutlined />} />
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        dishes: state
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getDishes: () => { dispatch()}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Summary);
