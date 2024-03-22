import { useState, useEffect } from "react";
import { Box, Flex, Heading, Input, Button, Text, VStack, useToast } from "@chakra-ui/react";
import { FaSignInAlt, FaSignOutAlt, FaPaperPlane } from "react-icons/fa";

const API_URL = "https://backengine-6pli.fly.dev";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState("");
  const toast = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const storedToken = localStorage.getItem("accessToken");
    if (storedToken) {
      setIsLoggedIn(true);
      setAccessToken(storedToken);
      fetchChatHistory(storedToken);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setAccessToken(data.accessToken);
        localStorage.setItem("accessToken", data.accessToken);
        fetchChatHistory(data.accessToken);
      } else {
        const errorData = await response.json();
        toast({
          title: "Login Failed",
          description: errorData.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAccessToken("");
    localStorage.removeItem("accessToken");
    setChatHistory([]);
  };

  const fetchChatHistory = async (token) => {
    try {
      const response = await fetch(`${API_URL}/chat-history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setChatHistory(data);
      } else {
        console.error("Failed to fetch chat history");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSendMessage = async () => {
    // TODO: Implement sending message to the backend API
    setMessage("");
  };

  return (
    <Box p={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading>Chat App</Heading>
        {isLoggedIn ? (
          <Button onClick={handleLogout} leftIcon={<FaSignOutAlt />}>
            Logout
          </Button>
        ) : (
          <Box>
            <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} mr={2} />
            <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} mr={2} />
            <Button onClick={handleLogin} leftIcon={<FaSignInAlt />}>
              Login
            </Button>
          </Box>
        )}
      </Flex>

      {isLoggedIn && (
        <Box>
          <VStack spacing={4} align="stretch">
            {chatHistory.map((chat, index) => (
              <Box key={index} bg="gray.100" p={2} borderRadius="md">
                <Text>{chat.message}</Text>
              </Box>
            ))}
          </VStack>

          <Flex mt={4}>
            <Input placeholder="Type a message..." value={message} onChange={(e) => setMessage(e.target.value)} mr={2} />
            <Button onClick={handleSendMessage} colorScheme="blue" leftIcon={<FaPaperPlane />}>
              Send
            </Button>
          </Flex>
        </Box>
      )}
    </Box>
  );
};

export default Index;
