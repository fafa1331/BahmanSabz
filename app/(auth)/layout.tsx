"use client"

import { Box, Container } from "@chakra-ui/react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
      _dark={{ bg: "gray.900" }}
    >
      <Container maxW="md" py={12}>
        {children}
      </Container>
    </Box>
  )
}
