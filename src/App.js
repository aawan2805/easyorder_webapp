import React, { useState, useEffect } from 'react';

import { Col, Row, Card, Button, FloatButton, message } from 'antd';
import { PlusOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';

import {connect} from 'react-redux';
import { useSelector, useDispatch } from 'react-redux'
import { addOne, reset } from './store/actions/order.actions'
import { save } from "./orderSlice";


import { useNavigate } from "react-router-dom";

import axios from 'axios';

import {getBrand} from './helper.js';

import { API_URL } from './helper.js';

const { Meta } = Card;
const { Content, Sider } = Layout;


function App({dishes}) {
  const navigate = useNavigate();

  const [messageApi, contextHolder] = message.useMessage();

  const [items, setItems] = useState([]);
  const [menu, setMenu] = useState([]);

  const dispatch = useDispatch();
  const state = useSelector(state => state)

  const success = (dishName) => {
    messageApi.open({
      type: 'success',
      content: `${dishName} añadido a la cesta.`,
    });
  };

  // const { dishes } = useSelector(state=>state)

  // Retrieve the dishes associated to the category
  const retrieveDishesByCategoryUuid = async (category_uuid) => {
    let brandUuid = getBrand();

    await axios.get(`${API_URL}/dishes/${brandUuid}/${category_uuid}`)
    .then(res => res.data)
    .then(
      (result) => {
        setItems(result)
      },
      (error) => {
        console.log(error)
      }
    )
  };


  useEffect(() => {
    if (getBrand() === null || getBrand() === undefined){
      console.log("Brand not found.")
      navigate("/");
    } else {
      console.log("Brand found.")
    }
    // Fetch the categories first.
    
    let brandUuid = getBrand();
    axios.get(`${API_URL}/category/${brandUuid}`)
      .then(res => res.data)
      .then(
        (result) => {
          console.log(result)
          setMenu(result)
          if(result.length > 0){
            retrieveDishesByCategoryUuid(result[0].key)
          }
        },
        (error) => {
          console.log(error)
        }
    )

  }, [dishes])

    return (
      <>
      {contextHolder}
      <Layout>
            <Menu
              mode="horizontal"
              style={{
                height: '100%',
                borderRight: 0,
              }}
              items={menu}
              onClick={(data) => retrieveDishesByCategoryUuid(data.key)}
            />

            <Content
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
                background: "white",
              }}
            >
              <div>
                <Row>
                  {items.map(item => (
                    <Col key={item.uuid}>
                      <Card
                        hoverable
                        style={{ width: 240 }}
                        cover={<img alt="example" src={item.photo} height={200} width={150} />}
                        >
                          <Meta title={item.name + " | " + item.price + "€"} description={item.description} />
                          <div>
                            <Button
                            type="primary" 
                            icon={<PlusOutlined />} 
                            size={10}
                            onClick={ () => {
                              dispatch(addOne(item));
                              success(item.name);
                            }}
                            />
                          </div>
                          
                      </Card>
                    </Col>
                  ))}
                </Row>
                <FloatButton 
                  icon={<ShoppingCartOutlined />}
                  description={state.total_dishes}
                  type="primary"
                  onClick={() => navigate("/summary")}
                  shape="square"
                >
                </FloatButton>
              </div>

            </Content>
          </Layout>
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

export default connect(mapStateToProps, mapDispatchToProps)(App);

// export default App;

