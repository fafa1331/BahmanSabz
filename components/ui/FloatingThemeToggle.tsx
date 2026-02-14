"use client"

import { IconButton, Box } from "@chakra-ui/react"
import { FiMoon, FiSun } from "react-icons/fi"
import { useColorMode } from "./color-mode"

export function FloatingThemeToggle() {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Box
      position="fixed"
      bottom={6}
      right={6}
      zIndex={1000}
    >
      <IconButton
        aria-label="Toggle theme"
        onClick={toggleColorMode}
        size="lg"
        colorScheme="blue"
        borderRadius="full"
        boxShadow="lg"
        _hover={{
          transform: "scale(1.1)",
        }}
        transition="all 0.2s"
      >
        {colorMode === "light" ? <FiMoon /> : <FiSun />}
      </IconButton>
    </Box>
  )
}
