import React, { useState, useEffect } from "react";
import { Box, Button, Container, Heading, Input, VStack, HStack, Text, IconButton, useToast, Textarea, List, ListItem, ListIcon } from "@chakra-ui/react";
import { FaPlus, FaTrash } from "react-icons/fa";
// Removed the import for date-fns

const Index = () => {
  const [gratitudes, setGratitudes] = useState({});
  const [inputValue, setInputValue] = useState("");
  const toast = useToast();

  useEffect(() => {
    // Load saved gratitudes from local storage
    const savedGratitudes = JSON.parse(localStorage.getItem("gratitudes")) || {};
    setGratitudes(savedGratitudes);
  }, []);

  useEffect(() => {
    // Save gratitudes to local storage whenever they change
    localStorage.setItem("gratitudes", JSON.stringify(gratitudes));
  }, [gratitudes]);

  const addGratitude = () => {
    const today = new Date().toISOString().split("T")[0];
    if (inputValue.trim() !== "") {
      const newGratitudes = {
        ...gratitudes,
        [today]: [...(gratitudes[today] || []), inputValue.trim()],
      };
      setGratitudes(newGratitudes);
      setInputValue("");
      toast({
        title: "Gratitude added",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const deleteGratitude = (date, index) => {
    const updatedGratitudes = {
      ...gratitudes,
      [date]: [...gratitudes[date].slice(0, index), ...gratitudes[date].slice(index + 1)],
    };
    if (updatedGratitudes[date].length === 0) {
      delete updatedGratitudes[date]; // Remove the date entry if no gratitudes are left
    }
    setGratitudes(updatedGratitudes);
  };

  return (
    <Container maxW="container.md" py={5}>
      <VStack spacing={6}>
        <Heading>Gratuity Journal</Heading>
        <Textarea placeholder="What are you grateful for today?" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
        <Button leftIcon={<FaPlus />} colorScheme="teal" onClick={addGratitude}>
          Add Gratitude
        </Button>
        <Box w="100%">
          <Heading size="md">Today's Gratitudes</Heading>
          <List>
            {gratitudes[new Date().toISOString().split("T")[0]]?.map((item, index) => (
              <ListItem key={index} my={2}>
                <HStack spacing={2}>
                  <ListIcon as={FaPlus} color="green.500" />
                  <Text>{item}</Text>
                  <IconButton aria-label="Delete gratitude" icon={<FaTrash />} size="sm" onClick={() => deleteGratitude(new Date().toISOString().split("T")[0], index)} />
                </HStack>
              </ListItem>
            ))}
          </List>
        </Box>
        <Box w="100%">
          <Heading size="md">Past Gratitudes</Heading>
          <List>
            {Object.entries(gratitudes)
              .filter(([date]) => date !== new Date().toISOString().split("T")[0])
              .map(([date, items]) => (
                <Box key={date} my={4}>
                  <Heading size="sm" mb={2}>
                    {date}
                  </Heading>
                  {items.map((item, index) => (
                    <ListItem key={index} my={2}>
                      <HStack spacing={2}>
                        <ListIcon as={FaPlus} color="green.500" />
                        <Text>{item}</Text>
                        <IconButton aria-label="Delete gratitude" icon={<FaTrash />} size="sm" onClick={() => deleteGratitude(date, index)} />
                      </HStack>
                    </ListItem>
                  ))}
                </Box>
              ))}
          </List>
        </Box>
      </VStack>
    </Container>
  );
};

export default Index;
