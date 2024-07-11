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
        choicesList:[
          {choice1: ""},
          {choice2: ""},
          {choice3: ""},
          {choice4:""},
        ],
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
      const response = await axios.get("https://api.colyakdiyabet.com.tr/api/quiz/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const quizzesWithImages = await Promise.all(response.data.map(async (quiz) => {
        const updatedQuestionList = await Promise.all(quiz.questionList.map(async (question) => {
          const updatedChoicesList = await Promise.all(question.choicesList.map(async (choice) => {
            if (choice.imageId) {
              const imageUrl = await fetchImageUrl(choice);
              return { ...choice, imageUrl };
            }
            return choice;
          }));
          return { ...question, choicesList: updatedChoicesList };
        }));
        return { ...quiz, questionList: updatedQuestionList };
      }));
      setQuizzes(quizzesWithImages);
      if (quizzesWithImages.length > 0) {
        const initialQuiz = quizzesWithImages[0];
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
  const handleAddInputChange = (e, questionIndex, choiceIndex) => {
    const { name, value } = e.target;
    const updatedQuestions = [...newQuizData.questionList];
    
    if (name === "question" || name === "correctAnswer") {
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        [name]: value,
      };
    } else {
      // Update the correct choice index based on the name
      const updatedChoicesList = [...updatedQuestions[questionIndex].choicesList];
      updatedChoicesList[choiceIndex] = { ...updatedChoicesList[choiceIndex], [name]: value };
      updatedQuestions[questionIndex].choicesList = updatedChoicesList;
    }
    
    setNewQuizData({ ...newQuizData, questionList: updatedQuestions });
  };
  
  
  const handleNewAddQuiz = async () => {
    try {
      const formattedQuizData = {
        ...newQuizData,
        questionList: newQuizData.questionList.map((question) => ({
          ...question,
          choicesList: [
            { choice: question.choicesList[0].choice1 },
            { choice: question.choicesList[0].choice2 },
            { choice: question.choicesList[0].choice3 },
            { choice: question.choicesList[0].choice4 },
          ],
        })),
      };
  
      const response = await axios.post("https://api.colyakdiyabet.com.tr/api/quiz/add", formattedQuizData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setModalVisible(false);
      setNewQuizData({
        topicName: "",
        questionList: [
          {
            question: "",
            choicesList: [
              { choice1: ""}, {choice2: ""}, {choice3: ""}, {choice4: "" },
            ],
            correctAnswer: "",
          },
        ],
      });
      fetchQuizzes();
      console.log("newquizdata", newQuizData);
    } catch (error) {
      console.error("Error adding quiz:", error);
      console.log("newquizdata", newQuizData);
    }
  };
  
  const handleNewDeleteQuiz = async () => {
    try {
      const response = await axios.delete(
        `https://api.colyakdiyabet.com.tr/api/quiz/delete/${quizToDelete.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
  const fetchImageUrl = async (choice) => {
    try {
      const response = await axios.get(
        `https://api.colyakdiyabet.com.tr/api/image/get/${choice.imageId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.url;
      console.log(response);
    } catch (error) {
      console.error("Error fetching image URL:", error);
      return null;
    }
  };
  

  const handleUpdateQuiz = async () => {
    try {
      const response = await axios.put(
        `https://api.colyakdiyabet.com.tr/api/quiz/put/${selectedQuizId}`,
        updatedQuizData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUpdateModalVisible(false);
      setSelectedQuiz(updatedQuizData);
      fetchQuizzes();
    } catch (error) {
      console.error("Error updating quiz:", error);
    }
  };

  const handleInputChange = (e, questionIndex, choiceIndex) => {
    const { name, value } = e.target;
    if (updatedQuizData && updatedQuizData.questionList) {
      const updatedQuestions = updatedQuizData.questionList.map((question, i) => {
        if (i === questionIndex) {
          const updatedChoicesList = question.choicesList.map((choice, j) => {
            if (j === choiceIndex) {
              return { ...choice, [name]: value };
            }
            return choice;
          });
          return { ...question, choicesList: updatedChoicesList };
          
        }
        return question;
      });
    
      setUpdatedQuizData((prevData) => ({
        ...prevData,
        questionList: updatedQuestions,
      }));
    }
  };
  

  const handleAddQuestion = () => {
    const newQuestion = {
      question: "",
      choicesList:[
        {choice1: ""},
        {choice2: ""},
        {choice3: ""},
        {choice4: ""},
      ],
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
    const newQuestion = {
      question: "",
      choicesList: [
        { id: 0, choice: "" },
        { id: 1, choice: "" },
        { id: 2, choice: "" },
        { id: 3, choice: "" },
      ],
      correctAnswer: "",
    };
    setNewQuizData({
      ...newQuizData,
      questionList: [...newQuizData.questionList, newQuestion],
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
      > <Button
      onClick={() => confirmDelete(selectedQuiz)}
      style={{ marginBottom: "10px",borderColor:"#ef7927",color:"#ef7927" }}
    >
      Quiz Sil
    </Button>
        <Button
          onClick={handleUpdateButtonClick}
          style={{ marginBottom: "10px", marginLeft: "10px",borderColor:"#ef7927", color:"#ef7927"}}
        >
          Quiz Güncelle
        </Button>
        <Button
          onClick={() => setModalVisible(true)}
          style={{ marginLeft: "10px", marginBottom: "10px",borderColor:"#ef7927",color:"#ef7927" }}
        >
          Quiz Ekle
        </Button>
      </div>
     <div style={{textAlign:"center"}}><h1 style={{textAlign:"center",fontSize: "24px"}}>Quiz Seçin:</h1>
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
      </Select></div> 

      {selectedQuiz && (
  <div style={{ marginTop: "20px" }}>
    <h2>{selectedQuiz.topicName}</h2>
    {selectedQuiz.questionList.map((question, index) => (
      <Card key={question.id} style={{ marginTop: "10px" }}>
        <p>
                <span style={{ fontWeight: "bold" }}>Soru {index + 1}:</span> {question.question}
              </p> 
        <div>
          {question.choicesList.map((choice, choiceIndex) => (
            <div key={choice.id} style={{ marginBottom: "10px" }}>
               <p>
                <span style={{ fontWeight: "bold" }}>{String.fromCharCode(65 + choiceIndex)}</span> - {choice.choice}
              </p>
              {choice.imageId && (
                <img
                  src={`https://api.colyakdiyabet.com.tr/api/image/get/${choice.imageId}`}
                  alt={`Choice ${choiceIndex + 1}`}
                  style={{ maxWidth: '200px', maxHeight: '200px', marginTop: '10px' }}
                />
              )}
            </div>
          ))}
        </div>
        <p><span style={{ fontWeight: "bold" }}>Doğru Cevap:</span>  {question.correctAnswer}</p>
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
          <Button key="submit" type="primary" onClick={handleNewAddQuiz} style={{backgroundColor: "#ef7927", borderColor: "#ef7927"}}>
            Oluştur
          </Button>,
        ]}
      ><label>Quiz Başlığı:</label>
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
            <label>Soru:</label>
            <Input
              placeholder={`Soru ${index + 1}`}
              name="question"
              value={question.question}
              onChange={(e) => handleAddInputChange(e, index)}
              style={{ marginBottom: "5px" }}
            />
            <label>Şıklar:</label>
            <Input
              placeholder="Seçenek 1"
              name="choice1"
              value={question.choicesList.choice}
              onChange={(e) => handleAddInputChange(e, index)}
              style={{ marginBottom: "5px" }}
            />
            <Input
              placeholder="Seçenek 2"
              name="choice2"
              value={question.choicesList.choice}
              onChange={(e) => handleAddInputChange(e, index)}
              style={{ marginBottom: "5px" }}
            />
            <Input
              placeholder="Seçenek 3"
              name="choice3"
              value={question.choicesList.choice}
              onChange={(e) => handleAddInputChange(e, index)}
              style={{ marginBottom: "5px" }}
            />
             <Input
              placeholder="Seçenek 4"
              name="choice4"
              value={question.choicesList.choice}
              onChange={(e) => handleAddInputChange(e, index)}
              style={{ marginBottom: "5px" }}
            />
            <label>Doğru Cevap:</label>
            <Input
              placeholder="Doğru Cevap"
              name="correctAnswer"
              value={question.correctAnswer}
              onChange={(e) => handleAddInputChange(e, index)}
              style={{ marginBottom: "10px" }}
            />
            <Button
              onClick={() => handleNewDeleteQuestion(index)}
            danger>
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
          <Button key="delete" onClick={handleNewDeleteQuiz}danger>
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
          <Button key="update" type="primary" onClick={handleUpdateQuiz}style={{ backgroundColor: "#ef7927", borderColor: "#ef7927" }}>
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
                  value={question.choicesList.choice}
                  onChange={(e) => handleInputChange(e, index)}
                  style={{ marginBottom: "5px" }}
                />
                <Input
                  placeholder="Seçenek 2"
                  name="choice2"
                  value={question.choicesList.choice}
                  onChange={(e) => handleInputChange(e, index)}
                  style={{ marginBottom: "5px" }}
                />
                <Input
                  placeholder="Seçenek 3"
                  name="choice3"
                  value={question.choicesList.choice}
                  onChange={(e) => handleInputChange(e, index)}
                  style={{ marginBottom: "5px" }}
                />
                <Input
                  placeholder="Seçenek 4"
                  name="choice4"
                  value={question.choicesList.choice}
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
                  onClick={() => handleDeleteQuestion(index)}
                danger>
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
