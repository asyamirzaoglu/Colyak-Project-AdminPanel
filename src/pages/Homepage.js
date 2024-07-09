import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import AddReceipt from "../components/AddReceipt";
import Listeler from "../components/Listeler";
import ReadyFoodsList from "../components/ReadyFoodList";
import AddReadyFoods from "../components/AddReadyFood";
import BolusRapor from "../components/BolusRapor";
import Comments from "../components/Comments";
import QuizViewer from "../components/QuizViewer";
import UserAndQuizList from "../components/UserAndQuizList";
import UserScoreList from "../components/UserScoreList";

const { Sider, Content } = Layout;

const HomePage = () => {
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const [showReadyFoodForm, setShowReadyFoodForm] = useState(false);
  const [showMealList, setShowMealList] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showQuizViewer, setShowQuizViewer] = useState(false);
  const [showUserAndQuizList, setShowUserAndQuizList] = useState(false);
  const [showUserScoreList, setShowUserScoreList] = useState(false);

  const handleRecipeFormOpen = () => {
    setShowRecipeForm(true);
    setShowReadyFoodForm(false);
    setShowMealList(false);
    setShowComments(false);
    setShowQuizViewer(false);
    setShowUserAndQuizList(false);
    setShowUserScoreList(false);
  };

  const handleReadyFoodFormOpen = () => {
    setShowRecipeForm(false);
    setShowReadyFoodForm(true);
    setShowMealList(false);
    setShowComments(false);
    setShowQuizViewer(false);
    setShowUserAndQuizList(false);
    setShowUserScoreList(false);
  };

  const handleRecipeListOpen = () => {
    setShowRecipeForm(false);
    setShowReadyFoodForm(false);
    setShowMealList(false);
    setShowComments(false);
    setShowQuizViewer(false);
    setShowUserAndQuizList(false);
    setShowUserScoreList(false);
  };

  const handleMealListOpen = () => {
    setShowRecipeForm(false);
    setShowReadyFoodForm(false);
    setShowMealList(true);
    setShowComments(false);
    setShowQuizViewer(false);
    setShowUserAndQuizList(false);
    setShowUserScoreList(false);
  };

  const handleCommentsOpen = () => {
    setShowRecipeForm(false);
    setShowReadyFoodForm(false);
    setShowMealList(false);
    setShowComments(true);
    setShowQuizViewer(false);
    setShowUserAndQuizList(false);
    setShowUserScoreList(false);
  };

  const handleQuizViewerOpen = () => {
    setShowRecipeForm(false);
    setShowReadyFoodForm(false);
    setShowMealList(false);
    setShowComments(false);
    setShowQuizViewer(true);
    setShowUserAndQuizList(false);
    setShowUserScoreList(false);
  };

  const handleUserAndQuizListOpen = () => {
    setShowRecipeForm(false);
    setShowReadyFoodForm(false);
    setShowMealList(false);
    setShowComments(false);
    setShowQuizViewer(false);
    setShowUserAndQuizList(true);
    setShowUserScoreList(false);
  };
  const handleUserScoreListOpen = () => {
    setShowRecipeForm(false);
    setShowReadyFoodForm(false);
    setShowMealList(false);
    setShowComments(false);
    setShowQuizViewer(false);
    setShowUserAndQuizList(false);
    setShowUserScoreList(true);
  };

  return (
    <Layout>
      <Sider width={250} style={{ background: "#fff" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}></div>
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          style={{ height: "100%", borderRight: 0 }}
        >
          <Menu.Item key="1" onClick={handleRecipeListOpen}>
            <Link to="">Tarifler ve Hazır Gıdalar Listesi</Link>
          </Menu.Item>
          <Menu.Item key="2" onClick={handleRecipeFormOpen}>
            Tarif Ekle
          </Menu.Item>
          <Menu.Item key="3" onClick={handleReadyFoodFormOpen}>
            Hazır Gıda Ekle
          </Menu.Item>
          <Menu.Item key="4" onClick={handleMealListOpen}>
            Raporlar
          </Menu.Item>
          <Menu.Item key="5" onClick={handleCommentsOpen}>
            Yorumlar
          </Menu.Item>
          <Menu.Item key="6" onClick={handleQuizViewerOpen}>
            Quiz Viewer
          </Menu.Item>
          <Menu.Item key="7" onClick={handleUserAndQuizListOpen}>
            Kullanıcı ve Quiz Listesi
          </Menu.Item>
          <Menu.Item key="8" onClick={handleUserScoreListOpen}>
            Kullanıcı Puanları
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout style={{ padding: "24px" }}>
        <Content
          style={{
            background: "#fff",
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          {showRecipeForm && (
            <AddReceipt onClose={() => setShowRecipeForm(false)} />
          )}
          {showReadyFoodForm && (
            <AddReadyFoods onClose={() => setShowReadyFoodForm(false)} />
          )}
          {!showRecipeForm &&
            !showReadyFoodForm &&
            !showMealList &&
            !showComments &&
            !showQuizViewer &&
            !showUserAndQuizList && (
              <>
                <Listeler />
                <ReadyFoodsList />
              </>
            )}
          {showMealList && (
            <BolusRapor onClose={() => setShowMealList(false)} />
          )}
          {showComments && <Comments />}
          {showQuizViewer && <QuizViewer />}
          {showUserAndQuizList && <UserAndQuizList />}
        </Content>
      </Layout>
    </Layout>
  );
};

export default HomePage;
