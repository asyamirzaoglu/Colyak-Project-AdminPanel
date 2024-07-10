import React, { useEffect, useState, useContext } from 'react';
import { Button, Card, Row, Typography, Modal } from 'antd';
import { DeleteOutlined, MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = React.createContext({
    token: null,
    setToken: () => {},
});

const useTokenReset = () => {
    const { setToken } = useContext(AuthContext);
    const navigate = useNavigate();

    const axiosInstance = axios.create({
        baseURL: 'https://api.colyakdiyabet.com.tr/api',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });

    axiosInstance.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            const originalRequest = error.config;
            if ((error.response.status === 601 || error.response.status === 602) && !originalRequest._retry) {
                originalRequest._retry = true;
                if (error.response.status === 601) {
                    try {
                        const refreshToken = localStorage.getItem('refreshToken');
                        const res = await axios.post('https://api.colyakdiyabet.com.tr/api/users/verify/refresh-token', { refreshToken });
                        const newToken = res.data.token;
                        setToken(newToken);
                        localStorage.setItem('token', newToken);
                        originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
                        return axiosInstance(originalRequest);
                    } catch (error) {
                        console.error(error);
                        navigate('/');
                    }
                } else if (error.response.status === 602) {
                    navigate('/');
                }
            }
            return Promise.reject(error);
        }
    );
    return axiosInstance;
};

const Users = () => {
    const [users, setUsers] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', onOk: () => {} });
    const api = useTokenReset();

    const fetchAllUsers = async () => {
        try {
            const response = await api.get("https://api.colyakdiyabet.com.tr/api/users/verify/ListAll");
            setUsers(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const showModal = (title, onOk) => {
        setModalContent({ title, onOk });
        setIsModalVisible(true);
    };

    const handleOk = async () => {
        try {
            await modalContent.onOk();
            await fetchAllUsers();
            Modal.success({ content: 'İşlem başarıyla tamamlandı.' });
        } catch (error) {
            console.error(error);
            Modal.error({ content: 'İşlem sırasında bir hata oluştu.' });
        }
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div>
            {users.map((user, index) => (
                <Card key={index} style={{ margin: 10 }}>
                    <Typography.Title level={4}>{user.role}</Typography.Title>
                    <Row gutter={16}>
                        {user.role.includes('Admin') ? (
                            <Button
                                type="primary"
                                danger
                                icon={<MinusCircleOutlined />}
                                onClick={() =>
                                    showModal(
                                        'Bu kullanıcının adminliğini kaldırmak istediğinize emin misiniz?',
                                        () => api.post(`https://api.colyakdiyabet.com.tr/api/users/verify/removeAdmin/${user.email}`)
                                    )
                                }
                            >
                                Adminliği kaldır
                            </Button>
                        ) : (
                            <Button
                                type="primary"
                                icon={<PlusCircleOutlined />}
                                onClick={() =>
                                    showModal(
                                        'Bu kullanıcıyı admin yapmak istediğinize emin misiniz?',
                                        () => api.post(`https://api.colyakdiyabet.com.tr/api/users/verify/adminRole/${user.email}`)
                                    )
                                }
                            >
                                Admin Yap
                            </Button>
                        )}
                        <Button
                            style={{ marginLeft: 10 }}
                            type="primary"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() =>
                                showModal(
                                    'Bu kullanıcıyı silmek istediğinize emin misiniz?',
                                    () => api.delete(`https://api.colyakdiyabet.com.tr/api/users/verify/deleteUser/${user.email}`)
                                )
                            }
                        >
                            Kullanıcıyı Sil
                        </Button>
                    </Row>
                    <Typography.Text>{user.email}</Typography.Text>
                </Card>
            ))}
            <Modal
                title={modalContent.title}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Evet"
                cancelText="Hayır"
            />
        </div>
    );
};

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token'));

    return (
        <AuthContext.Provider value={{ token, setToken }}>
            <Users />
        </AuthContext.Provider>
    );
};

export default App;
