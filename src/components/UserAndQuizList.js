/*
BU YAPIDA QUESTİON ADI GELİYOR DİĞER VERİLER GELMİYOR

import React, { useState, useEffect } from "react";
import { Select, Table } from "antd";
import axios from "axios";

const { Option } = Select;

const UserAndQuizList = () => {
  const [users, setUsers] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [quizAnswers, setQuizAnswers] = useState([]);

  useEffect(() => {
    // Kullanıcıları getir
    axios
      .get("https://api.colyakdiyabet.com.tr/user/getAll")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });

    // Quizleri getir
    axios
      .get("https://api.colyakdiyabet.com.tr/quiz/")
      .then((response) => {
        setQuizzes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching quizzes:", error);
      });
  }, []);

  const handleUserChange = (value) => {
    setSelectedUser(value);
  };

  const handleQuizChange = (value) => {
    setSelectedQuiz(value);
  };

  useEffect(() => {
    if (selectedUser && selectedQuiz) {
      // Kullanıcının quiz cevaplarını getir
      axios
        .get(
          `https://api.colyakdiyabet.com.tr/api/quizAnswers/${selectedUser}/${selectedQuiz}`
        )
        .then((response) => {
          const questionIds = response.data.map((answer) => answer.questionId);
          console.log("Question IDs:", questionIds);
          const fetchQuestions = async () => {
            const response = await axios.get(
              `https://api.colyakdiyabet.com.tr/quiz/${selectedQuiz}`
            );
            const questions = response.data.questionList.filter((question) =>
              questionIds.includes(question.id)
            );
            setQuizAnswers(questions);
          };
          fetchQuestions();
        })
        .catch((error) => {
          console.error("Error fetching quiz answers:", error);
        });
    }
  }, [selectedUser, selectedQuiz]);

  const columns = [
    {
      title: "Soru",
      dataIndex: "question",
      key: "question",
    },
    {
      title: "Verilen Cevap",
      dataIndex: "chosenAnswer",
      key: "chosenAnswer",
    },
    {
      title: "Doğru mu?",
      dataIndex: "correct",
      key: "correct",
      render: (correct) => (correct ? "Doğru" : "Yanlış"),
    },
  ];

  return (
    <div>
      <h2>Kullanıcıları Seçin:</h2>
      <Select
        style={{ width: 200 }}
        onChange={handleUserChange}
        value={selectedUser}
      >
        {users.map((user) => (
          <Option key={user.id} value={user.id}>
            {user.name}
          </Option>
        ))}
      </Select>

      <h2>Quizleri Seçin:</h2>
      <Select
        style={{ width: 200 }}
        onChange={handleQuizChange}
        value={selectedQuiz}
      >
        {quizzes.map((quiz) => (
          <Option key={quiz.id} value={quiz.id}>
            {quiz.topicName}
          </Option>
        ))}
      </Select>

      {quizAnswers.length > 0 && (
        <Table dataSource={quizAnswers} columns={columns} />
      )}
    </div>
  );
};

export default UserAndQuizList;
*/

// BU YAPIDA QUESTİON ADI GELMİYOR DİĞER VERİLER DOĞRU
/*
import React, { useState, useEffect } from "react";
import { Select, Table } from "antd";
import axios from "axios";

const { Option } = Select;

const UserAndQuizList = () => {
  const [users, setUsers] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [quizAnswers, setQuizAnswers] = useState([]);

  useEffect(() => {
    // Kullanıcıları getir
    axios
      .get("https://api.colyakdiyabet.com.tr/user/getAll")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });

    // Quizleri getir
    axios
      .get("https://api.colyakdiyabet.com.tr/quiz/")
      .then((response) => {
        setQuizzes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching quizzes:", error);
      });
  }, []);

  const handleUserChange = (value) => {
    setSelectedUser(value);
  };

  const handleQuizChange = (value) => {
    setSelectedQuiz(value);
  };

  useEffect(() => {
    if (selectedUser && selectedQuiz) {
      // Kullanıcının quiz cevaplarını getir
      axios
        .get(
          `https://api.colyakdiyabet.com.tr/api/quizAnswers/${selectedUser}/${selectedQuiz}`
        )
        .then((response) => {
          setQuizAnswers(response.data);
        })
        .catch((error) => {
          console.error("Error fetching quiz answers:", error);
        });
    }
  }, [selectedUser, selectedQuiz]);

  const getQuestionText = async (questionId) => {
    try {
      const response = await axios.get(
        `https://api.colyakdiyabet.com.tr/quiz/${selectedQuiz}`
      );
      const question = response.data.questionList.find(
        (q) => q.id === questionId
      );
      return question ? question.question : "Soru bulunamadı";
    } catch (error) {
      console.error("Error fetching question:", error);
      return "Soru bulunamadı";
    }
  };

  const columns = [
    {
      title: "Soru",
      dataIndex: "question",
      key: "question",
      render: (question) => (
        <div dangerouslySetInnerHTML={{ __html: question }} />
      ),
    },
    {
      title: "Verilen Cevap",
      dataIndex: "chosenAnswer",
      key: "chosenAnswer",
    },
    {
      title: "Doğru mu?",
      dataIndex: "correct",
      key: "correct",
      render: (correct) => (correct ? "Doğru" : "Yanlış"),
    },
  ];

  return (
    <div>
      <h2>Kullanıcıları Seçin:</h2>
      <Select
        style={{ width: 200 }}
        onChange={handleUserChange}
        value={selectedUser}
      >
        {users.map((user) => (
          <Option key={user.id} value={user.id}>
            {user.name}
          </Option>
        ))}
      </Select>

      <h2>Quizleri Seçin:</h2>
      <Select
        style={{ width: 200 }}
        onChange={handleQuizChange}
        value={selectedQuiz}
      >
        {quizzes.map((quiz) => (
          <Option key={quiz.id} value={quiz.id}>
            {quiz.topicName}
          </Option>
        ))}
      </Select>

      {quizAnswers.length > 0 && (
        <Table
          dataSource={quizAnswers.map((answer) => ({
            ...answer,
            question: getQuestionText(answer.questionId),
          }))}
          columns={columns}
        />
      )}
    </div>
  );
};

export default UserAndQuizList;
*/
/*
import React, { useState, useEffect } from "react";
import { Select, Table, Tag } from "antd";
import axios from "axios";

const { Option } = Select;

const UserAndQuizList = () => {
  const [users, setUsers] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizScore, setQuizScore] = useState(null);

  useEffect(() => {
    // Kullanıcıları getir
    axios
      .get("https://api.colyakdiyabet.com.tr/user/getAll")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });

    // Quizleri getir
    axios
      .get("https://api.colyakdiyabet.com.tr/quiz/")
      .then((response) => {
        setQuizzes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching quizzes:", error);
      });
  }, []);

  const handleUserChange = (value) => {
    setSelectedUser(value);
  };

  const handleQuizChange = (value) => {
    setSelectedQuiz(value);
  };

  useEffect(() => {
    if (selectedUser && selectedQuiz) {
      // Kullanıcının quiz cevaplarını getir
      axios
        .get(
          `https://api.colyakdiyabet.com.tr/api/quizAnswers/${selectedUser}/${selectedQuiz}`
        )
        .then((response) => {
          setQuizAnswers(response.data);
        })
        .catch((error) => {
          console.error("Error fetching quiz answers:", error);
        });

      // Kullanıcının quiz skorunu getir
      axios
        .get(
          `https://api.colyakdiyabet.com.tr/api/quizScore/${selectedUser}/${selectedQuiz}`
        )
        .then((response) => {
          setQuizScore(response.data);
        })
        .catch((error) => {
          console.error("Error fetching quiz score:", error);
        });
    }
  }, [selectedUser, selectedQuiz]);

  const getQuestionText = async (questionId) => {
    try {
      const response = await axios.get(
        `https://api.colyakdiyabet.com.tr/quiz/${selectedQuiz}`
      );
      const question = response.data.questionList.find(
        (q) => q.id === questionId
      );
      return question ? question.question : "Soru bulunamadı";
    } catch (error) {
      console.error("Error fetching question:", error);
      return "Soru bulunamadı";
    }
  };

  const columns = [
    {
      title: "Soru",
      dataIndex: "question",
      key: "question",
      render: (question) => (
        <div dangerouslySetInnerHTML={{ __html: question }} />
      ),
    },
    {
      title: "Verilen Cevap",
      dataIndex: "chosenAnswer",
      key: "chosenAnswer",
    },
    {
      title: "Doğru mu?",
      dataIndex: "correct",
      key: "correct",
      render: (correct) => (correct ? "Doğru" : "Yanlış"),
    },
  ];

  return (
    <div>
      <h2>Kullanıcıları Seçin:</h2>
      <Select
        style={{ width: 200 }}
        onChange={handleUserChange}
        value={selectedUser}
      >
        {users.map((user) => (
          <Option key={user.id} value={user.id}>
            {user.name}
          </Option>
        ))}
      </Select>

      <h2>Quizleri Seçin:</h2>
      <Select
        style={{ width: 200 }}
        onChange={handleQuizChange}
        value={selectedQuiz}
      >
        {quizzes.map((quiz) => (
          <Option key={quiz.id} value={quiz.id}>
            {quiz.topicName}
          </Option>
        ))}
      </Select>

      {quizScore !== null && (
        <div>
          <h2>Quiz Skoru: {quizScore}</h2>
        </div>
      )}

      {quizAnswers.length > 0 && (
        <Table
          dataSource={quizAnswers.map((answer) => ({
            ...answer,
            question: getQuestionText(answer.questionId),
          }))}
          columns={columns}
        />
      )}
    </div>
  );
};

export default UserAndQuizList;
*/
import React, { useState, useEffect } from "react";
import { Select, Table, Tag } from "antd";
import axios from "axios";

const { Option } = Select;

const UserAndQuizList = () => {
  const [users, setUsers] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizScore, setQuizScore] = useState(null);

  const token = localStorage.getItem("token");
  useEffect(() => {
    // Kullanıcıları getir
    axios
      .get(  "https://api.colyakdiyabet.com.tr/api/users/verify/ListAll", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });

    // Quizleri getir
    axios
      .get("https://api.colyakdiyabet.com.tr/api/quiz/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setQuizzes(response.data);
      })
      .catch((error) => {
        console.error("Error fetching quizzes:", error);
      });
  }, [token]);

  const handleUserChange = (value) => {
    setSelectedUser(value);
  };

  const handleQuizChange = (value) => {
    setSelectedQuiz(value);
  };

  useEffect(() => {
    if (selectedUser && selectedQuiz) {
      // Kullanıcının quiz cevaplarını getir
      axios
        .get(
          `https://api.colyakdiyabet.com.tr/api/quizAnswers/${selectedUser}/${selectedQuiz}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((response) => {
          setQuizAnswers(response.data);
        })
        .catch((error) => {
          console.error("Error fetching quiz answers:", error);
        });

      // Kullanıcının quiz skorunu getir
      axios
        .get(
          `https://api.colyakdiyabet.com.tr/api/quizScore/${selectedUser}/${selectedQuiz}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((response) => {
          setQuizScore(response.data);
        })
        .catch((error) => {
          console.error("Error fetching quiz score:", error);
        });
    }
  }, [selectedUser, selectedQuiz,token]);

  const getQuestionText = async (questionId) => {
    try {
      const response = await axios.get(
        `https://api.colyakdiyabet.com.tr/quiz/${selectedQuiz}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const question = response.data.questionList.find(
        (q) => q.id === questionId
      );
      return question ? question.question : "Soru bulunamadı";
    } catch (error) {
      console.error("Error fetching question:", error);
      return "Soru bulunamadı";
    }
  };

  const columns = [
    {
      title: "Soru",
      dataIndex: "question",
      key: "question",
      render: (question) => (
        <div dangerouslySetInnerHTML={{ __html: question }} />
      ),
    },
    {
      title: "Verilen Cevap",
      dataIndex: "chosenAnswer",
      key: "chosenAnswer",
    },
    {
      title: "Doğru mu?",
      dataIndex: "correct",
      key: "correct",
      render: (correct) => (correct ? "Doğru" : "Yanlış"),
    },
  ];

  return (
    <div>
      <h2>Kullanıcıları Seçin:</h2>
      <Select
        style={{ width: 200 }}
        onChange={handleUserChange}
        value={selectedUser}
      >
        {users.map((user) => (
          <Option key={user.id} value={user.id}>
            {user.name}
          </Option>
        ))}
      </Select>

      <h2>Quizleri Seçin:</h2>
      <Select
        style={{ width: 200 }}
        onChange={handleQuizChange}
        value={selectedQuiz}
      >
        {quizzes.map((quiz) => (
          <Option key={quiz.id} value={quiz.id}>
            {quiz.topicName}
          </Option>
        ))}
      </Select>

      {quizScore !== null && (
        <div style={{ fontSize: "20px", fontWeight: "bold" }}>
          <h2>Quiz Skoru: {quizScore}</h2>
        </div>
      )}

      {quizAnswers.length > 0 && (
        <Table
          dataSource={quizAnswers.map((answer) => ({
            ...answer,
            question: getQuestionText(answer.questionId),
          }))}
          columns={columns}
        />
      )}
    </div>
  );
};

export default UserAndQuizList;