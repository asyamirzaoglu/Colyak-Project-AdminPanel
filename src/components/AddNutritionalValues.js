import React, { useState } from "react";
import { Form, Input, Button, Row, Col } from "antd";

const AddNutritionalValues = () => {
  const [formDataList, setFormDataList] = useState([]);
  const [formData, setFormData] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
  
    setFormDataList([...formDataList, formData]); // FormData'yı listeye ekle
    setFormData({ // Formu temizle
      unitType: "",
      calorieAmount: "",
      carbohydrateAmount: "",
      proteinAmount: "",
      fatAmount: "",
    });
  };
  
  
  const handleRemove = (indexToRemove) => {
    setFormDataList((prevList) =>
      prevList.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <div>
      <h4 style={{ marginBottom: "10px" }}>Besin Değerleri</h4>
      <form>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="unitType"
              label="Ölçü Birimi"
              extra="Gireceğiniz besin değerlerinin hangi ölçüye ait olduğunu yazınız. Örn: 100 gram, 1 yemek kaşığı"
            >
              <Input 
                placeholder="Ölçü Birimi Giriniz" 
                name="unitType"
                value={formData.unitType || ""}
                onChange={handleInputChange}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="calorieAmount"
              label="Kalori (kcal)"
            >
              <Input 
                type="number" 
                placeholder="Kalori Miktarı" 
                name="calorieAmount"
                value={formData.calorieAmount || ""}
                onChange={handleInputChange}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="carbohydrateAmount"
              label="Karbonhidrat (g)"
            >
              <Input 
                type="number" 
                placeholder="Karbonhidrat Miktarı" 
                name="carbohydrateAmount"
                value={formData.carbohydrateAmount || ""}
                onChange={handleInputChange}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="proteinAmount"
              label="Protein (g)"
            >
              <Input 
                type="number" 
                placeholder="Protein Miktarı" 
                name="proteinAmount"
                value={formData.proteinAmount || ""}
                onChange={handleInputChange}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="fatAmount"
              label="Yağ (g)" 
            >
              <Input 
                type="number" 
                placeholder="Yağ Miktarı" 
                name="fatAmount"
                value={formData.fatAmount || ""}
                onChange={handleInputChange}
              />
            </Form.Item>
          </Col>
          <Col span={24} style={{ textAlign: "right" }}>
            <Button onClick={handleSubmit}>
              Besin Değerlerini Ekle
            </Button>
          </Col>
        </Row>
      </form>
      {formDataList.length > 0 && (
        <div>
             <h4 style={{ marginBottom: "10px" }}>Eklenen Ölçü Birimleri</h4>
        {formDataList.map((formData, index) => (
          <div key={index} style={{ marginBottom: "20px", display: "flex", alignItems: "center" }}>
            <p style={{ marginRight: "10px" }}>
              <strong>Ölçü Birimi:</strong> {formData.unitType} - {" "}
              <strong>Kalori:</strong> {formData.calorieAmount} - {" "}
              <strong>Karbonhidrat:</strong> {formData.carbohydrateAmount} - {" "}
              <strong>Protein:</strong> {formData.proteinAmount} - {" "}
              <strong>Yağ:</strong> {formData.fatAmount}
            </p>
            <Button 
              style={{ borderColor: 'red', color: 'red', marginLeft: "auto" }} 
              onClick={() => handleRemove(index)}
            >
              Sil
            </Button>
          </div>
        ))}
      </div>
    )}
  </div>
);}

export default AddNutritionalValues;
