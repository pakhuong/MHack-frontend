import { useGetPostsQuery } from '../services/api';
import { Button, Card, Typography, Space, Spin } from 'antd';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const Home = () => {
  const { data: posts, isLoading, error } = useGetPostsQuery();

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
        <Text type="danger">Error loading posts</Text>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <Title level={1}>Welcome to React Boilerplate</Title>
        <Text className="text-lg">
          This is a modern React application with TypeScript, Ant Design, Redux
          Toolkit, and Tailwind CSS.
        </Text>
      </div>

      <div className="mb-6">
        <Space>
          <Button type="primary" size="large">
            Get Started
          </Button>
          <Link to="/about">
            <Button size="large">Learn More</Button>
          </Link>
        </Space>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts?.slice(0, 6).map((post) => (
          <Card key={post.id} title={post.title} className="h-full">
            <Text className="text-gray-600">
              {post.body.substring(0, 100)}...
            </Text>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Home;
