import React, { useState } from "react";
import { Form, Select, Input, Button, List, Row, Col } from "antd";

const { Option } = Select;

const MeasurementPage = ({ recipes }) => {
  const [formData, setFormData] = useState({
    selectedRecipe: "",
    unitName: "",
    unitAmount: "",
    unitType: "",
  });
  const [savedData, setSavedData] = useState([]); // Kaydedilen verileri tutacak state

  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const newData = {
      recipe: formData.selectedRecipe,
      unitName: formData.unitName,
      unitAmount: formData.unitAmount,
      unitType: formData.unitType,
    };
    setSavedData([...savedData, newData]); // Yeni veriyi kaydet
    setFormData({
      // Formu sıfırla
      selectedRecipe: "",
      unitName: "",
      unitAmount: "",
      unitType: "",
    });
  };

  const handleDelete = (index) => {
    const updatedData = [...savedData];
    updatedData.splice(index, 1); // Belirtilen index'teki veriyi sil
    setSavedData(updatedData);
  };

  // Birim adı seçenekleri
  const unitNameOptions = ["yemek kaşığı", "çay kaşığı", "kase"];

  return (
    <div>
      <h1
        style={{
          textAlign: "center",
          fontSize: "24px",
          fontWeight: "bold",
          marginBottom: "25px",
        }}
      >
        Ölçü Birimlerini Belirle
      </h1>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item label="Tarif Seç">
            <Select
              placeholder="Tarif Seç"
              onChange={(value) => handleChange("selectedRecipe", value)}
              value={formData.selectedRecipe}
              style={{ width: "100%" }}
            >
              {recipes.map((recipe) => (
                <Option key={recipe.recipeName} value={recipe.recipeName}>
                  {recipe.recipeName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Birim Adı">
            <Select
              placeholder="Birim Adı Seçin"
              onChange={(value) => handleChange("unitName", value)}
              value={formData.unitName}
              style={{ width: "100%" }}
            >
              {unitNameOptions.map((option) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Birim Miktarı">
            <Input
              type="number"
              placeholder="Örnek: 15"
              value={formData.unitAmount}
              onChange={(e) => handleChange("unitAmount", e.target.value)}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Birim Türü">
            <Select
              placeholder="Birim Türü Seçin"
              onChange={(value) => handleChange("unitType", value)}
              value={formData.unitType}
              style={{ width: "100%" }}
            >
              <Option value="gram">gram</Option>
              <Option value="ml">ml</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row justify="center">
        <Col>
          <Button
            type="primary"
            htmlType="submit"
            onClick={handleSubmit}
            style={{
              backgroundColor: "#ef7927",
              borderColor: "#ef7927",
              marginBottom: "30px",
            }}
          >
            Kaydet
          </Button>
        </Col>
      </Row>
      <List
        header={<div>Kaydedilen Veriler</div>}
        bordered
        dataSource={savedData}
        renderItem={(item, index) => (
          <List.Item
            actions={[
              <Button onClick={() => handleDelete(index)}>Sil</Button>, // Silme butonu ekle
            ]}
          >
            1 {item.unitName} {item.recipe} {item.unitAmount} {item.unitType}
          </List.Item>
        )}
      />
    </div>
  );
};

export default MeasurementPage;
