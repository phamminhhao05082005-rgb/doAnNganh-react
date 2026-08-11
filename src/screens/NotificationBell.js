import { useEffect, useState } from "react";
import { Badge, Dropdown } from "react-bootstrap";
import { authApis, endpoints } from "../configs/Apis";
import echo from "../configs/echo";
import cookies from "react-cookies";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const NotificationBell = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const user = cookies.load("user");

    const loadNotifications = async () => {
        try {
            const res = await authApis().get(endpoints.notifications);
            const data = res.data.data || [];

            setNotifications(data);
            setUnreadCount(data.filter((item) => !item.is_read).length);
        } catch (err) {
            console.error("Không thể tải notification", err);
        }
    };

    const handleNotificationClick = (notification) => {
        // 1. Cập nhật UI đã đọc ngay lập tức
        if (!notification.is_read) {
            setNotifications((prev) =>
                prev.map((n) =>
                    n.id === notification.id ? { ...n, is_read: true } : n
                )
            );
            setUnreadCount((prev) => Math.max(0, prev - 1));

            // Gọi API cập nhật đã đọc nếu có endpoint
            if (endpoints.markNotificationRead) {
                authApis()
                    .patch(endpoints.markNotificationRead(notification.id))
                    .catch((err) => console.error("Lỗi cập nhật đã đọc", err));
            }
        }

        // 2. Chuyển hướng tới trang chi tiết công việc
        const jobId = notification.job_id || notification.job?.id;
        if (jobId) {
            navigate(`/jobs/${jobId}`);
        } else {
            console.warn("Thông báo không chứa job_id để điều hướng");
        }
    };

    useEffect(() => {
        if (!user?.id) {
            return;
        }

        loadNotifications();

        const channelName = `user.${user.id}`;
        const channel = echo.private(channelName);

        channel.listen(".notification.created", (event) => {
            console.log("Nhận notification:", event);
            const notification = event.notification;

            setNotifications((prev) => [notification, ...prev]);
            setUnreadCount((prev) => prev + 1);

            toast.info(
                `${notification.title}: ${notification.content}`
            );
        });

        return () => {
            echo.leave(channelName);
        };
    }, [user?.id]);

    return (
        <Dropdown align="end">
            <Dropdown.Toggle
                variant="outline-secondary"
                id="notification-dropdown"
            >
                🔔
                {unreadCount > 0 && (
                    <Badge bg="danger" className="ms-1">
                        {unreadCount}
                    </Badge>
                )}
            </Dropdown.Toggle>

            <Dropdown.Menu
                style={{
                    width: "360px",
                    maxHeight: "400px",
                    overflowY: "auto",
                }}
            >
                <Dropdown.Header>Thông báo</Dropdown.Header>

                {notifications.length === 0 && (
                    <Dropdown.ItemText>Chưa có thông báo.</Dropdown.ItemText>
                )}

                {notifications.map((notification) => {
                    const jobTitle = notification.job_title || notification.job?.title;

                    return (
                        <Dropdown.Item
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className={!notification.is_read ? "bg-light fw-bold" : ""}
                            style={{ cursor: "pointer", whiteSpace: "normal" }}
                        >
                            <div>
                                <strong>{notification.title}</strong>
                            </div>


                            {jobTitle && (
                                <div className="text-primary small fw-semibold">
                                    Công việc: {jobTitle}
                                </div>
                            )}

                            <div className="text-muted small">
                                {notification.content}
                            </div>

                            <div
                                className="text-muted"
                                style={{ fontSize: "12px" }}
                            >
                                {notification.created_at
                                    ? new Date(notification.created_at).toLocaleTimeString("vi-VN", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    }) +
                                    " - " +
                                    new Date(notification.created_at).toLocaleDateString("vi-VN", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                    })
                                    : ""}
                            </div>
                        </Dropdown.Item>
                    );
                })}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default NotificationBell;