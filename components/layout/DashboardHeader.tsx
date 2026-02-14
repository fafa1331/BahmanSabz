"use client"

import {
  Box,
  Flex,
  HStack,
  IconButton,
  Input,
  Text,
  Image,
} from "@chakra-ui/react"
import { FiMenu, FiSearch, FiBell, FiMoon, FiSun } from "react-icons/fi"
import { useColorMode } from "@/components/ui/color-mode"
import { useAuth } from "@/lib/auth-context"

interface DashboardHeaderProps {
  onMenuClick?: () => void
}

/**
 * Dashboard Header
 * Shows search bar, theme toggle, notifications, and user info.
 */
export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const { colorMode, toggleColorMode } = useColorMode()
  const { user, isAuthenticated } = useAuth()

  return (
    <Box
      as="header"
      bg="white"
      _dark={{ bg: "gray.800" }}
      borderBottom="1px"
      borderColor="gray.200"
      position="sticky"
      top="0"
      zIndex={10}
    >
      <Flex
        h={16}
        alignItems="center"
        justifyContent="space-between"
        px={{ base: 4, md: 6 }}
      >
        {/* Left side */}
        <HStack gap={4}>
          <IconButton
            display={{ base: "flex", md: "none" }}
            aria-label="Open menu"
            variant="ghost"
            onClick={onMenuClick}
          >
            <FiMenu />
          </IconButton>

          <Box
            display={{ base: "none", md: "block" }}
            position="relative"
            w="md"
          >
            <Input
              placeholder="Search..."
              pl={10}
              bg="gray.50"
              _dark={{ bg: "gray.700" }}
              border="none"
            />
            <Box
              position="absolute"
              left={3}
              top="50%"
              transform="translateY(-50%)"
              color="gray.500"
            >
              <FiSearch />
            </Box>
          </Box>
        </HStack>

        {/* Right side */}
        <HStack gap={2}>
          <IconButton
            aria-label="Toggle color mode"
            variant="ghost"
            onClick={toggleColorMode}
          >
            {colorMode === "light" ? <FiMoon /> : <FiSun />}
          </IconButton>

          <IconButton
            aria-label="Notifications"
            variant="ghost"
            position="relative"
          >
            <FiBell />
            <Box
              position="absolute"
              top={2}
              right={2}
              w={2}
              h={2}
              bg="red.500"
              borderRadius="full"
            />
          </IconButton>

          {isAuthenticated && user && (
            <Box
              display={{ base: "none", md: "flex" }}
              alignItems="center"
              gap={3}
              ml={4}
              pl={4}
              borderLeft="1px"
              borderColor="gray.200"
              _dark={{ borderColor: "gray.700" }}
            >
              {user.image ? (
                <Image
                  src={user.image}
                  alt={`${user.firstName} ${user.lastName}`}
                  w={8}
                  h={8}
                  borderRadius="full"
                  objectFit="cover"
                />
              ) : (
                <Box
                  w={8}
                  h={8}
                  borderRadius="full"
                  bg="teal.500"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="white"
                  fontWeight="bold"
                  fontSize="sm"
                >
                  {user.firstName[0]}
                </Box>
              )}
              <Box>
                <Text fontWeight="semibold" fontSize="sm">
                  {user.firstName} {user.lastName}
                </Text>
                <Text fontSize="xs" color="gray.600" _dark={{ color: "gray.400" }}>
                  {user.email}
                </Text>
              </Box>
            </Box>
          )}
        </HStack>
      </Flex>
    </Box>
  )
}
