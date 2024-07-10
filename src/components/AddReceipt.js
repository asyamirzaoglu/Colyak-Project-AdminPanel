import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, AutoComplete, Row, Col, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import AddNutritionalValues from "./AddNutritionalValues";
import { alignProperty } from "@mui/material/styles/cssUtils";

const { Option } = Select;

const AddReceipt = ({ onClose }) => {
  const [formData, setFormData] = useState({
    ingredients: [],
    ingredientInput: "",
    amountInput: "",
    unitInput: "",
    recipeName: "",
    totalAmount: "",
    receiptDetails: "",
    nutritionalValuesList: [],
    image: null,
    imageId: null,
    newReceiptId: null,
  });
  const [types, setTypes] = useState([]);
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await axios.get('https://api.colyakdiyabet.com.tr/api/receipts/types', {
          headers: {
            Authorization: `Bearer ${token}`, // Authorization başlığını ekle
          },
        });        setTypes(response.data);
      } catch (error) {
        console.error('Error fetching types:', error);
      }
    };

    fetchTypes();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const token = localStorage.getItem("token");

  const handleImageChange = (info) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
      // imageData doğru şekilde alınıyor mu, kontrol edelim:
      console.log("info.file.originFileObj:", info.file.originFileObj);
      setFormData((prevData) => ({
        ...prevData,
        image: info.file.originFileObj,
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
      const formDataObj = new FormData(); // Yeni bir FormData nesnesi oluştur
      formDataObj.append("file", formData.image); // Resmi FormData'ya ekle

      try {
        console.log("FormData:", formDataObj); // FormData'yi konsola yazdır
        const response = await axios.post(
          "https://api.colyakdiyabet.com.tr/api/image/addImage",
          formDataObj,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Response:", response); // Cevabı konsola yazdır
        console.log("Image uploaded successfully", response.data);
        console.log("formdataobj",formDataObj);
        console.log("formdataiçerik",formData);
        const imageId = response.data;
        console.log("imageId",imageId);
        setFormData((prevData) => ({
          ...prevData,
          imageId: imageId, // Görsel kimliğini formData'ya ekle
        }));
  
        return imageId; 
      } catch (error) {
        console.error("Error uploading image", error);
      }
    }
  };

  const addIngredientHandler = () => {
    const { ingredientInput, amountInput, unitInput } = formData;
    if (
      ingredientInput.trim() !== "" &&
      amountInput.trim() !== "" &&
      unitInput.trim() !== ""
    ) {
      const newIngredient = {
        name: ingredientInput,
        amount: amountInput,
        unit: unitInput,
      };
      setFormData((prevData) => ({
        ...prevData,
        ingredients: [...prevData.ingredients, newIngredient],
        ingredientInput: "",
        amountInput: "",
      }));
    }
  };

  const removeIngredientHandler = (indexToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      ingredients: prevData.ingredients.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleSubmit = async () => {
    const imageId = await uploadImage();

    const { ingredients, receiptDetails, nutritionalValuesList, ...otherData } = formData;
    
    const receiptData = {
      receiptDetails: [formData.receiptDetails],
      receiptItems: ingredients.map((ingredient) => ({
        productName: capitalizeFirstLetter(ingredient.name.toLowerCase()),
        unit: parseFloat(ingredient.amount),
        type: capitalizeFirstLetter(ingredient.unit.toLowerCase()),
      })),
      receiptName: formData.recipeName,
      nutritionalValuesList: nutritionalValuesList.map((item) => ({
        unit:item.unit,
        type: item.type,
        fatAmount: item.fatAmount,
        carbohydrateAmount: item.carbohydrateAmount,
        proteinAmount: item.proteinAmount,
        calorieAmount: item.calorieAmount,
      })),
      imageId: imageId,
    };

    console.log("receiptData",receiptData);

    try {
      const response = await axios.post(
        "https://api.colyakdiyabet.com.tr/api/receipts/create",
        receiptData,
        {
          headers: {
            Authorization: `Bearer ${token}`,

          },
        }
      );
      console.log("Response:", response.data);
      const newReceiptId = response.data.id;
      setFormData((prevData) => ({
        ...prevData,
        newReceiptId: newReceiptId,
      }));
      onClose();
    } catch (error) {
      console.error("Error:", error);
    }
  };


  return (
    <Form
      name="addForm"
      onFinish={handleSubmit}
      labelAlign="top"
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "24px",
          fontWeight: "bold",
          marginBottom: "10px",
        }}
      >
        {"Tarif Ekle"}
      </h1>
      <Form.Item
        name="recipeName"
        label="Tarif Adı"
        rules={[{ required: true, message: "Bu alanı doldurmak zorunludur." }]}
      >
        <Input
          placeholder="Tarifin Adını Giriniz"
          value={formData.recipeName}
          onChange={handleChange}
          name="recipeName"
        />
      </Form.Item>
      <Form.Item name="ingredients" label="Malzemeler">
        <Input.Group>
          <Row gutter={16}>
            <Col span={8}>
              <Input
                style={{ marginBottom: "5px", borderRadius: "5px" }}
                placeholder="Malzeme Adı"
                value={formData.ingredientInput}
                onChange={handleChange}
                name="ingredientInput"
              />
            </Col>
            <Col span={8}>
              <Input
                style={{ marginBottom: "5px", borderRadius: "5px" }}
                type="number"
                placeholder="Malzemenin Miktarı (Sayısal Değeri)"
                value={formData.amountInput}
                onChange={handleChange}
                name="amountInput"
              />
            </Col>
            <Col span={8}>
            <AutoComplete
                options={types.map((type) => ({ value: type }))}
                filterOption={(inputValue, option) =>
                  option ? option.value.toLowerCase().includes(inputValue.toLowerCase()) : false
                }
                onBlur={(e) => {
                  const searchText = e.target.value;
                  if (searchText && !types.includes(searchText)) {
                    setTypes((prevTypes) => [...prevTypes, searchText]);
                  }
                }}
                value={formData.unitInput}
                onChange={(value) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    unitInput: value,
                  }))
                }
                placeholder="Malzeme İçin Ölçü Birimi Seçin"
                style={{ width: "100%" }}
              />
            </Col>
          </Row>
          <Button onClick={addIngredientHandler}>Malzeme Ekle</Button>
          <div style={{ overflow: "hidden" }}>
            {formData.ingredients.map((ingredient, index) => (
              <div
                key={index}
                className="list-item"
                style={{ marginBottom: "10px", marginTop: "10px" }}
              >
                {ingredient.amount} {ingredient.unit} {ingredient.name}
                <Button
                  style={{
                    borderRadius: "100px",
                    height: "30px",
                    width: "115px",
                    float: "right",
                  }}
                  onClick={() => removeIngredientHandler(index)}
                >
                  Malzemeyi Sil
                </Button>
              </div>
            ))}
          </div>
        </Input.Group>
      </Form.Item>
      <Form.Item name="receiptDetails" label="Açıklama"   rules={[{ required: true, message: "Bu alanı doldurmak zorunludur." }]}>
        <Input.TextArea
          placeholder="Yapılışı"
          value={formData.receiptDetails}
          onChange={handleChange}
          name="receiptDetails"
        />
      </Form.Item>
      <AddNutritionalValues formData={formData} setFormData={setFormData} />
      <Form.Item name="image" label="Resim">
        <Upload
          accept="image/*"
          beforeUpload={(file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              setFormData((prevData) => ({
                ...prevData,
                imagePreview: e.target.result, // Önizleme için resim verisi
                 image: file,
              }));
            };
            reader.readAsDataURL(file); // Resmi oku ve veri URL'sine dönüştür
            console.log("file",file);
          }}
          customRequest={() => {}}
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

export default AddReceipt;