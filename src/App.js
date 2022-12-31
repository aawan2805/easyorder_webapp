import React, { useState, useEffect } from 'react';
import { Col, Row, Card, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Meta } = Card;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }

  componentDidMount() {
    fetch("http://localhost:8000/api/dishes/b024256f-e9e2-4e36-8a54-ddf5572ee520")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <Row>
          {items.map(item => (
            <Col span={12} key={item.uuid}>
              <Card
                hoverable
                style={{ width: 240 }}
                cover={<img alt="example" src={item.photo} />}
                >
                  <Meta title={item.name + item.price + "£"} description={item.description} />
                  <div>
                    <Button type="primary" icon={<PlusOutlined />} size={10}/>
                  </div>
                  
              </Card>
            </Col>
          ))}
        </Row>        
      );
    }
  }
}

const App = () => {
  return <Home />;
};

export default App;

