"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export default function FAQPage() {
    const faqs = [
        {
            question: "What is 'Did My Bit'?",
            answer:
                "'Did My Bit' is a platform that connects individuals with local community projects, allowing them to contribute their skills, time, or resources to make a positive impact in their area.",
        },
        {
            question: "How can I start a project on 'Did My Bit'?",
            answer:
                "To start a project, log in to your account, click on 'Create Project' in your dashboard, fill out the project details including its goals, required resources, and timeline, then submit it for approval.",
        },
        {
            question: "Is there a cost to use 'Did My Bit'?",
            answer:
                "No, 'Did My Bit' is free to use for both project creators and volunteers. We believe in making community engagement accessible to everyone.",
        },
        {
            question: "How are projects vetted?",
            answer:
                "Our team reviews each project submission to ensure it aligns with our community guidelines and has a clear, achievable goal. We may contact project creators for additional information if needed.",
        },
        {
            question: "Can I volunteer for multiple projects?",
            answer:
                "Yes, we encourage users to participate in as many projects as they can manage. You can browse and sign up for multiple projects that interest you.",
        },
        {
            question: "How do I track my impact?",
            answer:
                "Your personal dashboard shows all the projects you've contributed to, hours volunteered, and the overall impact of those projects. We also provide certificates for completed projects.",
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                duration: 0.5,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                duration: 0.5,
            },
        },
    };

    return (
        <div className="min-h-screen bg-white text-black">
            <motion.div
                className="container mx-auto px-4 py-16"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.h1
                    className="text-4xl font-bold text-center mb-8"
                    variants={itemVariants}
                >
                    Frequently Asked Questions
                </motion.h1>
                <motion.p
                    className="text-xl text-center mb-12 text-gray-600"
                    variants={itemVariants}
                >
                    Find answers to common questions about &apos;Did My Bit&apos; and how
                    you can make an impact in your community.
                </motion.p>

                <motion.div
                    className="w-full max-w-3xl mx-auto"
                    variants={containerVariants}
                >
                    <Accordion type="single" collapsible>
                        {faqs.map((faq, index) => (
                            <AccordionItem
                                key={index}
                                value={`item-${index}`}
                                className="border-b border-gray-200"
                            >
                                <AccordionTrigger className="text-left text-lg font-semibold hover:text-gray-700 transition-colors py-4">
                                    <motion.div variants={itemVariants}>{faq.question}</motion.div>
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-600 pb-4">
                                    <motion.div variants={itemVariants}>{faq.answer}</motion.div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </motion.div>

                <motion.div className="mt-16 text-center" variants={itemVariants}>
                    <p className="text-xl mb-4">Still have questions?</p>
                    <Button
                        asChild
                        className="bg-black hover:bg-gray-800 text-white font-semibold py-2 px-6 rounded-full transition-colors duration-300"
                    >
                        <motion.a
                            href="/contact"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Contact Us
                        </motion.a>
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    );
}
