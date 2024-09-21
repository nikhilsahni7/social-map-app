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
}

const LoginPage = () => {
  const [form, setForm] = useState<FormState>({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <ChakraProvider theme={theme}>
      <Flex
        minHeight="100vh"
        width="full"
        align="center"
        justifyContent="center"
        backgroundColor="gray.50"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            as="form"
            onSubmit={handleSubmit}
            width="500px"
            maxWidth="400px"
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
            >
              Login
            </Heading>
            <VStack spacing={4}>
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
              <Button
                type="submit"
                width="100%"
                colorScheme="green"
                boxShadow="md"
                _hover={{ transform: "scale(1.05)" }}
              >
                Login
              </Button>
              <Text>
                Don&apos;t have an account?{" "}
                <Box as="a" href="/signup" color="brand.purple">
                  Sign Up
                </Box>
              </Text>
            </VStack>
          </Box>
        </motion.div>
      </Flex>
    </ChakraProvider>
  );
};

export default LoginPage;
