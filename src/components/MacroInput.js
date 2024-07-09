import React from "react";
import { Form, Input, Col } from "antd";

const MacroInput = ({ label, value, onChange, name }) => {
  return (
    <Col span={6}>
      <Form.Item
        name={name}
        rules={[
          { required: true, message: "Bu alanı doldurmak zorunludur." },
        ]}
      >
        <label>
          {label}
          <Input
            type="number"
            placeholder={`${label} Değeri`}
            value={value}
            onChange={onChange}
            name={name}
          />
        </label>
      </Form.Item>
    </Col>
  );
};

export default MacroInput;
