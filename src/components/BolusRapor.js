import React, { useState, useEffect } from "react";
import { Table, DatePicker, Space, Input, Button, Modal, Select, Row } from "antd";
import axios from "axios";
import moment from "moment";
import "moment/locale/tr"; // Türkçe locale eklemek için

const { RangePicker } = DatePicker;
const { Option } = Select;

const BolusRapor = ({ onClose }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [mealData, setMealData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [userList, setUserList] = useState([]);

  const token = localStorage.getItem("token");

  const handleDateChange = (dates) => {
    if (dates) {
      setStartDate(dates[0]);
      setEndDate(dates[1]);
    } else {
      setStartDate(null);
      setEndDate(null);
    }
  };
  moment.locale("tr");

  const fetchUserList = async () => {
    try {
      const response = await axios.get(
        "https://api.colyakdiyabet.com.tr/api/users/verify/ListAll",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserList(response.data);
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  const fetchReadyFood = async (id) => {
    try {
      const response = await axios.get(
        `https://api.colyakdiyabet.com.tr/api/barcodes/get/byId/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserList(response.data);
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  const fetchReceipt = async (id) => {
    try {
      const response = await axios.get(
        `https://api.colyakdiyabet.com.tr/api/receipts/getbyId/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserList(response.data); 
    } catch (error) {
      console.error("Error fetching user list:", error);
    }
  };

  const fetchData = async () => {
    try {
      if (selectedUser && startDate && endDate) {
        const response = await axios.get(
          `https://api.colyakdiyabet.com.tr/api/meals/report/${selectedUser}/${startDate.format(
            "YYYY-MM-DD"
          )}/${endDate.format("YYYY-MM-DD")}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data;
        console.log(data);
        setMealData(data);
      }
    } catch (error) {
      console.error("Error fetching meal data:", error);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  useEffect(() => {
    fetchData();
  }, [selectedUser, startDate, endDate]);

  const handleDetailClick = (meal) => {
    setSelectedMeal(meal);
    setModalVisible(true);
  };
  const renderMealDetails = (meal) => {
    return (
      <div style={{ marginTop: "10px" }}>
        <p>
          <strong>Bolus Detayları</strong>
          <ul>
            <li>
              <strong>Blood Sugar:</strong> {meal.bolus.bloodSugar}
            </li>
            <li>
              <strong>Target Blood Sugar:</strong> {meal.bolus.targetBloodSugar}
            </li>
            <li>
              <strong>Insulin Tolerate Factor:</strong>{" "}
              {meal.bolus.insulinTolerateFactor}
            </li>
            <li>
              <strong>Total Carbohydrate:</strong>{" "}
              {meal.bolus.totalCarbonhydrate}
            </li>
            <li>
              <strong>Insulin Carbohydrate Ratio:</strong>{" "}
              {meal.bolus.insulinCarbonhydrateRatio}
            </li>
            <li>
              <strong>Bolus Value:</strong> {meal.bolus.bolusValue}
            </li>
          </ul>
        </p>
        <p>
          <strong>Yemek Listesi</strong>
          <Table
            dataSource={meal.foodResponseList.map((food) => {
              let foodName = "";
              if (food.foodType === "RECEIPT") {
                fetchReceipt(food.foodId)
                  .then((response) => {
                    foodName = response.data.name;
                  })
                  .catch((error) => {
                    console.error("Error fetching receipt:", error);
                  });
              } else if (food.foodType === "READYFOOD") {
                fetchReadyFood(food.foodId)
                  .then((response) => {
                    foodName = response.data.name;
                  })
                  .catch((error) => {
                    console.error("Error fetching ready food:", error);
                  });
              }
              return {
                foodName: food.foodName,
                carbonhydrate: food.carbonhydrate,
              };
            })}
            columns={[
              {
                title: "Food Name",
                dataIndex: "foodName",
                key: "foodName",
              },
              {
                title: "Carbohydrate",
                dataIndex: "carbonhydrate",
                key: "carbonhydrate",
              },
            ]}
            pagination={false}
          />
        </p>
      </div>
    );
  };
  const columns = [
    {
      title: "Tarih ve Saat",
      dataIndex: "date",
      key: "date",
      render: (text) => {
        const date = moment(text);
        const monthName = date.format("MMMM");
        const day = date.format("DD");
        const year = date.format("YYYY");
        const time = date.format("HH:mm:ss");
        return <span>{`${day} ${monthName} ${year} - ${time}`}</span>;
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => (
        <Button onClick={() => handleDetailClick(record)}>Details</Button>
      ),
    },
  ];

  return (
    <div style={{width:"max-content"}}>
      <h1 style={{textAlign:"center",fontSize: "24px"}}>Öğün Listesi ve Bolus Değeri</h1>
      <Space direction="vertical" style={{ marginBottom: 16 }}>
        <Row><Select
          placeholder="Kullanıcı Seçiniz"
          onChange={(value) => setSelectedUser(value)}
          style={{ width: 300,marginRight:"20px" }}
        >
          {userList.map((user) => (
            <Option key={user.email} value={user.email}>
              {user.name}
            </Option>
          ))}
        </Select>
        <RangePicker onChange={handleDateChange} />
        <Button
          type="primary"
          onClick={fetchData}
          style={{ backgroundColor: "#ef7927", borderColor: "#ef7927", marginLeft:"390px"}}
        >
          Listele
        </Button>
        </Row>
      </Space>
      <Table dataSource={mealData} columns={columns} />
      <Modal
        title="Meal Details"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        {selectedMeal && renderMealDetails(selectedMeal)}
      </Modal>
    </div>
  );
};

export default BolusRapor;