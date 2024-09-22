"use client";
import { useState } from "react";
import NextLink from "next/link";
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
import { DeleteIcon, EditIcon, AddIcon, ArrowBackIcon } from "@chakra-ui/icons";

// Define custom colors
const colors = {
  brand: {
    purple: "#764ede",
    green: "#6cd30b",
  },
};

// Extend the theme
const theme = extendTheme({ colors });

// Social Worker Interface
interface SocialWorker {
  name: string;
  location: string;
  profileImage: string;
}

// Dummy data for social workers
const initialWorkers: SocialWorker[] = [
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

const AdminDashboard = () => {
  const [socialWorkers, setSocialWorkers] =
    useState<SocialWorker[]>(initialWorkers);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newWorker, setNewWorker] = useState<SocialWorker>({
    name: "",
    location: "",
    profileImage: "",
  });
  const [editingWorkerIndex, setEditingWorkerIndex] = useState<number | null>(
    null
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewWorker({ ...newWorker, [e.target.name]: e.target.value });
  };

  // Add a new social worker
  const handleAddWorker = () => {
    setSocialWorkers([...socialWorkers, newWorker]);
    setNewWorker({ name: "", location: "", profileImage: "" });
    onClose();
  };

  // Edit an existing social worker
  const handleEditWorker = (index: number) => {
    setNewWorker(socialWorkers[index]);
    setEditingWorkerIndex(index);
    onOpen();
  };

  const handleSaveEdit = () => {
    const updatedWorkers = [...socialWorkers];
    if (editingWorkerIndex !== null) {
      updatedWorkers[editingWorkerIndex] = newWorker;
    }
    setSocialWorkers(updatedWorkers);
    setEditingWorkerIndex(null);
    setNewWorker({ name: "", location: "", profileImage: "" });
    onClose();
  };

  // Delete a social worker
  const handleDeleteWorker = (index: number) => {
    setSocialWorkers(socialWorkers.filter((_, i) => i !== index));
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
        <Box width="full" padding={6} backgroundColor="white" boxShadow="md">
          <Flex justifyContent="space-between" alignItems="center">
            <NextLink href="/home" passHref>
              <IconButton
                as="a"
                aria-label="Go Home"
                icon={<ArrowBackIcon />}
                colorScheme="purple"
                boxShadow="md"
                _hover={{ boxShadow: "lg" }}
              />
            </NextLink>
            <Heading textAlign="center" size="lg" color="brand.purple" flex="1">
              Admin Dashboard - Social Worker Management
            </Heading>
          </Flex>
        </Box>

        {/* Add Social Worker Button */}
        <Flex width="full" justifyContent="flex-end" padding={4}>
          <Button
            colorScheme="green"
            leftIcon={<AddIcon />}
            onClick={onOpen}
            boxShadow="md"
          >
            Add Social Worker
          </Button>
        </Flex>

        {/* Social Worker List */}
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
          gap={6}
          marginTop={6}
          padding={4}
          width="full"
        >
          {socialWorkers.map((worker, index) => (
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
              <Image src={worker.profileImage} alt={worker.name} />
              <Box p={4}>
                <Heading size="md" color="brand.purple">
                  {worker.name}
                </Heading>
                <Text color="gray.600">{worker.location}</Text>
                <Flex justify="space-between" mt={4}>
                  <IconButton
                    aria-label="Edit"
                    icon={<EditIcon />}
                    colorScheme="blue"
                    onClick={() => handleEditWorker(index)}
                  />
                  <IconButton
                    aria-label="Delete"
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    onClick={() => handleDeleteWorker(index)}
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
              {editingWorkerIndex === null ? "Add" : "Edit"} Social Worker
            </ModalHeader>
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input
                    name="name"
                    value={newWorker.name}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Location</FormLabel>
                  <Input
                    name="location"
                    value={newWorker.location}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Profile Image URL</FormLabel>
                  <Input
                    name="profileImage"
                    value={newWorker.profileImage}
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
                  editingWorkerIndex === null ? handleAddWorker : handleSaveEdit
                }
              >
                {editingWorkerIndex === null ? "Add" : "Save"}
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
              © 2024 Social Worker Locator Admin. All rights reserved.
            </Text>
          </Center>
        </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default AdminDashboard;
