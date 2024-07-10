import React, { useState, useEffect } from "react";
import { Select, Card } from "antd";
import axios from "axios";
import moment from "moment";
import "moment/locale/tr";

const { Option } = Select;

const Comments = () => {
  const [receipts, setReceipts] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [comments, setComments] = useState([]);
  moment.locale("tr");

  const token = localStorage.getItem("token");
  useEffect(() => {
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

    fetchReceipts();
  }, []);

  const handleReceiptSelect = async (receiptId) => {
    setSelectedReceipt(receiptId);
    try {
      const response = await axios.get(
        `https://api.colyakdiyabet.com.tr/api/comments/receipt/${receiptId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Select Receipt</h1>
      <Select
        style={{ width: 200 }}
        placeholder="Select a receipt"
        onChange={handleReceiptSelect}
      >
        {receipts.map((receipt) => (
          <Option key={receipt.id} value={receipt.id}>
            {receipt.receiptName}
          </Option>
        ))}
      </Select>
      {selectedReceipt && (
        <div style={{ marginTop: "20px" }}>
          <h2>Yorumlar</h2>
          {comments.map((comment) => (
            <Card key={comment.id} style={{ marginBottom: "10px" }}>
              <p>
                <strong>User:</strong> {comment.userName}
              </p>
              <p>
                <strong>Receipt:</strong> {comment.receiptName}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {moment(comment.createdDate).format("Do MMMM YYYY, HH:mm:ss")}
              </p>
              <p>
                <strong>Comment:</strong> {comment.comment}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comments;