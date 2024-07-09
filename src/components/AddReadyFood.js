import React, { useState } from "react";
import { Form, Input, Button, Row, Col, Switch, message, Upload, Image } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const AddReadyFood = ({ onClose }) => {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    glutenFree: false,
    nutritionalValuesList: [
      {
        unit: 0,
        type: "",
        carbohydrateAmount: "",
        proteinAmount: "",
        fatAmount: "",
        calorieAmount: "",
      },
    ],
    imageId: null,
  });
  const [imageUrl, setImageUrl] = useState(null); // resim önizleme için state

  const token = localStorage.getItem("token");

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const nutritionalValuesList = [...formData.nutritionalValuesList];
    nutritionalValuesList[index][name] = name === "unit" ? parseInt(value, 10) : value;
    setFormData((prevData) => ({
      ...prevData,
      nutritionalValuesList: nutritionalValuesList,
    }));
  };

  const handleAddUnit = () => {
    setFormData((prevData) => ({
      ...prevData,
      nutritionalValuesList: [
        ...prevData.nutritionalValuesList,
        {
          unit: 0,
          type: "",
          carbohydrateAmount: "",
          proteinAmount: "",
          fatAmount: "",
          calorieAmount: "",
        },
      ],
    }));
  };

  const handleRemoveUnit = (index) => {
    const nutritionalValuesList = [...formData.nutritionalValuesList];
    nutritionalValuesList.splice(index, 1);
    setFormData((prevData) => ({
      ...prevData,
      nutritionalValuesList: nutritionalValuesList,
    }));
  };

  const handleImageChange = (info) => {
    if (info.file.status === "done") {
      setImageUrl(info.file.response.url); // Set image preview URL
      message.success(`${info.file.name} dosyası başarıyla yüklendi.`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} dosyası yüklenirken bir hata oluştu.`);
    }
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("Yalnızca JPG/PNG dosyaları yükleyebilirsiniz!");
    }
    return isJpgOrPng;
  };

  const handleSubmit = async () => {
    try {
      const formDataWithImage = {
        ...formData,
        imageId: 0, // Replace with appropriate imageId based on backend requirements
      };
      console.log("Gönderilen Veri:", formDataWithImage);
      const response = await axios.post(
        "https://api.colyakdiyabet.com.tr/api/barcodes/add",
        formDataWithImage,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response:", response.data);
      message.success("Hazır yiyecek başarıyla eklendi!");
      onClose();
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        console.log("Sunucu Hatası Mesajı:", error.response.data);
      }
      message.error("Hazır yiyecek eklenirken bir hata oluştu.");
    }
  };

  return (
    <Form name="addReadyFoodsForm" onFinish={handleSubmit}>
      <h1
        style={{
          textAlign: "center",
          fontSize: "24px",
          fontWeight: "bold",
          marginBottom: "10px",
        }}
      >
        Hazır Yiyecek Ekle
      </h1>
      <Form.Item
        name="code"
        rules={[{ required: true, message: "Bu alanı doldurmak zorunludur." }]}
      >
        <Input
          placeholder="Barkod Kodu"
          value={formData.code}
          onChange={(e) =>
            setFormData((prevData) => ({
              ...prevData,
              code: e.target.value,
            }))
          }
        />
      </Form.Item>
      <Form.Item
        name="name"
        rules={[{ required: true, message: "Bu alanı doldurmak zorunludur." }]}
      >
        <Input
          placeholder="Adı"
          value={formData.name}
          onChange={(e) =>
            setFormData((prevData) => ({
              ...prevData,
              name: e.target.value,
            }))
          }
        />
      </Form.Item>
      <Form.Item
        name="glutenFree"
        label="Glutensiz Mi?"
        valuePropName="checked"
      >
        <Switch
          checked={formData.glutenFree}
          onChange={(checked) =>
            setFormData((prevData) => ({
              ...prevData,
              glutenFree: checked,
            }))
          }
        />
      </Form.Item>
      <Form.Item label="Görsel Yükle">
        <Upload
          name="image"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          action="https://api.colyakdiyabet.com.tr/api/image/addImage"
          headers={{
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          }}
          beforeUpload={beforeUpload}
          onChange={handleImageChange}
        >
          {imageUrl ? (
            <Image src={imageUrl} alt="Görsel" style={{ width: "100%" }} />
          ) : (
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>Görsel Yükle</div>
            </div>
          )}
        </Upload>
      </Form.Item>
      {formData.nutritionalValuesList.map((attribute, index) => (
        <Row key={index} gutter={16}>
          <Col span={8}>
            <Form.Item
              name={`unit${index}`}
              rules={[
                { required: true, message: "Bu alanı doldurmak zorunludur." },
              ]}
            >
              <Input
                type="number"
                placeholder="Ölçü Birimi (Örn: 100 gram, 1 yemek kaşığı)"
                value={attribute.unit}
                onChange={(e) => handleChange(e, index)}
                name="unit"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name={`type${index}`}
              rules={[
                { required: true, message: "Bu alanı doldurmak zorunludur." },
              ]}
            >
              <Input
                placeholder="Ölçü Tipi"
                value={attribute.type}
                onChange={(e) => handleChange(e, index)}
                name="type"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name={`carbohydrateAmount${index}`}
              rules={[
                { required: true, message: "Bu alanı doldurmak zorunludur." },
              ]}
            >
              <Input
                type="number"
                placeholder="Karbonhidrat Miktarı"
                value={attribute.carbohydrateAmount}
                onChange={(e) => handleChange(e, index)}
                name="carbohydrateAmount"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name={`proteinAmount${index}`}
              rules={[
                { required: true, message: "Bu alanı doldurmak zorunludur." },
              ]}
            >
              <Input
                type="number"
                placeholder="Protein Miktarı"
                value={attribute.proteinAmount}
                onChange={(e) => handleChange(e, index)}
                name="proteinAmount"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name={`fatAmount${index}`}
              rules={[
                { required: true, message: "Bu alanı doldurmak zorunludur." },
              ]}
            >
              <Input
                type="number"
                placeholder="Yağ Miktarı"
                value={attribute.fatAmount}
                onChange={(e) => handleChange(e, index)}
                name="fatAmount"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name={`calorieAmount${index}`}
              rules={[
                { required: true, message: "Bu alanı doldurmak zorunludur." },
              ]}
            >
              <Input
                type="number"
                placeholder="Kalori Miktarı"
                value={attribute.calorieAmount}
                onChange={(e) => handleChange(e, index)}
                name="calorieAmount"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Button onClick={() => handleRemoveUnit(index)}>Sil</Button>
          </Col>
        </Row>
      ))}
      <Button onClick={handleAddUnit}>Besin Değeri Ekle</Button>
      <Form.Item>
        <Row justify="center">
          <Button
            type="primary"
            htmlType="submit"
            style={{ backgroundColor: "#ef7927", borderColor: "#ef7927" }}
          >
            Ekle
          </Button>
        </Row>
      </Form.Item>
    </Form>
  );
};

export default AddReadyFood;
