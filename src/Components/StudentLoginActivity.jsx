import { useEffect, useState } from "react";
import { fetchStudentLoginActivity } from "../api/apiservice";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const LoginActivity = () => {
  const [loginData, setLoginData] = useState([]);
  const [studentProfile, setStudentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const result = await fetchStudentLoginActivity();

      if (result.success) {
        setLoginData(result.data.activities_with_user_id || []);
        setStudentProfile(result.data.student_profile || {});
      } else {
        setError(result.error);
      }

      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      {/* Student Profile Display */}
      {/* {studentProfile && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Student Profile</h2>
          <p><strong>Name:</strong> {studentProfile.name}</p>
          <p><strong>School:</strong> {studentProfile.school}</p>
          <p><strong>Grade:</strong> {studentProfile.grade}</p>
          <p><strong>Section:</strong> {studentProfile.section}</p>
        </div>
      )} */}

      {/* Login Activity Table */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Login Activity</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">Date</th>
                <th className="border p-2">Username</th>
                <th className="border p-2">IP Address</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Device Info</th>
              </tr>
            </thead>
            <tbody>
              {loginData.length > 0 ? (
                loginData.map((activity) => (
                  <tr key={activity.id} className="text-center">
                    <td className="border p-2">{new Date(activity.login_datetime).toLocaleString()}</td>
                    <td className="border p-2">{activity.login_username}</td>
                    <td className="border p-2">{activity.login_IP}</td>
                    <td className="border p-2">{activity.status === "S" ? "Success" : "Failed"}</td>
                    <td className="border p-2">{activity.user_agent_info}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="border p-2 text-center">No login activity found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Login Trends Graph */}
      <div className="bg-white shadow-md rounded-lg p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Login Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={loginData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="login_datetime" tickFormatter={(tick) => new Date(tick).toLocaleDateString()} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="login_num" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LoginActivity;
