import { v4 as uuidv4 } from 'uuid';

import React, { useState, useEffect } from 'react';

import { Col, Row, Card, Button, FloatButton, message, Drawer, Tag } from 'antd';
import { PlusOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { LaptopOutlined, NotificationOutlined, UserOutlined, InfoOutlined } from '@ant-design/icons';

import {connect} from 'react-redux';
import { useSelector, useDispatch } from 'react-redux'
import { addOne, reset } from './store/actions/order.actions'
import { save } from "./orderSlice";

import { useNavigate } from "react-router-dom";

import axios from 'axios';

import {getBrand, API_URL, getCollectionCode} from './helper.js';

const { Meta } = Card;
const { Content, Sider } = Layout;

function App({dishes}) {
  const navigate = useNavigate();

  const [messageApi, contextHolder] = message.useMessage();

  const [items, setItems] = useState([]);
  const [menu, setMenu] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false)
  const [selectedTags, setSelectedTags] = useState([])
  const [selectedDishTitle, setSelectedDishTitle] = useState("");

  const dispatch = useDispatch();
  const state = useSelector(state => state)

  const [current, setCurrent] = useState([]);

  const success = (dishName) => {
    messageApi.open({
      key: uuidv4(),
      type: 'success',
      content: `${dishName} añadido a la cesta.`,
      duration: 0.5,
    });
  };

  const error = (msg, duration=0.5) => {
    messageApi.open({
      key: uuidv4(),
      type: 'error',
      content: `${msg}`,
      duration: duration,
    });
  };

  // const { dishes } = useSelector(state=>state)

  // Retrieve the dishes associated to the category
  const retrieveDishesByCategoryUuid = async (category_uuid) => {
    try {
      let brandUuid = getBrand();

      await axios.get(`${API_URL}/dishes/${brandUuid}/${category_uuid}`)
      .then(res => res.data)
      .then(
        (result) => {
          setItems(result)
        },
        (error) => {
          error("An error occured fetching dishes. Try again later.", 3)
          console.log(error)
        }
      )
    } catch(e) {
      error("An error occured fetching dishes. Try again later.", 3)
      console.log(e)
    }
  };

  const retrieveCategories = async () => {
    try {
      let brandUuid = getBrand();
      await axios.get(`${API_URL}/category/${brandUuid}`)
        .then(res => res.data)
        .then(
          (result) => {
              console.log(result)
              setMenu(result)
              retrieveDishesByCategoryUuid(result[0].key)
              setCurrent([result[0].key])
          },
          (error) => {
            error("An error occured fetching categories. Try again later.", 3)
            console.log(error)
          }
      )
    } catch(e) {
      error("An error occured fetching categories. Try again later.", 3)
      console.log(e)
    }
  }

  useEffect(() => {
    if (getBrand() === null && getBrand() === undefined){
      navigate("/");
    }
    if(getCollectionCode() !== null && getCollectionCode() !== undefined) {
        navigate("/orderStatus")
    }
    // Fetch the categories first.
    retrieveCategories();
  }, [])

  const displayTags = (item) => {
    console.log(item)
    setOpenDrawer(true);
    setSelectedTags(item.tags);
    setSelectedDishTitle(item.name);
  }

  const closeDrawer = () => {
    console.log("closing drawer...")
    setOpenDrawer(false);
  }

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
              selectedKeys={current}
              onClick={(data) => {
                setCurrent([data.key])
                retrieveDishesByCategoryUuid(data.key)
              }}
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
                        key={uuidv4()}
                        extra={item.price + "€"}
                        style={{ width: 240 }}
                        cover={<img alt="example" src={item.photo} height={200} width={150} />}

                        >
                          <Meta title={item.name} description={item.description} />
                          <div>
                            <Button
                            type="primary"
                            icon={<ShoppingCartOutlined />}
                            size={10}
                            onClick={ () => {
                              dispatch(addOne(item));
                              success(item.name);
                            }}
                            />
                            <Button
                            type="primary"
                            icon={<InfoOutlined />}
                            size={10}
                            onClick={() => displayTags(item)}
                            />

                          </div>

                      </Card>
                    </Col>
                  ))}
                </Row>

                <Drawer open={openDrawer} onClose={closeDrawer} title={selectedDishTitle} placement="bottom">
                  {selectedTags.map(tag => {
                    return (<Tag color="green" key={uuidv4()}>{tag}</Tag>)
                  })}
                </Drawer>

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
