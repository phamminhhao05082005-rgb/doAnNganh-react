import { useContext, useEffect, useState } from "react";
import { MyUserContext } from "../../configs/Contexts";
import { Link } from "react-router-dom";
import { Card, Row, Col, Spinner, Form } from "react-bootstrap";
import { FiBriefcase, FiUsers, FiTrendingUp, FiSettings, FiInfo } from "react-icons/fi";
import { authApis, endpoints } from "../../configs/Apis";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';

const EmployerHome = () => {
    const [user] = useContext(MyUserContext);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const COLORS = ['#0d6efd', '#198754', '#ffc107', '#dc3545', '#6f42c1', '#0dcaf0',
                    '#fd7e14', '#d63384', '#20c997', '#212529', '#84cc16', '#d2b48c'
    ];

    const loadStatistics = async (year) => {
        setLoading(true);
        try {
            const res = await authApis().get(`${endpoints.employerStatistics}?year=${year}`);
            setStats(res.data.data);
        } catch (error) {
            console.error("Lỗi khi tải thống kê:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStatistics(selectedYear);
    }, [selectedYear]);

    const getLineChartData = () => {
        if (!stats?.charts?.monthly_trends) return [];
        const { months, jobs_posted, cvs_applied } = stats.charts.monthly_trends;
        return months.map((month, index) => ({
            name: month.replace('Tháng ', 'T'), 
            Jobs: jobs_posted[index],
            CVs: cvs_applied[index]
        }));
    };

    const getPieChartData = () => {
        if (!stats?.charts?.job_categories) return [];
        const { labels, series } = stats.charts.job_categories;
        return labels.map((label, index) => ({
            name: label,
            value: series[index]
        })).filter(item => item.value > 0); 
    };

    return (
        <div className="container mt-4 mb-5 max-w-6xl">
            <style>
                {`
                    .dashboard-card { border-radius: 1rem; border: none; box-shadow: 0 4px 15px rgba(0,0,0,0.04); transition: transform 0.2s; }
                    .dashboard-card:hover { transform: translateY(-3px); }
                    .stat-icon { width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
                    .chart-container { background: #fff; padding: 1.5rem; border-radius: 1rem; box-shadow: 0 4px 15px rgba(0,0,0,0.04); }
                `}
            </style>

           
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-5 gap-3">
                <div>
                    <h2 className="fw-bold mb-1 text-dark d-flex align-items-center gap-2">
                        <FiTrendingUp className="text-primary" /> Tổng Quan Tuyển Dụng
                    </h2>
                    <p className="text-muted mb-0 fs-6">
                        Chào mừng trở lại, <span className="fw-semibold text-primary">{user?.full_name}</span>
                    </p>
                </div>
                
                <div className="d-flex gap-2">
                    <Link to="/employer/company" className="btn btn-outline-primary d-flex align-items-center gap-2 rounded-pill px-4 shadow-sm fw-medium">
                        <FiInfo /> Thông tin doanh nghiệp
                    </Link>
                    <Link to="/employer/jobs" className="btn btn-primary d-flex align-items-center gap-2 rounded-pill px-4 shadow-sm fw-medium">
                        <FiSettings /> Quản lý tuyển dụng
                    </Link>
                </div>
            </div>

            
            <div className="d-flex justify-content-end mb-4">
                <Form.Select 
                    value={selectedYear} 
                    onChange={(e) => setSelectedYear(e.target.value)}
                    style={{ width: '150px', borderRadius: '0.5rem', fontWeight: '500' }}
                    className="shadow-sm border-0 bg-white"
                >
                    {[2023, 2024, 2025, 2026, 2027].map(year => (
                        <option key={year} value={year}>Năm {year}</option>
                    ))}
                </Form.Select>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2 text-muted">Đang tải dữ liệu thống kê...</p>
                </div>
            ) : (
                <>
                    
                    <Row className="mb-4 g-4">
                        <Col md={6}>
                            <Card className="dashboard-card h-100">
                                <Card.Body className="d-flex align-items-center p-4">
                                    <div className="stat-icon bg-primary bg-opacity-10 text-primary me-4">
                                        <FiBriefcase />
                                    </div>
                                    <div>
                                        <p className="text-muted fw-semibold mb-1 text-uppercase" style={{ fontSize: '0.85rem' }}>
                                            Việc làm đã đăng ({selectedYear})
                                        </p>
                                        <h3 className="fw-bold mb-0 text-dark">
                                            {stats?.summary?.total_jobs_this_year || 0} <span className="fs-6 fw-normal text-muted">job</span>
                                        </h3>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className="dashboard-card h-100">
                                <Card.Body className="d-flex align-items-center p-4">
                                    <div className="stat-icon bg-success bg-opacity-10 text-success me-4">
                                        <FiUsers />
                                    </div>
                                    <div>
                                        <p className="text-muted fw-semibold mb-1 text-uppercase" style={{ fontSize: '0.85rem' }}>
                                            CV Ứng tuyển ({selectedYear})
                                        </p>
                                        <h3 className="fw-bold mb-0 text-dark">
                                            {stats?.summary?.total_cvs_this_year || 0} <span className="fs-6 fw-normal text-muted">ứng viên</span>
                                        </h3>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    
                    <Row className="g-4">
                        
                        <Col lg={8}>
                            <div className="chart-container h-100">
                                <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                                    Biểu đồ tương tác hàng tháng
                                </h5>
                                <div style={{ height: '350px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={getLineChartData()} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                            <XAxis dataKey="name" tick={{fill: '#6c757d'}} axisLine={false} tickLine={false} />
                                            <YAxis tick={{fill: '#6c757d'}} axisLine={false} tickLine={false} />
                                            <ChartTooltip 
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            />
                                            <Legend wrapperStyle={{ paddingTop: '20px' }}/>
                                            <Line type="monotone" dataKey="Jobs" stroke="#0d6efd" strokeWidth={3} activeDot={{ r: 8 }} name="Số Job đã đăng" />
                                            <Line type="monotone" dataKey="CVs" stroke="#198754" strokeWidth={3} activeDot={{ r: 8 }} name="Số CV nhận được" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </Col>

                        
                        <Col lg={4}>
                            <div className="chart-container h-100">
                                <h5 className="fw-bold mb-4 text-center">
                                    Phân bổ loại hình công việc
                                </h5>
                                <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
                                    {getPieChartData().length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={getPieChartData()}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={100}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                                >
                                                    {getPieChartData().map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <ChartTooltip />
                                                <Legend verticalAlign="bottom" height={36}/>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                                            Chưa có dữ liệu danh mục
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Col>
                    </Row>
                </>
            )}
        </div>
    );
};

export default EmployerHome;