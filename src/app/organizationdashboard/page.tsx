"use client";
import { useState } from "react";
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
  Button,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  FormControl,
  FormLabel,
  VStack,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon, AddIcon } from "@chakra-ui/icons";

// Define custom colors
const colors = {
  brand: {
    purple: "#764ede",
    green: "#6cd30b",
  },
};

// Extend the theme
const theme = extendTheme({ colors });

// Organization Interface
interface Organization {
  name: string;
  location: string;
  logo: string;
}

// Dummy data for organizations
const initialOrganizations: Organization[] = [
  {
    name: "Helping Hands",
    location: "San Francisco, CA",
    logo: "https://via.placeholder.com/150",
  },
  {
    name: "Green Earth Initiative",
    location: "Austin, TX",
    logo: "https://via.placeholder.com/150",
  },
  {
    name: "Future Leaders",
    location: "Boston, MA",
    logo: "https://via.placeholder.com/150",
  },
];

const OrganizationDashboard = () => {
  const [organizations, setOrganizations] =
    useState<Organization[]>(initialOrganizations);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newOrganization, setNewOrganization] = useState<Organization>({
    name: "",
    location: "",
    logo: "",
  });
  const [editingOrganizationIndex, setEditingOrganizationIndex] = useState<
    number | null
  >(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewOrganization({ ...newOrganization, [e.target.name]: e.target.value });
  };

  // Add a new organization
  const handleAddOrganization = () => {
    setOrganizations([...organizations, newOrganization]);
    setNewOrganization({ name: "", location: "", logo: "" });
    onClose();
  };

  // Edit an existing organization
  const handleEditOrganization = (index: number) => {
    setNewOrganization(organizations[index]);
    setEditingOrganizationIndex(index);
    onOpen();
  };

  const handleSaveEdit = () => {
    const updatedOrganizations = [...organizations];
    if (editingOrganizationIndex !== null) {
      updatedOrganizations[editingOrganizationIndex] = newOrganization;
    }
    setOrganizations(updatedOrganizations);
    setEditingOrganizationIndex(null);
    setNewOrganization({ name: "", location: "", logo: "" });
    onClose();
  };

  // Delete an organization
  const handleDeleteOrganization = (index: number) => {
    setOrganizations(organizations.filter((_, i) => i !== index));
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
        <Box width="full" padding={6} backgroundColor="white" boxShadow="md">
          <Heading textAlign="center" size="lg" color="brand.purple">
            Admin Dashboard - Organization Management
          </Heading>
        </Box>

        {/* Add Organization Button */}
        <Flex width="full" justifyContent="flex-end" padding={4}>
          <Button
            colorScheme="green"
            leftIcon={<AddIcon />}
            onClick={onOpen}
            boxShadow="md"
          >
            Add Organization
          </Button>
        </Flex>

        {/* Organization List */}
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
          gap={6}
          marginTop={6}
          padding={4}
          width="full"
        >
          {organizations.map((org, index) => (
            <Box
              key={index}
              borderWidth="1px"
              borderRadius="md"
              overflow="hidden"
              backgroundColor="white"
              boxShadow="lg"
              transition="transform 0.2s, box-shadow 0.2s"
              _hover={{ transform: "scale(1.05)", boxShadow: "xl" }}
            >
              <Image src={org.logo} alt={org.name} />
              <Box p={4}>
                <Heading size="md" color="brand.purple">
                  {org.name}
                </Heading>
                <Text color="gray.600">{org.location}</Text>
                <Flex justify="space-between" mt={4}>
                  <IconButton
                    aria-label="Edit"
                    icon={<EditIcon />}
                    colorScheme="blue"
                    onClick={() => handleEditOrganization(index)}
                  />
                  <IconButton
                    aria-label="Delete"
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    onClick={() => handleDeleteOrganization(index)}
                  />
                </Flex>
              </Box>
            </Box>
          ))}
        </Grid>

        {/* Add/Edit Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {editingOrganizationIndex === null ? "Add" : "Edit"} Organization
            </ModalHeader>
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input
                    name="name"
                    value={newOrganization.name}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Location</FormLabel>
                  <Input
                    name="location"
                    value={newOrganization.location}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Logo URL</FormLabel>
                  <Input
                    name="logo"
                    value={newOrganization.logo}
                    onChange={handleChange}
                  />
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="green"
                mr={3}
                onClick={
                  editingOrganizationIndex === null
                    ? handleAddOrganization
                    : handleSaveEdit
                }
              >
                {editingOrganizationIndex === null ? "Add" : "Save"}
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Footer Section */}
        <Box
          width="full"
          padding={4}
          marginTop="auto"
          backgroundColor="white"
          boxShadow="md"
        >
          <Center>
            <Text fontSize="sm" color="gray.500">
              © 2024 Organization Dashboard. All rights reserved.
            </Text>
          </Center>
        </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default OrganizationDashboard;
