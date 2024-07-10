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
    image: null,
    imagePreview: null,
    imageId: null,
  });

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
      message.success(`${info.file.name} file uploaded successfully`);
      setFormData((prevData) => ({
        ...prevData,
        image: info.file.originFileObj,
        imagePreview: info.file.thumbUrl, // Assuming Ant Design provides thumbUrl for preview
      }));
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };
  const removeImage = () => {
    setFormData((prevData) => ({
      ...prevData,
      image: null,
      imagePreview: null,
    }));
  };

  const uploadImage = async () => {
    if (formData.image) {
      const formDataObj = new FormData();
      formDataObj.append("file", formData.image);

      try {
        const response = await axios.post(
          "https://api.colyakdiyabet.com.tr/api/image/addImage",
          formDataObj,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const imageId = response.data;
        setFormData((prevData) => ({
          ...prevData,
          imageId: imageId,
        }));
        return imageId;
      } catch (error) {
        console.error("Error uploading image", error);
      }
    }
  };

  const handleSubmit = async () => {
    const imageId = await uploadImage();

    const formDataWithImage = {
      ...formData,
      imageId: imageId,
    };

    try {
      const response = await axios.post(
        "https://api.colyakdiyabet.com.tr/api/barcodes/add",
        formDataWithImage,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("Hazır yiyecek başarıyla eklendi!");
      onClose();
    } catch (error) {
      console.error("Error:", error);
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
      {formData.nutritionalValuesList.map((attribute, index) => (
        <Row key={index} gutter={16}>
          <Col span={12}>
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
          <Col span={12}>
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
          <Col span={6}>
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
          <Col span={6}>
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
          <Col span={6}>
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
          <Col span={6}>
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
          <Row>
          <Col>
            <Button onClick={() => handleRemoveUnit(index)}>Sil</Button>
            <Button onClick={handleAddUnit}>Besin Değeri Ekle</Button>
          </Col>
          </Row>
        </Row>
      ))}
      <Form.Item>
      <Form.Item>
  <Upload
    accept="image/*"
    beforeUpload={(file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prevData) => ({
          ...prevData,
          imagePreview: e.target.result,
          image: file,
        }));
      };
      reader.readAsDataURL(file);
      return false; // Prevent Ant Design from uploading automatically
    }}
    onChange={handleImageChange}
    showUploadList={false}
  >
    {formData.imagePreview ? (
      <div>
        <img
          src={formData.imagePreview}
          alt="Resim Önizleme"
          style={{ maxWidth: "100%", marginTop: "10px" }}
        />
        <Button onClick={removeImage} style={{ marginTop: "10px" }}>
          Resmi Sil
        </Button>
      </div>
    ) : (
      <Button icon={<UploadOutlined />}>Resim Yükle</Button>
    )}
  </Upload>
</Form.Item>
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
