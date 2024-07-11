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
import Users from "../components/Users";

const { Sider, Content } = Layout;

const HomePage = () => {
  const [showMealList, setShowMealList] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showQuizViewer, setShowQuizViewer] = useState(false);
  const [showUsers, setShowUsers] = useState(false);

  const handleRecipeListOpen = () => {
    setShowMealList(false);
    setShowComments(false);
    setShowQuizViewer(false);
    setShowUsers(false);
  };

  const handleMealListOpen = () => {
    setShowMealList(true);
    setShowComments(false);
    setShowQuizViewer(false);
    setShowUsers(false);
  };

  const handleCommentsOpen = () => {
    setShowMealList(false);
    setShowComments(true);
    setShowQuizViewer(false);
    setShowUsers(false);
  };

  const handleQuizViewerOpen = () => {
    setShowMealList(false);
    setShowComments(false);
    setShowQuizViewer(true);
    setShowUsers(false);
  };
  const handleUsersOpen = () => {
    setShowMealList(false);
    setShowComments(false);
    setShowQuizViewer(false);
    setShowUsers(true);
  };
  

  return (
    <Layout>
      <Sider width={250} style={{ background: "#dadeea"}}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <img
            src="colyak.jpeg"
            alt="Menu Image"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          style={{ height: "100%", borderRight: 0,background:"#dadaea" }}
        >
          <Menu.Item key="1" onClick={handleRecipeListOpen}>
            <Link to="">Tarifler ve Hazır Gıdalar Listesi</Link>
          </Menu.Item>
          <Menu.Item key="2" onClick={handleMealListOpen}>
            Raporlar
          </Menu.Item>
          <Menu.Item key="3" onClick={handleCommentsOpen}>
            Yorumlar
          </Menu.Item>
          <Menu.Item key="4" onClick={handleQuizViewerOpen}>
            Quiz Viewer
          </Menu.Item>
          <Menu.Item key="5" onClick={handleUsersOpen}>
            Kullanıcılar
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
          {!showMealList &&
            !showComments &&
            !showQuizViewer &&
            !showUsers && (
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
          {showUsers && <Users/>}
        </Content>
      </Layout>
    </Layout>
  );
};

export default HomePage;
