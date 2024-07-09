import React, { useState } from "react";
import { Form, Input, Button, Row, Col } from "antd";

const AddNutritionalValues = ({ formData, setFormData }) => {
  const [localFormData, setLocalFormData] = useState({
    unit: "",
    type: "",
    calorieAmount: "",
    carbohydrateAmount: "",
    proteinAmount: "",
    fatAmount: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    setFormData((prevData) => ({
      ...prevData,
      nutritionalValuesList: [...prevData.nutritionalValuesList, localFormData],
    }));
    setLocalFormData({
      unit: localFormData.unit,
      type: localFormData.type,
      calorieAmount: localFormData.calorieAmount,
      carbohydrateAmount: localFormData.carbohydrateAmount,
      proteinAmount: localFormData.proteinAmount,
      fatAmount: localFormData.fatAmount,
    });
  };

  const handleRemove = (indexToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      nutritionalValuesList: prevData.nutritionalValuesList.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  return (
    <div>
      <h4 style={{ marginBottom: "10px" }}>Besin Değerleri</h4>
      <Form>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="unit"
              label="Ölçü Birimi"
              extra="Gireceğiniz besin değerlerinin hangi ölçüye ait olduğunu yazınız. Örn: 100 gram, 1 yemek kaşığı"
            >
              <Input
                placeholder="Ölçü Birimi Giriniz"
                name="unit"
                value={localFormData.unit}
                onChange={handleInputChange}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="type"
              label="Tür"
              extra="Gireceğiniz besin değerlerinin hangi ölçüye ait olduğunu yazınız. Örn: 100 gram, 1 yemek kaşığı"
            >
              <Input
                placeholder="Besin Değeri Türünü Giriniz"
                name="type"
                value={localFormData.type}
                onChange={handleInputChange}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="calorieAmount" label="Kalori (kcal)">
              <Input
                type="number"
                placeholder="Kalori Miktarı"
                name="calorieAmount"
                value={localFormData.calorieAmount}
                onChange={handleInputChange}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="carbohydrateAmount" label="Karbonhidrat (g)">
              <Input
                type="number"
                placeholder="Karbonhidrat Miktarı"
                name="carbohydrateAmount"
                value={localFormData.carbohydrateAmount}
                onChange={handleInputChange}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="proteinAmount" label="Protein (g)">
              <Input
                type="number"
                placeholder="Protein Miktarı"
                name="proteinAmount"
                value={localFormData.proteinAmount}
                onChange={handleInputChange}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="fatAmount" label="Yağ (g)">
              <Input
                type="number"
                placeholder="Yağ Miktarı"
                name="fatAmount"
                value={localFormData.fatAmount}
                onChange={handleInputChange}
              />
            </Form.Item>
          </Col>
          <Col span={24} style={{ textAlign: "right" }}>
            <Button onClick={handleSubmit}>Besin Değerlerini Ekle</Button>
          </Col>
        </Row>
      </Form>
      {formData.nutritionalValuesList.length > 0 && (
        <div>
          <h4 style={{ marginBottom: "10px" }}>Eklenen Ölçü Birimleri</h4>
          {formData.nutritionalValuesList.map((item, index) => (
            <div
              key={index}
              style={{
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <p style={{ marginRight: "10px" }}>
                <strong>Tür:</strong> {item.type} - <strong>Kalori:</strong>{" "}
                {item.calorieAmount} - <strong>Karbonhidrat:</strong>{" "}
                {item.carbohydrateAmount} - <strong>Protein:</strong>{" "}
                {item.proteinAmount} - <strong>Yağ:</strong> {item.fatAmount}
              </p>
              <Button
                style={{
                  borderColor: "red",
                  color: "red",
                  marginLeft: "auto",
                }}
                onClick={() => handleRemove(index)}
              >
                Sil
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddNutritionalValues;
