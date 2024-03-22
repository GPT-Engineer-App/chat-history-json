import { useState, useEffect, useCallback } from "react";
import { Box, Flex, Heading, Input, Button, Text, VStack, useToast } from "@chakra-ui/react";
import { FaPaperPlane } from "react-icons/fa";

const API_URL = "https://backengine-6pli.fly.dev";

const Index = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState("");
  const toast = useToast();

  useEffect(() => {
    fetchChatHistory();
  }, []);

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/chat-history`);

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
      </Flex>

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
  );
};
export default Index;
