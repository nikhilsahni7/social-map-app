"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChakraProvider,
  extendTheme,
  Box,
  Button,
  Input,
  Heading,
  Text,
  VStack,
  Flex,
  Link,
  Center,
} from "@chakra-ui/react";

// Define custom colors
const colors = {
  brand: {
    purple: "#764ede",
    green: "#6cd30b",
  },
};

// Extend the theme
const theme = extendTheme({ colors });

interface FormState {
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUpPage = () => {
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Submit form logic
  };

  return (
    <ChakraProvider theme={theme}>
      <Flex
        minHeight="100vh"
        width="full"
        align="center"
        justifyContent="center"
        padding={4}
        backgroundColor="gray.50"
      >
        <Center>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            style={{ width: "100%" }}
          >
            <Box
              as="form"
              onSubmit={handleSubmit}
              width="400px"
              maxWidth="500px"
              padding="2rem"
              boxShadow="lg"
              borderRadius="md"
              backgroundColor="white"
            >
              <Heading
                p={1}
                mb={6}
                textAlign="center"
                bgGradient="linear(to-r, brand.purple, brand.green)"
                bgClip="text"
                fontSize="4xl"
              >
                Sign Up
              </Heading>
              <VStack spacing={5}>
                <Input
                  placeholder="Email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  focusBorderColor="brand.green"
                />
                <Input
                  placeholder="Password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  focusBorderColor="brand.green"
                />
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  focusBorderColor="brand.green"
                />
                <Button
                  type="submit"
                  width="100%"
                  colorScheme="green"
                  boxShadow="md"
                  _hover={{ transform: "scale(1.05)" }}
                >
                  Sign Up
                </Button>
                <Flex width="100%" justifyContent="center" alignItems="center">
                  <Text mr={2}>Already have an account?</Text>
                  <Link href="/login" color="brand.purple">
                    Login
                  </Link>
                </Flex>
              </VStack>
            </Box>
          </motion.div>
        </Center>
      </Flex>
    </ChakraProvider>
  );
};

export default SignUpPage;
