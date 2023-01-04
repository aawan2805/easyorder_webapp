import React, { useState, useEffect } from 'react';
import { Col, Row, Card, Button, FloatButton } from 'antd';
import { PlusOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { connect } from "react-redux";
import {useDispatch, useSelector} from 'react-redux'
import { save } from "./orderSlice";
import { Layout, Menu, theme } from 'antd';
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';

const { Meta } = Card;
const { Header, Content, Footer, Sider } = Layout;


function App() {
  const [items, setItems] = useState([]);
  const dispatch = useDispatch();
  const { dishes } = useSelector(state=>state)

  useEffect( () => {
    fetch("http://localhost:8000/api/dishes/e46ba39f-6227-48d4-9380-f941727a643f")
      .then(res => res.json())
      .then(
        (result) => {
          setItems(result)
        },
        (error) => {
          console.log("ERROR")
        }
      )
  }, [])

  const items1 = ['1', '2', '3'].map((key) => ({
    key,
    label: `nav ${key}`,
  }));
  const items2 = [UserOutlined, LaptopOutlined, NotificationOutlined].map((icon, index) => {
    const key = String(index + 1);
    return {
      key: `sub${key}`,
      icon: React.createElement(icon),
      label: `subnav ${key}`,
      children: new Array(4).fill(null).map((_, j) => {
        const subKey = index * 4 + j + 1;
        return {
          key: subKey,
          label: `option${subKey}`,
        };
      }),
    };
  });

    return (
      <Layout>
        <Layout>
          <Sider
            width={200}
            style={{
              background: "white",
            }}
          >
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{
                height: '100%',
                borderRight: 0,
              }}
              items={items2}
            />
          </Sider>
          <Layout
            style={{
              padding: '0 24px 24px',
            }}
          >
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
                    <Col span={6} key={item.uuid}>
                      <Card
                        hoverable
                        style={{ width: 240 }}
                        cover={<img alt="example" src={item.photo} height={200} width={150} />}
                        >
                          <Meta title={item.name + item.price + "€"} description={item.description} />
                          <div>
                            <Button
                            type="primary" 
                            icon={<PlusOutlined />} 
                            size={10}
                            onClick={() => dispatch(save({item}))}
                            />
                          </div>
                          
                      </Card>
                    </Col>
                  ))}
                </Row>
                <FloatButton 
                icon={<ShoppingCartOutlined />}
                description="Cart"
                type="primary"
                onClick={() => console.log(dishes)}
                shape="square"
                />
              </div>

            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  

    // <div>
    //   <FloatButton 
    //    icon={<ShoppingCartOutlined />}
    //    description="Cart"
    //   />
    //   <Row>
    //     {items.map(item => (
    //       <Col span={6} key={item.uuid}>
    //         <Card
    //           hoverable
    //           style={{ width: 240 }}
    //           cover={<img alt="example" src={item.photo} height={200} width={150} />}
    //           >
    //             <Meta title={item.name + item.price + "€"} description={item.description} />
    //             <div>
    //               <Button
    //               type="primary" 
    //               icon={<PlusOutlined />} 
    //               size={10}
    //               onClick={() => dispatch(save({item}))}
    //               />
    //             </div>
                
    //         </Card>
    //       </Col>
    //     ))}
    //   </Row>
    // </div>
  // )
}


export default App;

