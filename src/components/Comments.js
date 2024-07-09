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

/*
import React, { useState, useEffect } from "react";
import { Select, Card, Input, Button } from "antd";
import axios from "axios";
import moment from "moment";
import "moment/locale/tr";

const { Option } = Select;

const Comments = () => {
  const [receipts, setReceipts] = useState([]);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [comments, setComments] = useState([]);
  const [replyTexts, setReplyTexts] = useState({});
  const [replies, setReplies] = useState({});

  moment.locale("tr");

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const response = await axios.get(
          "https://api.colyakdiyabet.com.tr/api/receipt/getAll"
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
        `https://api.colyakdiyabet.com.tr/api/comments/${receiptId}`
      );
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleReplySubmit = async (commentId) => {
    try {
      await axios.post("https://api.colyakdiyabet.com.tr/api/replies/save", {
        userName: "kadiraksoy", // Change this to your username or fetch it from somewhere
        commentId,
        replyText: replyTexts[commentId] || "",
      });
      // Refetch comments after submitting reply
      handleReceiptSelect(selectedReceipt);
      setReplyTexts((prevTexts) => ({
        ...prevTexts,
        [commentId]: "", // Clear reply text input for the current comment
      }));
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  };

  const fetchReplies = async (commentId) => {
    try {
      const response = await axios.get(
        `https://api.colyakdiyabet.com.tr/api/replies/comment/${commentId}`
      );
      setReplies((prevReplies) => ({
        ...prevReplies,
        [commentId]: response.data,
      }));
    } catch (error) {
      console.error("Error fetching replies:", error);
    }
  };

  useEffect(() => {
    if (selectedReceipt) {
      comments.forEach((comment) => {
        fetchReplies(comment.id);
      });
    }
  }, [selectedReceipt, comments]);

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
          <h2>Comments for selected receipt</h2>
          {comments.map((comment) => (
            <Card key={comment.id} style={{ marginBottom: "10px" }}>
              <p>
                <strong>User:</strong> {comment.userName}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {moment(comment.createdDate).format("Do MMMM YYYY, HH:mm:ss")}
              </p>
              <p>
                <strong>Comment:</strong> {comment.comment}
              </p>
              <h3>Replies</h3>
              {replies[comment.id] &&
                replies[comment.id].map((reply) => (
                  <Card
                    key={reply.id}
                    style={{ marginBottom: "5px", marginLeft: "20px" }}
                  >
                    <p>
                      <strong>User:</strong> {reply.userName}
                    </p>
                    <p>
                      <strong>Reply:</strong> {reply.replyText}
                    </p>
                  </Card>
                ))}
              <Input
                value={replyTexts[comment.id] || ""}
                onChange={(e) =>
                  setReplyTexts((prevTexts) => ({
                    ...prevTexts,
                    [comment.id]: e.target.value,
                  }))
                }
                placeholder="Write your reply"
                style={{ marginTop: "10px", width: "60%" }}
              />
              <Button
                type="primary"
                onClick={() => handleReplySubmit(comment.id)}
                style={{ marginTop: "10px" }}
              >
                Reply
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comments;*/
