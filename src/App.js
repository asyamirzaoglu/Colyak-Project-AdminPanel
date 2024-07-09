import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "antd";
import LoginForm from "./pages/LoginForm";
import Homepage from "./pages/Homepage";

const { Content } = Layout;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Kullanıcının oturum açıp açılmadığını takip etmek için bir state

  // Kullanıcı oturum açmışsa Anasayfa'ya yönlendir
  const PrivateRoute = ({ element }) => {
    return isLoggedIn ? element : <Navigate to="/" />;
  };

  return (
    <Router>
      <Layout>
        <Content style={{ padding: "50px" }}>
          <Routes>
            {/* Login sayfası için route */}
            <Route
              path=""
              element={<LoginForm setIsLoggedIn={setIsLoggedIn} />} // LoginForm bileşeni her durumda gösterilir
            />
            {/* Anasayfa için özel route */}
            <Route
              path="/Anasayfa"
              element={<PrivateRoute element={<Homepage />} />} // Özel bir route olarak işaretlenmiş Anasayfa bileşeni, sadece oturum açmış kullanıcılara gösterilir
            />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;
