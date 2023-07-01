import { Button, Drawer, Tag } from 'antd';
import { useState } from 'react';

const DrawerPopup = (props) => {
  const [open, setOpen] = useState(true);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Drawer title="Basic Drawer" placement="right" open={props.open}>
          {props.tags.map(tag => {
            <Tag color="red">as</Tag>
          })}
      </Drawer>
    </>
  );
};
export default DrawerPopup;
