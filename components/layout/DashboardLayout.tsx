"use client"

import { useState, useEffect } from "react"
import { Box, Flex, Spinner, Text, Stack } from "@chakra-ui/react"
import { useRouter } from "next/navigation"
import { Sidebar } from "./Sidebar"
import { DashboardHeader } from "./DashboardHeader"
import { useAuth } from "@/lib/auth-context"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login")  // Maps to app/(auth)/login/page.tsx
    }
  }, [isLoading, isAuthenticated, router])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <Flex h="100vh" align="center" justify="center" bg="gray.50" _dark={{ bg: "gray.900" }}>
        <Stack align="center" gap={4}>
          <Spinner size="xl" color="teal.500" />
          <Text color="gray.500" fontSize="sm">Loading...</Text>
        </Stack>
      </Flex>
    )
  }

  // Don't render dashboard content if not authenticated (redirect is in progress)
  if (!isAuthenticated) {
    return (
      <Flex h="100vh" align="center" justify="center" bg="gray.50" _dark={{ bg: "gray.900" }}>
        <Stack align="center" gap={4}>
          <Spinner size="xl" color="teal.500" />
          <Text color="gray.500" fontSize="sm">Redirecting to login...</Text>
        </Stack>
      </Flex>
    )
  }

  return (
    <Flex h="100vh" overflow="hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="blackAlpha.600"
          zIndex={15}
          display={{ base: "block", md: "none" }}
          onClick={toggleSidebar}
        />
      )}

      {/* Main content */}
      <Flex direction="column" flex={1} overflow="hidden">
        <DashboardHeader onMenuClick={toggleSidebar} />
        
        <Box
          as="main"
          flex={1}
          overflow="auto"
          bg="gray.50"
          _dark={{ bg: "gray.900" }}
        >
          {children}
        </Box>
      </Flex>
    </Flex>
  )
}
