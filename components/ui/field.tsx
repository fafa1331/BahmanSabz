"use client"

import { Box, HStack, Stack, Text } from "@chakra-ui/react"
import * as React from "react"

export interface FieldProps extends React.PropsWithChildren {
  label?: React.ReactNode
  required?: boolean
  helperText?: React.ReactNode
  errorText?: React.ReactNode
  optionalText?: React.ReactNode
}

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  function Field(props, ref) {
    const {
      label,
      children,
      required,
      helperText,
      errorText,
      optionalText,
      ...rest
    } = props

    return (
      <Box ref={ref} {...rest}>
        <Stack gap="1.5">
          {label && (
            <HStack gap="1">
              <Text
                fontWeight="medium"
                fontSize="sm"
                color={errorText ? "red.500" : undefined}
              >
                {label}
              </Text>
              {required && (
                <Text color="red.500" fontSize="sm">
                  *
                </Text>
              )}
              {optionalText && (
                <Text color="gray.500" fontSize="sm">
                  {optionalText}
                </Text>
              )}
            </HStack>
          )}
          {children}
          {helperText && !errorText && (
            <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
              {helperText}
            </Text>
          )}
          {errorText && (
            <Text fontSize="sm" color="red.500">
              {errorText}
            </Text>
          )}
        </Stack>
      </Box>
    )
  }
)
