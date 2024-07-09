import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Image, Input, Form, Switch, Space, Popconfirm } from "antd";
import { CheckOutlined, CloseOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const ReadyFoodsList = () => {
  const [loading, setLoading] = useState(false);
  const [readyFoods, setReadyFoods] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReadyFood, setSelectedReadyFood] = useState(null);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [updateName, setUpdateName] = useState("");
  const [updateCode, setUpdateCode] = useState("");
  const [updateGlutenFree, setUpdateGlutenFree] = useState(false);
  const [updateImageId, setUpdateImageId] = useState(null);
  const [updateNutritionalValues, setUpdateNutritionalValues] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchReadyFoods();
  }, []);

  const fetchReadyFoods = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://api.colyakdiyabet.com.tr/api/barcodes/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReadyFoods(response.data);
    } catch (error) {
      console.error("Data alınırken hata oluştu:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteReadyFood = async (id) => {
    try {
      await axios.delete(
        `https://api.colyakdiyabet.com.tr/api/barcodes/delete/byId/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReadyFoods((prevReadyFoods) =>
        prevReadyFoods.filter((readyFood) => readyFood.id !== id)
      );
    } catch (error) {
      console.error("Hazır yiyecek silinirken bir hata oluştu:", error);
    }
  };

  const updateReadyFood = async () => {
    try {
      const response = await axios.put(
        `https://api.colyakdiyabet.com.tr/api/barcodes/put/byId/${selectedReadyFood.id}`,
        {
          name: updateName,
          code: updateCode,
          glutenFree: updateGlutenFree,
          imageId: updateImageId,
          nutritionalValuesList: updateNutritionalValues,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedFood = response.data;
      setReadyFoods((prevReadyFoods) =>
        prevReadyFoods.map((readyFood) =>
          readyFood.id === updatedFood.id ? updatedFood : readyFood
        )
      );
      setUpdateModalVisible(false);
    } catch (error) {
      console.error("Hazır yiyecek güncellenirken bir hata oluştu:", error);
    }
  };

  const handleViewContentClick = (record) => {
    setSelectedReadyFood(record);
    setModalVisible(true);
  };

  const showDeleteConfirm = (id) => {
    Modal.confirm({
      title: "Hazır Gıda Sil",
      content: "Bu hazır gıdayı silmek istediğinizden emin misiniz?",
      okText: "Evet",
      okType: "danger",
      cancelText: "Hayır",
      onOk() {
        deleteReadyFood(id);
      },
    });
  };

  const handleUpdateClick = (record) => {
    setSelectedReadyFood(record);
    setUpdateName(record.name);
    setUpdateCode(record.code);
    setUpdateGlutenFree(record.glutenFree);
    setUpdateImageId(record.imageId);
    setUpdateNutritionalValues(record.nutritionalValuesList);
    setUpdateModalVisible(true);
  };

  const updateFormLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const handleAddNutritionalValue = () => {
    const newNutritionalValue = {
      id: updateNutritionalValues.length + 1,
      unit: "",
      type: "",
      carbohydrateAmount: "",
      proteinAmount: "",
      fatAmount: "",
      calorieAmount: "",
    };
    setUpdateNutritionalValues([...updateNutritionalValues, newNutritionalValue]);
  };

  const handleDeleteNutritionalValue = (id) => {
    const updatedNutritionalValues = updateNutritionalValues.filter(item => item.id !== id);
    setUpdateNutritionalValues(updatedNutritionalValues);
  };

  const handleNutritionalValueChange = (field, value, index) => {
    const updatedNutritionalValues = [...updateNutritionalValues];
    updatedNutritionalValues[index] = {
      ...updatedNutritionalValues[index],
      [field]: value,
    };
    setUpdateNutritionalValues(updatedNutritionalValues);
  };

  const columns = [
    {
      title: "Ürün Adı",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Barkod Kodu",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Glutensiz mi",
      dataIndex: "glutenFree",
      key: "glutenFree",
      render: (glutenFree) =>
        glutenFree ? <CheckOutlined /> : <CloseOutlined />,
    },
    {
      title: "İşlemler",
      key: "actions",
      render: (text, record) => (
        <Space>
          <Button onClick={() => handleViewContentClick(record)}>
            İçeriği Görüntüle
          </Button>
          <Popconfirm
            title="Bu hazır gıdayı silmek istediğinizden emin misiniz?"
            onConfirm={() => deleteReadyFood(record.id)}
            okText="Evet"
            cancelText="Hayır"
          >
            <Button >Sil</Button>
          </Popconfirm>
          <Button onClick={() => handleUpdateClick(record)}>Güncelle</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={readyFoods}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title="Hazır Gıda İçeriği"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <p>
          {selectedReadyFood?.name}
          <br />
          {selectedReadyFood?.imageId && (
            <div style={{ marginTop: "16px" }}>
              <p>Görsel:</p>
              <Image
                width={200}
                src={`https://api.colyakdiyabet.com.tr/api/image/get/${selectedReadyFood.imageId}`}
              />
            </div>
          )}
          Besin Değerleri:
        </p>
        {selectedReadyFood?.nutritionalValuesList?.map((attr, index) => (
          <div key={index} style={{ marginBottom: "8px" }}>
            <span style={{ marginRight: "16px", fontWeight: "bold" }}>
              {attr.unit} {attr.type}:
            </span>
            <span style={{ marginRight: "16px" }}>
              {attr.carbohydrateAmount} gr karbonhidrat
            </span>
            <span style={{ marginRight: "16px" }}>
              {attr.proteinAmount} gr protein
            </span>
            <span style={{ marginRight: "16px" }}>{attr.fatAmount} gr yağ</span>
            <span>{attr.calorieAmount} kcal</span>
          </div>
        ))}
      </Modal>

      <Modal
        title="Hazır Gıda Güncelle"
        visible={updateModalVisible}
        onCancel={() => setUpdateModalVisible(false)}
        onOk={updateReadyFood}
        okText="Kaydet"
        cancelText="İptal"
        okButtonProps={{ style: {  borderColor: '#ef7927', color: 'white', backgroundColor:"#ef7927" } }}
        cancelButtonProps={{style:{backgroundColor:"white",color:"black",borderColor:"rgba(0, 0, 0, 0.2)"}}}
      >
        <Form {...updateFormLayout}>
          <Form.Item label="Ürün Adı">
            <Input
              value={updateName}
              onChange={(e) => setUpdateName(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Barkod Kodu">
            <Input
              value={updateCode}
              onChange={(e) => setUpdateCode(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Glutensiz mi">
            <Switch
              checked={updateGlutenFree}
              onChange={(checked) => setUpdateGlutenFree(checked)}
            />
          </Form.Item>
          <Form.Item label="Görsel">
            {updateImageId && (
              <Image
                width={200}
                src={`https://api.colyakdiyabet.com.tr/api/image/get/${updateImageId}`}
              />
            )}
          </Form.Item>
          <Form.Item label="Besin Değerleri">
  {updateNutritionalValues.map((attr, index) => (
    <div key={index} style={{ marginBottom: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ flexBasis: "45%", marginRight: "8px",marginTop:"5px " }}>
          <label>Birim:</label>
          <Input
            value={attr.unit}
            onChange={(e) =>
              handleNutritionalValueChange("unit", e.target.value, index)
            }
          />
        </div>
        <div style={{ flexBasis: "45%",marginTop:"5px "  }}>
          <label>Tür:</label>
          <Input
            value={attr.type}
            onChange={(e) =>
              handleNutritionalValueChange("type", e.target.value, index)
            }
          />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
        <div style={{ flexBasis: "45%", marginRight: "8px" }}>
          <label>Karbonhidrat:</label>
          <Input
            value={attr.carbohydrateAmount}
            onChange={(e) =>
              handleNutritionalValueChange("carbohydrateAmount", e.target.value, index)
            }
          />
        </div>
        <div style={{ flexBasis: "45%" }}>
          <label>Protein:</label>
          <Input
            value={attr.proteinAmount}
            onChange={(e) =>
              handleNutritionalValueChange("proteinAmount", e.target.value, index)
            }
          />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
        <div style={{ flexBasis: "45%", marginRight: "8px" }}>
          <label>Yağ:</label>
          <Input
            value={attr.fatAmount}
            onChange={(e) =>
              handleNutritionalValueChange("fatAmount", e.target.value, index)
            }
          />
        </div>
        <div style={{ flexBasis: "45%" }}>
          <label>Kalori:</label>
          <Input
            value={attr.calorieAmount}
            onChange={(e) =>
              handleNutritionalValueChange("calorieAmount", e.target.value, index)
            }
          />
        </div>
      </div>
      <div style={{ marginTop: "8px", textAlign: "right" }}>
        <Button
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteNutritionalValue(attr.id)}
          style={{borderColor:"red",color:"red",marginTop:"5px"}}
        >
          Besin Değerlerini Sil
        </Button>
      </div>
    </div>
  ))}
  <Button
    type="dashed"
    onClick={handleAddNutritionalValue}
    style={{ width: "100%", marginTop: "8px" }}
    icon={<PlusOutlined />}
  >
    Besin Değeri Ekle
  </Button>
</Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ReadyFoodsList;
