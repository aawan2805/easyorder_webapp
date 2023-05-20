import React, { useState, useEffect } from 'react';
import { Col, Row, Card, Button, FloatButton, message } from 'antd';
import { PlusOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import {connect} from 'react-redux';

import { useSelector, useDispatch } from 'react-redux'
import { addOne, reset, substituteDish } from './store/actions/order.actions'

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
    const { CheckableTag } = Tag;

    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [orderPlacing, setOrderPlaced] = useState(false);

    const dispatch = useDispatch();
    const state = useSelector(state => state)

    const [dataState, setDataState] = useState(state.dishes);

    const changeExcludeIngredient = (uuid, ing, checked) => {
        dataState.forEach(function(dish) {
          if(dish.randomUuid === uuid) {
            dish.ingredients.forEach(function(ingredient) {
              if(ingredient.name === ing.name) {
                ingredient.exclude = !ingredient.exclude
              }
            });
          }
        });
        return dataState;
    };

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
            render: (_, { ingredients, randomUuid }) => (
              <>
                {ingredients.map((ing) => {
                  return (
                    <CheckableTag
                     color={"green"}
                     key={`${randomUuid}${ing.name}`}
                     checked={!ing.exclude}
                     onChange={(checked) => {
                       const newData = changeExcludeIngredient(randomUuid, ing, checked)
                       // console.log(newData);
                       dispatch(substituteDish(newData));
                       setDataState(newData);
                     }}>
                      {ing.name}
                    </CheckableTag>
                  );
                })}
              </>
            ),
        }
    ]

    const [selectedTags, setSelectedTags] = useState([]);

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
      console.log("*******#*******")
      console.log(dataState)
      console.log("*******#*******")
    }, [dispatch, dataState])


    const placeOrder = async () => {
        // Let the button load.
        setOrderPlaced(true);

        let orders = {"dishes": [], "brand_uuid": getBrand()};
        dataState.map((dish) => {
            orders.dishes.push({
                dish_uuid: dish.uuid,
                exclude_ingredients: dish.ingredients,
                quantity: 1,
            })
        })

        console.log(orders)

        try {
            const collection_code = getCollectionCode();
            const response = await axios.post(`${API_URL}/order`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orders)
            })
            console.log(response.data)
            OrderPlacedSuccess("success", response.data.msg)
            localStorage.setItem("collection_code", response.data.collection_code)
            setOrderPlaced(false)
            dispatch(reset())
            navigate("/orderStatus")
        } catch (error) {
          OrderPlacedSuccess("error", "Error placing order. Try again.")
          setOrderPlaced(false)
        }
    }

  // const { dishes } = useSelector(state=>state)
    return (
        <>
            {contextHolder}
            <Table dataSource={dataState} columns={columns} rowKeY="uuid" />
            <div style={{
                textAlign: "center"
            }}>
                <Button
                 type="primary"
                 disabled={dataState.length > 0 ? false : true}
                 onClick={() => placeOrder()}
                 loading={orderPlacing === true ? true : false}
                >
                    Realizar pedido
                </Button>
            </div>
            {orderPlacing === true ?
                null
                :
                <FloatButton onClick={() => navigate("/home")}  icon={<ArrowLeftOutlined />} />
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
