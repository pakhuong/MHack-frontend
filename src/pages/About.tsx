import { useGetUsersQuery } from '../services/api';
import { Card, Typography, List, Avatar, Spin, Tag } from 'antd';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const About = () => {
  const { data: users, isLoading, error } = useGetUsersQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Text type="danger">Error loading users</Text>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <Title level={1}>About This Boilerplate</Title>
        <Text className="text-lg">
          This React application demonstrates the integration of modern tools
          and libraries.
        </Text>
      </div>

      <div className="mb-6">
        <Link to="/">
          <Tag color="blue" className="cursor-pointer">
            ← Back to Home
          </Tag>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Technologies Used" className="h-full">
          <div className="space-y-2">
            <Tag color="blue">React 19</Tag>
            <Tag color="green">TypeScript</Tag>
            <Tag color="purple">Vite</Tag>
            <Tag color="orange">Ant Design</Tag>
            <Tag color="red">Redux Toolkit</Tag>
            <Tag color="cyan">RTK Query</Tag>
            <Tag color="yellow">Tailwind CSS</Tag>
            <Tag color="pink">React Router</Tag>
            <Tag color="gray">ESLint</Tag>
            <Tag color="indigo">Prettier</Tag>
          </div>
        </Card>

        <Card title="Features" className="h-full">
          <List
            size="small"
            dataSource={[
              'Modern React with TypeScript',
              'State management with Redux Toolkit',
              'API calls with RTK Query',
              'Beautiful UI with Ant Design',
              'Responsive design with Tailwind',
              'Code quality with ESLint & Prettier',
              'Fast development with Vite',
            ]}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </Card>
      </div>

      {users && (
        <Card title="Sample Users" className="mt-6">
          <List
            dataSource={users.slice(0, 3)}
            renderItem={(user) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar>{user.name.charAt(0)}</Avatar>}
                  title={user.name}
                  description={
                    <div>
                      <Text>@{user.username}</Text>
                      <br />
                      <Text type="secondary">{user.email}</Text>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      )}
    </div>
  );
};

export default About;
