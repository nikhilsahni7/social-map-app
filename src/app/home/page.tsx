"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChakraProvider,
  Box,
  Input,
  Heading,
  Text,
  extendTheme,
  Flex,
  Grid,
  Image,
  Center,
  IconButton,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

// Define custom colors
const colors = {
  brand: {
    purple: "#764ede",
    green: "#6cd30b",
  },
};

// Extend the theme
const theme = extendTheme({ colors });

interface SocialWorker {
  name: string;
  location: string;
  profileImage: string;
}

const socialWorkers: SocialWorker[] = [
  {
    name: "John Doe",
    location: "New York, NY",
    profileImage: "https://via.placeholder.com/150",
  },
  {
    name: "Jane Smith",
    location: "Los Angeles, CA",
    profileImage: "https://via.placeholder.com/150",
  },
  {
    name: "Emily Johnson",
    location: "Chicago, IL",
    profileImage: "https://via.placeholder.com/150",
  },
];

const SocialWorkerLocator = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <ChakraProvider theme={theme}>
      <Flex
        direction="column"
        minHeight="100vh"
        width="full"
        align="center"
        justifyContent="flex-start"
        padding={4}
        backgroundColor="gray.50"
      >
        {/* Header Section */}
        <Box
          width="full"
          padding={5}
          backgroundColor="white"
          boxShadow="md"
          borderRadius="md"
        >
          <Heading
            textAlign="center"
            justifyContent="center"
            mt={-4}
            size="lg"
            color="brand.purple"
          >
            Locate Social Workers
          </Heading>
        </Box>

        {/* Search Bar Section */}
        <Flex
          as={motion.div}
          width="full"
          maxWidth="600px"
          marginTop={4}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Input
            placeholder="Search for social workers..."
            value={searchTerm}
            onChange={handleSearchChange}
            focusBorderColor="brand.green"
            borderRadius="md"
            boxShadow="sm"
            _hover={{ boxShadow: "md" }}
            marginRight={2}
          />
          <IconButton
            aria-label="Search"
            icon={<SearchIcon />}
            colorScheme="green"
            borderRadius="md"
            boxShadow="sm"
            _hover={{ boxShadow: "md" }}
            onClick={() => console.log("Search clicked!")}
          />
        </Flex>

        <Box
          width="full"
          padding={4}
          marginTop="auto"
          backgroundColor="white"
          boxShadow="md"
          borderRadius="md"
        >
          <Center>
            <Text fontSize="sm" color="gray.500">
              © 2024 Social Worker Locator. All rights reserved.
            </Text>
          </Center>
        </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default SocialWorkerLocator;
