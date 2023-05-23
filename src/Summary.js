import React, { useState, useEffect } from 'react';
import { Col, Row, Card, Button, FloatButton, message } from 'antd';
import { PlusOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import {connect} from 'react-redux';

import { useSelector, useDispatch } from 'react-redux'
import { addOne, reset, substituteDish, deleteFromCart, incrementQuantity, decrementQuantity } from './store/actions/order.actions'

import { save } from "./orderSlice";
import { Layout, Menu, Typography } from 'antd';
import { LaptopOutlined, NotificationOutlined, UserOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Space, Table, Tag } from 'antd';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { API_URL, getBrand, getCollectionCode } from './helper.js';
import { v4 as uuidv4 } from 'uuid';

const { Meta } = Card;
const { Content, Sider } = Layout;

function Summary({dishes, brand_uuid}) {
    const { CheckableTag } = Tag;
    const { Title, Text } = Typography;

    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [orderPlacing, setOrderPlaced] = useState(false);

    const dispatch = useDispatch();
    const state = useSelector(state => state)

    const changeExcludeIngredient = (uuid, ing, checked) => {
        state.dishes.forEach(function(dish) {
          if(dish.randomUuid === uuid) {
            dish.ingredients.forEach(function(ingredient) {
              if(ingredient.name === ing.name) {
                ingredient.exclude = !ingredient.exclude
              }
            });
          }
        });
        return state.dishes;
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
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
                     }}>
                      {ing.name}
                    </CheckableTag>
                  );
                })}
              </>
            ),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: '#',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
          title: '',
          key: 'action',
          render: (obj) => (
            <>
              <Button danger onClick={() => dispatch(incrementQuantity(obj))}>+</Button>

              <Button danger onClick={() => {
                if(obj.quantity <= 1) {
                  dispatch(deleteFromCart(obj));
                } else {
                  dispatch(decrementQuantity(obj));
                }
              }}>-</Button>
            </>
          ),
        },
    ]

    const [selectedTags, setSelectedTags] = useState([]);

    const dishRemovedFromStore = (dishName, dishUuid) => {
        messageApi.open({
            type: 'success',
            content: `${dishName} removed from cart.`,
        });
    };

    const OrderPlacedSuccess = (type, msg) => {
        messageApi.open({
            type: type,
            content: msg,
        });
    };


    useEffect(() => {
      if(getCollectionCode() !== null && getCollectionCode !== undefined) {
        navigate("/orderStatus")
      }
    }, [])


    const placeOrder = async () => {
        // Let the button load.
        setOrderPlaced(true);

        let orders = {"dishes": [], "brand_uuid": getBrand()};
        state.dishes.map((dish) => {
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

    return (
        <>
            {contextHolder}
            <Table dataSource={state.dishes} columns={columns} rowKeY={uuidv4()} />
            <div style={{
                textAlign: "center"
            }}>
            <>
                <Title level={5}>
                  Your total is {state.dishes.reduce((total, current) => {
                    return total + (current.quantity * current.price);
                  }, 0)}€
                </Title>
                <Button
                 type="primary"
                 disabled={state.dishes.length > 0 ? false : true}
                 onClick={() => placeOrder()}
                 loading={orderPlacing === true ? true : false}
                >
                    Place order
                </Button>

            </>
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Summary);
