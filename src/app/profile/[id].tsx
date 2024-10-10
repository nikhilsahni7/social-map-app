"use client";

import {
  Box,
  Text,
  Heading,
  VStack,
  HStack,
  Image,
  Tag,
  Divider,
  Badge,
  Stack,
  Button,
  Link,
} from "@chakra-ui/react";

interface ProjectDetailsProps {
  creator: string;
  title: string;
  preview: string;
  details: string;
  category: string;
  dateRange: string;
  photoCaption: string;
  supportNeeded: string;
  others: string;
}

const ProjectDetails = ({
  creator,
  title,
  preview,
  details,
  category,
  dateRange,
  photoCaption,
  supportNeeded,
  others,
}: ProjectDetailsProps) => {
  return (
    <Box maxW="1200px" mx="auto" p={8}>
      {/* Organization Name */}
      <Heading textAlign="center" mb={8} size="2xl" fontWeight="bold">
        Your Organization Name
      </Heading>

      {/* Project Details */}
      <VStack align="start" spacing={8}>
        {/* Title and Creator */}
        <VStack align="start">
          <Heading as="h1" size="xl">
            {title}
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Created by: {creator}
          </Text>
        </VStack>

        {/* Preview and Tags */}
        <Box>
          <Image
            src={preview}
            alt={`${title} Preview`}
            borderRadius="lg"
            mb={4}
          />
          <Text color="gray.600" fontSize="sm">
            {photoCaption}
          </Text>
        </Box>

        {/* Category and Date Range */}
        <HStack spacing={4}>
          <Tag size="lg" colorScheme="blue">
            {category}
          </Tag>
          <Text fontSize="md" fontWeight="semibold">
            {dateRange}
          </Text>
        </HStack>

        {/* Project Description */}
        <Box>
          <Heading as="h2" size="md" mb={2}>
            Project Details
          </Heading>
          <Text fontSize="lg" color="gray.700">
            {details}
          </Text>
        </Box>

        {/* Support Needed */}
        <Box>
          <Heading as="h2" size="md" mb={2}>
            Support Needed
          </Heading>
          <Text fontSize="lg" color="gray.700">
            {supportNeeded}
          </Text>
        </Box>

        {/* Additional Information */}
        <Box>
          <Heading as="h2" size="md" mb={2}>
            Additional Information
          </Heading>
          <Text fontSize="lg" color="gray.700">
            {others}
          </Text>
        </Box>

        {/* Call to Action or Links */}
        <Box>
          <Link href="/contact" _hover={{ textDecoration: "none" }}>
            <Button colorScheme="blue" size="lg">
              Contact for Support
            </Button>
          </Link>
        </Box>
      </VStack>
    </Box>
  );
};

export default ProjectDetails;

// Sample data to pass as props
ProjectDetails.defaultProps = {
  creator: "John Doe",
  title: "Innovative Map Project",
  preview: "/images/project-preview.jpg",
  details:
    "This project is focused on creating an interactive map platform that helps users navigate and explore different regions.",
  category: "HDA, Duralin",
  dateRange: "January 2023 - March 2023",
  photoCaption: "Preview of the map project",
  supportNeeded: "Looking for frontend and backend developers",
  others: "For more information, reach out to the project creator.",
};
