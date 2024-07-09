import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Image, Form, Input, Select } from "antd";
import axios from "axios";
import AddReadyFoods from "./AddReadyFood";
import AddReceipt from "./AddReceipt";
import { PlusOutlined } from "@ant-design/icons";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const { Option } = Select;

const Listeler = () => {
  const [receipts, setReceipts] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newModalVisible, setNewModalVisible] = useState(false);
  const [updateFormVisible, setUpdateFormVisible] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [itemFormData, setItemFormData] = useState({});
  const [selectedFormType, setSelectedFormType] = useState("recipe");
  const [editItemModalVisible, setEditItemModalVisible] = useState(false);

  const token = localStorage.getItem("token");

  const unitOptions = ["gram", "kg", "ml", "litre", "adet"];
  const uppercaseUnitOptions = unitOptions.map((option) =>
    option.toUpperCase()
  );

  const [updateFormData, setUpdateFormData] = useState({
    receiptName: "",
    receiptDetails: [""],
    receiptItems: [],
    nutritionalValuesList: [
      {
        unit: "",
        type: "",
        carbohydrateAmount: 0,
        proteinAmount: 0,
        fatAmount: 0,
        calorieAmount: 0,
      },
    ],
    imageId: 0,
  });

  useEffect(() => {
    fetchReceipts();
  }, []);
  const fetchReceipts = async () => {
    try {
      const response = await axios.get(
        "https://api.colyakdiyabet.com.tr/api/receipts/getAll/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReceipts(response.data);
    } catch (error) {
      console.error("Error fetching receipts:", error);
    }
  };
  const handleDetailClick = (receipt) => {
    setSelectedReceipt(receipt);
    setModalVisible(true);
  };

  const handleDeleteClick = (id) => {
    Modal.confirm({
      title: "Tarifi Sil",
      content: "Bu tarifi silmek istediğinize emin misiniz?",
      okText: "Sil",
      okType: "danger",
      cancelText: "İptal",
      onOk() {
        confirmDelete(id);
      },
    });
  };

  const handleUpdateClick = (receipt) => {
    setUpdateFormData(receipt);
    setUpdateFormVisible(true);
  };

  const confirmDelete = async (id) => {
    try {
      await deleteReceipt(id);
      setReceipts((prevReceipts) =>
        prevReceipts.filter((receipt) => receipt.id !== id)
      );
    } catch (error) {
      console.error("Tarif silinirken bir hata oluştu:", error);
    }
  };

  const deleteReceipt = async (id) => {
    try {
      await axios.delete(
        `https://api.colyakdiyabet.com.tr/api/receipts/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Tarif silinirken bir hata oluştu:", error);
      throw new Error("Tarif silinirken bir hata oluştu:", error);
    }
  };

  const handleUpdateFormSubmit = async () => {
    try {
      // 1. Tarif detaylarını güncelle
      const updatedReceiptResponse = await axios.put(
        `https://api.colyakdiyabet.com.tr/api/receipts/update/${updateFormData.id}`,
        updateFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 2. Yeni bir görsel seçildiyse görseli güncelle
      if (updateFormData.newImageFile) {
        const imageFormData = new FormData();
        imageFormData.append("file", updateFormData.newImageFile);

        // API'yi çağırarak görseli güncelle
        const imageUpdateResponse = await axios.put(
          `https://api.colyakdiyabet.com.tr/api/image/updateImage/${updateFormData.imageId}`,
          imageFormData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Görsel güncellendi:", imageUpdateResponse.data);
      }
       // 3. Güncellenmiş veriyi doğrudan state'e ekleyerek sayfayı güncelle
    const updatedReceipts = receipts.map((receipt) =>
      receipt.id === updateFormData.id ? updatedReceiptResponse.data : receipt
    );
    setReceipts(updatedReceipts);

    setUpdateFormVisible(false);
  } catch (error) {
    console.error("Tarif güncellenirken bir hata oluştu:", error);
  }
};
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setUpdateFormData({
      ...updateFormData,
      newImageFile: file,
    });
  };
  const handleItemAmountChange = (value, index) => {
    const updatedItems = [...updateFormData.receiptItems];
    updatedItems[index].unit = value; 
    setUpdateFormData({
      ...updateFormData,
      receiptItems: updatedItems,
    });
  };
  
  const handleItemUnitChange = (value, index) => {
    const updatedItems = [...updateFormData.receiptItems];
    updatedItems[index].type = value; 
    setUpdateFormData({
      ...updateFormData,
      receiptItems: updatedItems,
    });
  };
  

  const handleItemNameChange = (value, index) => {
    const updatedItems = [...updateFormData.receiptItems];
    updatedItems[index].productName = value; 
    setUpdateFormData({
      ...updateFormData,
      receiptItems: updatedItems,
    });
  };
  
  const handleAddItem = () => {
    setUpdateFormData({
      ...updateFormData,
      receiptItems: [
        ...updateFormData.receiptItems,
        {
          amount: "",
          measurementUnit: "",
          productName: "",
        },
      ],
      nutritionalValuesList: [
        ...updateFormData.nutritionalValuesList,
        {
          unit: "",
          type: "", 
          productName: "",
          proteinAmount: 0,
          carbohydrateAmount: 0,
          fatAmount: 0,
          calorieAmount: 0,
        },]
    });
  };
  const moveItem = (dragIndex, hoverIndex) => {
    const draggedItem = updateFormData.receiptItems[dragIndex];
    const updatedItems = [...updateFormData.receiptItems];
    updatedItems.splice(dragIndex, 1);
    updatedItems.splice(hoverIndex, 0, draggedItem);
    setUpdateFormData({
      ...updateFormData,
      receiptItems: updatedItems,
    });
  };
  const Item = ({ item, index }) => {
    const ref = React.useRef(null);
    const [, drop] = useDrop({
      accept: "ITEM",
      hover: (draggedItem) => {
        if (draggedItem.index !== index) {
          moveItem(draggedItem.index, index);
          draggedItem.index = index;
        }
      },
    });
  
    const [{ isDragging }, drag] = useDrag({
      type: "ITEM",
      item: { type: "ITEM", index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });
  
    drag(drop(ref));
  
    return (
      <div ref={ref} style={{ marginBottom: "10px", opacity: isDragging ? 0.5 : 1 }}>
        <Input
          placeholder="Miktar"
          value={item.unit}
          onChange={(e) => handleItemAmountChange(e.target.value, index)}
          style={{ width: "20%", marginRight: "5px" }}
        />
        <Select
          placeholder="Birim"
          value={item.type}
          onChange={(value) => handleItemUnitChange(value, index)}
          style={{ width: "30%", marginRight: "5px" }}
        >
          {uppercaseUnitOptions.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>
        <Input
          placeholder="Ürün Adı"
          value={item.productName}
          onChange={(e) => handleItemNameChange(e.target.value, index)}
          style={{ width: "30%" }}
        />
        <Button
          onClick={() => handleRemoveItem(index)}
          style={{marginLeft:"20px"}}
        >
          Sil
        </Button>
      </div>
    );
  };
  const handleNutritionalValueChange = (value, index, field) => {
    const updatedNutritionalValues = [...updateFormData.nutritionalValuesList];
    updatedNutritionalValues[index] = {
      ...updatedNutritionalValues[index],
      [field]: value,
    };
    setUpdateFormData({
      ...updateFormData,
      nutritionalValuesList: updatedNutritionalValues,
    });
  };
  
  const handleRemoveItem = (index) => {
    const updatedItems = [...updateFormData.receiptItems];
    updatedItems.splice(index, 1);
    setUpdateFormData({
      ...updateFormData,
      receiptItems: updatedItems,
    });
  };
  
    const renderReceiptDetails = (receipt) => {
      return (
        <div style={{ marginTop: "10px" }}>
          <p>
            <strong>Tarif Adı:</strong> {receipt.receiptName}
          </p>
          {receipt.imageId && (
    <div>
      <img
        src={`https://api.colyakdiyabet.com.tr/api/image/get/${receipt.imageId}`}
        alt="Receipt Image"
        style={{ marginTop: "10px",  
          maxWidth: "100%", 
          height: "auto" }}
      />
    </div>
  )}
          <p>
            <strong>Detaylar:</strong>
            <ul>
              {receipt.receiptDetails &&
                receipt.receiptDetails.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
            </ul>
          </p>

          <p>
            <strong>Malzemeler:</strong>
            <ul>
              {receipt.receiptItems &&
                receipt.receiptItems.map((item, index) => (
                  <li key={index}>
                    {item.unit} {item.type} {item.productName}
                  </li>
                ))}
            </ul>
          </p>
          <p>
          <strong>Besin Değerleri:</strong>
          <ul>
            {receipt.nutritionalValuesList &&
            receipt.nutritionalValuesList.length > 0 ? (
              receipt.nutritionalValuesList.map((nutritionalValue, index) => (
                <li key={index}>
                  <strong>Ölçü Birimi:</strong> {nutritionalValue.type}
                  <br />
                  <strong>Protein:</strong> {nutritionalValue.proteinAmount}
                  <br />
                  <strong>Karbonhidrat:</strong>{" "}
                  {nutritionalValue.carbohydrateAmount}
                  <br />
                  <strong>Yağ:</strong> {nutritionalValue.fatAmount}
                  <br />
                  <strong>Kalori:</strong> {nutritionalValue.calorieAmount}
                </li>
              ))
            ) : (
              <li>Makro besin değerleri mevcut değil.</li>
            )}
          </ul>
        </p>
        
        </div>
      );
    };

  const columns = [
    {
      title: "Tarif Adı",
      dataIndex: "receiptName",
      key: "receiptName",
      render: (text, record) => (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{text}</span>
            <div>
              <Button
                style={{ marginLeft: "10px",colors:"#ef7927"}}
                onClick={() => handleDetailClick(record)}
              >
                Detaylar
              </Button>
              <Button
                style={{ marginLeft: "10px" }}
                onClick={() => handleDeleteClick(record.id)}
              >
                Sil
              </Button>
              <Button
                style={{ marginLeft: "10px" }}
                onClick={() => handleUpdateClick(record)}
              >
                Güncelle
              </Button>
            </div>
          </div>
        </>
      ),
    },
  ];

  const handleFormSelection = (type) => {
    setSelectedFormType(type);

    if (type === "recipe" || type === "readyFood") {
      setNewModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setNewModalVisible(false);
    fetchReceipts();
  };

  const handleAddNew = () => {
    setNewModalVisible(true);
  };

  return (
    <div>
      <h2
        style={{
          textAlign: "center",
          fontSize: "24px",
          fontWeight: "bold",
          marginBottom: "25px",
        }}
      >
        Tarifler ve Hazır Gıdalar Listesi
      </h2>
      <Button
        style={{ backgroundColor: "#ef7925" }}
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAddNew}
      />
      <Table dataSource={receipts} columns={columns} />
      <Modal
        title="Tarif Detayları"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        {selectedReceipt && renderReceiptDetails(selectedReceipt)}
      </Modal>
      <Modal
        visible={newModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={900}
      >
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontSize: "17px",
              fontWeight: "-moz-initial",
              marginBottom: "10px",
            }}
          >
            Ne eklemek istersiniz?
          </p>
          <Select
            defaultValue="recipe"
            style={{ width: 200, marginBottom: "20px" }}
            onChange={handleFormSelection}
          >
            <Option value="recipe">Tarif Ekle</Option>
            <Option value="readyFood">Hazır Gıda Ekle</Option>
          </Select>
          {selectedFormType === "recipe" && (
            <AddReceipt onClose={handleCloseModal} />
          )}
          {selectedFormType === "readyFood" && (
            <AddReadyFoods onClose={handleCloseModal} />
          )}
        </div>
      </Modal>
      <Modal
        title="Tarif Güncelle"
        visible={updateFormVisible}
        onCancel={() => setUpdateFormVisible(false)}
        onOk={handleUpdateFormSubmit}
        okText="Kaydet"
        cancelText="İptal" 
        okButtonProps={{ style: {  borderColor: '#ef7927', color: 'white', backgroundColor:"#ef7927" } }}
        cancelButtonProps={{style:{backgroundColor:"white",color:"black",borderColor:"rgba(0, 0, 0, 0.2)"}}}
      >
        <Form>
          <Form.Item label="Tarif Adı">
            <Input
              value={updateFormData.receiptName}
              onChange={(e) =>
                setUpdateFormData({
                  ...updateFormData,
                  receiptName: e.target.value,
                })
              }
            />
          </Form.Item>
          <Form.Item label="Tarif Detayları">
            <Input.TextArea
              value={updateFormData.receiptDetails.join("\n")}
              onChange={(e) =>
                setUpdateFormData({
                  ...updateFormData,
                  receiptDetails: e.target.value.split("\n"),
                })
              }
            />
          </Form.Item>
          <Form.Item label="Görsel Değiştir">
            <Input type="file" onChange={handleImageChange} />
          </Form.Item>
          
          <Form.Item label="Malzemeler">
    <DndProvider backend={HTML5Backend}>
      {updateFormData.receiptItems.map((item, index) => (
        <Item key={index} item={item} index={index} />
      ))}
    </DndProvider>
    <Button type="dashed" onClick={handleAddItem} style={{ marginTop: "10px" }}>
      Malzeme Ekle
    </Button>
  </Form.Item>
  <Form.Item>
  {updateFormData.nutritionalValuesList.map((nutritionalValue, index) => (
    <div key={index}>
       <label style={{ fontWeight: 'bold'}}>Besin Değeri Ölçü Birimi:</label>
      <Input
      style={{marginBottom:"10px",marginTop:"5px"}}
        value={nutritionalValue.type}
        onChange={(e) =>
          handleNutritionalValueChange(e.target.value, index, 'type')
        }
      />
      <label style={{marginRight:"10px"}}>Protein:</label>
      <Input
      style={{width:"30%",marginBottom:"10px"}}
        type="number"
        value={nutritionalValue.proteinAmount}
        onChange={(e) =>
          handleNutritionalValueChange(e.target.value, index, 'proteinAmount')
        }
      />
      <label style={{marginRight:"10px",marginLeft:"37px"}}>Karbonhidrat:</label>
      <Input
       style={{width:"30%"}}
        type="number"
        value={nutritionalValue.carbohydrateAmount}
        onChange={(e) =>
          handleNutritionalValueChange(e.target.value, index, 'carbohydrateAmount')
        }
      />
      <label style={{marginRight:"32px"}}>Yağ:</label>
      <Input
       style={{width:"30%"}}
        type="number"
        value={nutritionalValue.fatAmount}
        onChange={(e) =>
          handleNutritionalValueChange(e.target.value, index, 'fatAmount')
        }
      />
      <label style={{marginRight:"56px",marginLeft:"37px"}}>Kalori:</label>
      <Input
       style={{width:"30%"}}
        type="number"
        value={nutritionalValue.calorieAmount}
        onChange={(e) =>
          handleNutritionalValueChange(e.target.value, index, 'calorieAmount')
        }
      />
    </div>
  ))}
</Form.Item>

        </Form>
      </Modal>
    </div>
  );
};

export default Listeler;
