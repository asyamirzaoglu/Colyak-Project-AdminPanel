import React, { useState, useEffect } from "react";
import { Select, Card, Button, Modal, Input } from "antd";
import axios from "axios";

const { Option } = Select;

const QuizViewer = () => {
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newQuizData, setNewQuizData] = useState({
    topicName: "",
    questionList: [
      {
        question: "",
        choicesList:[{
          choice1: "",
          choice2: "",
          choice3: "",
          choice4:"",
        }],
        correctAnswer: "",
      },
    ],
  });
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [updatedQuizData, setUpdatedQuizData] = useState(null);

  const token = localStorage.getItem("token");
  const fetchQuizzes = async () => {
    try {
      const response = await axios.get(
        "https://api.colyakdiyabet.com.tr/api/quiz/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("API response:", response.data); 
      setQuizzes(response.data);
      if (response.data.length > 0) {
        const initialQuiz = response.data[0];
        setSelectedQuiz(initialQuiz);
        setSelectedQuizId(initialQuiz.id);
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error.response || error.message);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleChange = (value) => {
    const quiz = quizzes.find((q) => q.id === value);
    setSelectedQuiz(quiz);
    setSelectedQuizId(value);
  };
  const handleAddInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedQuestions = [...newQuizData.questionList];
    updatedQuestions[index] = { ...updatedQuestions[index], [name]: value };
    setNewQuizData({ ...newQuizData, questionList: updatedQuestions });
  };

  const handleNewAddQuiz = async () => {
    try {
      await axios.post("https://api.colyakdiyabet.com.tr/api/quiz/add", newQuizData);
      setModalVisible(false);
      setNewQuizData({
        topicName: "",
        questionList: [
          {
            question: "",
            choicesList:[{ 
              choice1: "",
              choice2: "",
              choice3: "",
              choice4:"",
            }],
            correctAnswer: "",
          },
        ],
      });
      fetchQuizzes();
    } catch (error) {
      console.error("Error adding quiz:", error);
    }
  };
  const handleNewDeleteQuiz = async () => {
    try {
      await axios.delete(
        `https://api.colyakdiyabet.com.tr/api/quiz/delete/${quizToDelete.id}`
      );
      // Silinen quiz yerine otomatik olarak gelen quiz'i seç
      const remainingQuizzes = quizzes.filter(
        (quiz) => quiz.id !== quizToDelete.id
      );
      if (remainingQuizzes.length > 0) {
        setSelectedQuiz(remainingQuizzes[0]);
        setSelectedQuizId(remainingQuizzes[0].id);
      } else {
        setSelectedQuiz(null);
        setSelectedQuizId(null);
      }
      fetchQuizzes();
      setDeleteModalVisible(false);
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };
  const handleModalCancel = () => {
    setModalVisible(false);
    setDeleteModalVisible(false);
    setUpdateModalVisible(false);
    setUpdatedQuizData(null);
  };
  const confirmDelete = (quiz) => {
    setQuizToDelete(quiz);
    setDeleteModalVisible(true);
  };

  const handleUpdateButtonClick = () => {
    const copiedQuiz = JSON.parse(JSON.stringify(selectedQuiz));
    setUpdatedQuizData(copiedQuiz);
    setUpdateModalVisible(true);
  };

  const handleUpdateModalCancel = () => {
    setUpdateModalVisible(false);
    setUpdatedQuizData(null);
  };

  const handleUpdateQuiz = async () => {
    try {
      await axios.put(
        `https://api.colyakdiyabet.com.tr/quiz/${selectedQuizId}`,
        updatedQuizData
      );
      setUpdateModalVisible(false);
      setSelectedQuiz(updatedQuizData);
      fetchQuizzes();
    } catch (error) {
      console.error("Error updating quiz:", error);
    }
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    if (updatedQuizData && updatedQuizData.questionList) {
      const updatedQuestions = updatedQuizData.questionList.map(
        (question, i) => {
          if (i === index) {
            return { ...question, [name]: value };
          }
          return question;
        }
      );
      setUpdatedQuizData((prevData) => ({
        ...prevData,
        questionList: updatedQuestions,
      }));
    }
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      question: "",
      choicesList:[{
        choice1: "",
        choice2: "",
        choice3: "",
        choice4:"",
      }],
      correctAnswer: "",
    };
    setUpdatedQuizData((prevData) => ({
      ...prevData,
      questionList: [...prevData.questionList, newQuestion],
    }));
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = [...updatedQuizData.questionList];
    updatedQuestions.splice(index, 1);
    setUpdatedQuizData((prevData) => ({
      ...prevData,
      questionList: updatedQuestions,
    }));
  };

  const handleNewAddQuestion = () => {
    setNewQuizData({
      ...newQuizData,
      questionList: [
        ...newQuizData.questionList,
        {
          question: "",
          choicesList:[{
            choice1: "",
            choice2: "",
            choice3: "",
            choice4: "",
          }],
          correctAnswer: "",
        },
      ],
    });
  };

  const handleNewDeleteQuestion = (index) => {
    const updatedQuestions = [...newQuizData.questionList];
    updatedQuestions.splice(index, 1);
    setNewQuizData({ ...newQuizData, questionList: updatedQuestions });
  };

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: "9999",
        }}
      >
        <Button
          type="primary"
          onClick={() => setModalVisible(true)}
          style={{ marginRight: "10px", marginBottom: "10px" }}
        >
          Quiz Ekle
        </Button>
        <Button
          type="danger"
          onClick={() => confirmDelete(selectedQuiz)}
          style={{ marginBottom: "10px" }}
        >
          Quiz Sil
        </Button>
        <Button
          type="default"
          onClick={handleUpdateButtonClick}
          style={{ marginBottom: "10px", marginLeft: "10px" }}
        >
          Quiz Güncelle
        </Button>
      </div>

      <h1>Quiz Seçin:</h1>
      <Select
        value={selectedQuizId}
        style={{ width: 300 }}
        onChange={handleChange}
      >
        {quizzes.map((quiz) => (
          <Option key={quiz.id} value={quiz.id}>
            {quiz.topicName}
          </Option>
        ))}
      </Select>

      {selectedQuiz && (
        <div style={{ marginTop: "20px" }}>
          <h2>{selectedQuiz.topicName}</h2>
          {selectedQuiz.questionList.map((question, index) => (
            <Card key={question.id} style={{ marginTop: "10px" }}>
              <p>{question.question}</p>
              <ul>
          {question.choicesList.map((choice, choiceIndex) => (
            <li key={choice.id}>
              {String.fromCharCode(65 + choiceIndex)} - {choice.choice}
            </li>
          ))}
        </ul>
              <p>Doğru Cevap: {question.correctAnswer}</p>
            </Card>
          ))}
        </div>
      )}

      <Modal
        title="Yeni Quiz Ekle"
        visible={modalVisible}
        onCancel={handleModalCancel}
        footer={[
          <Button key="cancel" onClick={handleModalCancel}>
            İptal
          </Button>,
          <Button key="submit" type="primary" onClick={handleNewAddQuiz}>
            Oluştur
          </Button>,
        ]}
      >
        <Input
          placeholder="Quiz Başlığı"
          value={newQuizData.topicName}
          onChange={(e) =>
            setNewQuizData({ ...newQuizData, topicName: e.target.value })
          }
          style={{ marginBottom: "10px" }}
        />
        {newQuizData.questionList.map((question, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <Input
              placeholder={`Soru ${index + 1}`}
              name="question"
              value={question.question}
              onChange={(e) => handleAddInputChange(e, index)}
              style={{ marginBottom: "5px" }}
            />
            <Input
              placeholder="Seçenek 1"
              name="choice1"
              value={question.choicesList.choice1}
              onChange={(e) => handleAddInputChange(e, index)}
              style={{ marginBottom: "5px" }}
            />
            <Input
              placeholder="Seçenek 2"
              name="choice2"
              value={question.choicesList.choice2}
              onChange={(e) => handleAddInputChange(e, index)}
              style={{ marginBottom: "5px" }}
            />
            <Input
              placeholder="Seçenek 3"
              name="choice3"
              value={question.choicesList.choice3}
              onChange={(e) => handleAddInputChange(e, index)}
              style={{ marginBottom: "5px" }}
            />
             <Input
              placeholder="Seçenek 4"
              name="choice4"
              value={question.choicesList.choice4}
              onChange={(e) => handleAddInputChange(e, index)}
              style={{ marginBottom: "5px" }}
            />
            <Input
              placeholder="Doğru Cevap"
              name="correctAnswer"
              value={question.correctAnswer}
              onChange={(e) => handleAddInputChange(e, index)}
              style={{ marginBottom: "10px" }}
            />
            <Button
              type="danger"
              onClick={() => handleNewDeleteQuestion(index)}
            >
              Soruyu Sil
            </Button>
          </div>
        ))}
        <Button
          type="dashed"
          onClick={handleNewAddQuestion}
          style={{ width: "100%" }}
        >
          Soru Ekle
        </Button>
      </Modal>

      <Modal
        title="Quiz'i Sil"
        visible={deleteModalVisible}
        onCancel={handleModalCancel}
        footer={[
          <Button key="cancel" onClick={handleModalCancel}>
            İptal
          </Button>,
          <Button key="delete" type="danger" onClick={handleNewDeleteQuiz}>
            Sil
          </Button>,
        ]}
      >
        <p>Seçili quiz'i silmek istediğinizden emin misiniz?</p>
      </Modal>

      <Modal
        title="Quiz'i Güncelle"
        visible={updateModalVisible}
        onCancel={handleUpdateModalCancel}
        footer={[
          <Button key="cancel" onClick={handleUpdateModalCancel}>
            İptal
          </Button>,
          <Button key="update" type="primary" onClick={handleUpdateQuiz}>
            Güncelle
          </Button>,
        ]}
      >
        {updatedQuizData && (
          <div>
            <Input
              placeholder="Quiz Başlığı"
              value={updatedQuizData.topicName}
              onChange={(e) =>
                setUpdatedQuizData({
                  ...updatedQuizData,
                  topicName: e.target.value,
                })
              }
              style={{ marginBottom: "10px" }}
            />
            {updatedQuizData.questionList.map((question, index) => (
              <div key={index} style={{ marginBottom: "10px" }}>
                <Input
                  placeholder={`Soru ${index + 1}`}
                  name="question"
                  value={question.question}
                  onChange={(e) => handleInputChange(e, index)}
                  style={{ marginBottom: "5px" }}
                />
                <Input
                  placeholder="Seçenek 1"
                  name="choice1"
                  value={question.choicesList.choice1}
                  onChange={(e) => handleInputChange(e, index)}
                  style={{ marginBottom: "5px" }}
                />
                <Input
                  placeholder="Seçenek 2"
                  name="choice2"
                  value={question.choicesList.choice2}
                  onChange={(e) => handleInputChange(e, index)}
                  style={{ marginBottom: "5px" }}
                />
                <Input
                  placeholder="Seçenek 3"
                  name="choice3"
                  value={question.choicesList.choice3}
                  onChange={(e) => handleInputChange(e, index)}
                  style={{ marginBottom: "5px" }}
                />
                <Input
                  placeholder="Seçenek 4"
                  name="choice4"
                  value={question.choicesList.choice4}
                  onChange={(e) => handleInputChange(e, index)}
                  style={{ marginBottom: "5px" }}
                />
                <Input
                  placeholder="Doğru Cevap"
                  name="correctAnswer"
                  value={question.correctAnswer}
                  onChange={(e) => handleInputChange(e, index)}
                  style={{ marginBottom: "10px" }}
                />
                <Button
                  type="danger"
                  onClick={() => handleDeleteQuestion(index)}
                >
                  Soruyu Sil
                </Button>
              </div>
            ))}
            <Button
              type="dashed"
              onClick={handleAddQuestion}
              style={{ width: "100%" }}
            >
              Soru Ekle
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default QuizViewer;
