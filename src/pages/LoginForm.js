import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";
import "./LoginForm.css";

const LoginForm = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { email, password } = values;

    try {
      const response = await axios.post(
        "https://api.colyakdiyabet.com.tr/api/users/verify/login",
        {
          email,
          password,
        }
      );

      // Backend API'den dönen yanıtı kontrol et
      const token = response.data.token; // response.data.token değerini bir değişkene atadık
      console.log(token);
      if (token) {
        // Başarılı giriş durumunda Anasayfa'ya yönlendir
        localStorage.setItem("token", token); // tokeni localStorage'a kaydettik.
        setIsLoggedIn(true); // Kullanıcı giriş yaptığında isLoggedIn durumunu true olarak güncelle
        navigate("/Anasayfa");
      }
    } catch (error) {
      // Hata durumunda kullanıcıya sadece "Kullanıcı bulunamadı" hatasını göster
      alert("Kullanıcı bulunamadı.");
    }
  };

  return (
    <div className="bg-gradient-to-b from-yellow-100 via-orange-300 to-yellow-100 h-screen flex justify-center items-center">
      <div className=" w-96 p-10">
      <img src="colyak.jpeg" alt="Login Image" style={{ maxWidth: "80%", height: "auto",borderRadius:"50px",marginLeft:"30px"}} />
        <h1 className="text-3xl text-center font-bold">Yönetici Girişi</h1>
        <div className="mb-7"></div>
        <div>
          <Form name="loginForm" onFinish={onFinish}>
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Mail adresi giriniz!" }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Kullanıcı Mail Adresi"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "Şifre giriniz!" }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Şifre" />
            </Form.Item>
            <Form.Item>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Form.Item style={{ margin: 0}}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      backgroundColor: "#ef7927",
                      borderColor: "white",
                      marginLeft:"110px"
                    }}
                  >
                    Giriş Yap
                  </Button>
                </Form.Item>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
