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

const { Sider, Content } = Layout;

const HomePage = () => {
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const [showReadyFoodForm, setShowReadyFoodForm] = useState(false);
  const [showMealList, setShowMealList] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showQuizViewer, setShowQuizViewer] = useState(false);

  const handleRecipeFormOpen = () => {
    setShowRecipeForm(true);
    setShowReadyFoodForm(false);
    setShowMealList(false);
    setShowComments(false);
    setShowQuizViewer(false);
  };

  const handleReadyFoodFormOpen = () => {
    setShowRecipeForm(false);
    setShowReadyFoodForm(true);
    setShowMealList(false);
    setShowComments(false);
    setShowQuizViewer(false);
  };

  const handleRecipeListOpen = () => {
    setShowRecipeForm(false);
    setShowReadyFoodForm(false);
    setShowMealList(false);
    setShowComments(false);
    setShowQuizViewer(false);
  };

  const handleMealListOpen = () => {
    setShowRecipeForm(false);
    setShowReadyFoodForm(false);
    setShowMealList(true);
    setShowComments(false);
    setShowQuizViewer(false);
  };

  const handleCommentsOpen = () => {
    setShowRecipeForm(false);
    setShowReadyFoodForm(false);
    setShowMealList(false);
    setShowComments(true);
    setShowQuizViewer(false);
  };

  const handleQuizViewerOpen = () => {
    setShowRecipeForm(false);
    setShowReadyFoodForm(false);
    setShowMealList(false);
    setShowComments(false);
    setShowQuizViewer(true);
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
            !showQuizViewer && (
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
        </Content>
      </Layout>
    </Layout>
  );
};

export default HomePage;
