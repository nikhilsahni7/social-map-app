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
  Center,
  IconButton,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import NextLink from "next/link";
import { MdAdminPanelSettings } from "react-icons/md";

// Define custom colors
const colors = {
  brand: {
    purple: "#764ede",
    green: "#6cd30b",
  },
};

// Extend the theme
const theme = extendTheme({ colors });

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
        {/* Admin Dashboard Button */}
        <Box
          width="full"
          padding={4}
          display="flex"
          alignItems="center"
          backgroundColor="white"
          boxShadow="md"
          borderRadius="md"
        >
          {/* Admin Dashboard Link */}
          <NextLink href="/admindashboard" passHref>
            <IconButton
              as="a"
              aria-label="Admin Dashboard"
              icon={<MdAdminPanelSettings />}
              colorScheme="purple"
              boxShadow="md"
              _hover={{ boxShadow: "lg" }}
              borderRadius="full"
              fontSize="2xl" // Increase the icon size
            />
          </NextLink>

          {/* Heading */}
          <Heading
            size="lg"
            color="brand.purple"
            textAlign="center"
            flexGrow={1}
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

        {/* Footer Section */}
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
