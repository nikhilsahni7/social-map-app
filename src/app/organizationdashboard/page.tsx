"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Heading,
  Text,
  Link,
  extendTheme,
  ChakraProvider,
  HStack,
  Badge,
} from "@chakra-ui/react";

// Define custom colors
const theme = extendTheme({
  colors: {
    brand: {
      primary: "#4a5568",
      secondary: "#718096",
      hover: "#2d3748",
    },
  },
});

// Define the type for an organization
interface Organization {
  name: string;
  description: string;
  mapUrl: string;
  category: string;
}

const Dashboard: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [formData, setFormData] = useState<Organization>({
    name: "",
    description: "",
    mapUrl: "",
    category: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      formData.name &&
      formData.description &&
      formData.mapUrl &&
      formData.category
    ) {
      setOrganizations([...organizations, formData]);
      setFormData({ name: "", description: "", mapUrl: "", category: "" });
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <Box w="full" minH="100vh" bg="gray.100" py={10} px={5}>
        <Box
          maxW="700px"
          mx="auto"
          bg="white"
          p={6}
          borderRadius="lg"
          shadow="md"
        >
          <Heading
            as="h1"
            size="lg"
            textAlign="center"
            mb={6}
            color="brand.primary"
          >
            Social Organization Dashboard
          </Heading>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <FormControl id="name" isRequired>
                <FormLabel>Organization Name</FormLabel>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter organization name"
                  bg="gray.50"
                />
              </FormControl>
              <FormControl id="description" isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter description of organization"
                  bg="gray.50"
                  rows={3}
                />
              </FormControl>
              <FormControl id="mapUrl" isRequired>
                <FormLabel>Google Maps URL</FormLabel>
                <Input
                  type="url"
                  name="mapUrl"
                  value={formData.mapUrl}
                  onChange={handleChange}
                  placeholder="Enter Google Maps URL"
                  bg="gray.50"
                />
              </FormControl>
              <FormControl id="category" isRequired>
                <FormLabel>Category</FormLabel>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #E2E8F0",
                    backgroundColor: "#F7FAFC",
                  }}
                >
                  <option value="">Select a category</option>
                  <option value="Education">Education</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Environment">Environment</option>
                  <option value="Community">Community</option>
                  <option value="Other">Other</option>
                </select>
              </FormControl>
              <Button
                type="submit"
                bg="brand.primary"
                color="white"
                size="md"
                w="full"
                _hover={{ bg: "brand.hover" }}
              >
                Submit Organization
              </Button>
            </VStack>
          </form>

          {organizations.length > 0 && (
            <Box mt={8}>
              <Heading as="h2" size="md" color="brand.primary" mb={4}>
                Submitted Organizations
              </Heading>
              {organizations.map((org, index) => (
                <Box
                  key={index}
                  p={3}
                  bg="gray.50"
                  mb={3}
                  borderRadius="md"
                  border="1px solid"
                  borderColor="gray.200"
                >
                  <HStack justify="space-between" mb={2}>
                    <Heading as="h3" size="sm">
                      {org.name}
                    </Heading>
                    <Badge colorScheme="blue">{org.category}</Badge>
                  </HStack>
                  <Text fontSize="sm" mb={2}>
                    {org.description}
                  </Text>
                  <Link
                    href={org.mapUrl}
                    color="blue.500"
                    isExternal
                    fontSize="sm"
                  >
                    View on Google Maps
                  </Link>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default Dashboard;
