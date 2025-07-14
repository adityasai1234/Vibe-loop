"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

interface ResponsiveDrawerExampleProps {
  title?: string
  description?: string
  children?: React.ReactNode
  triggerText?: string
}

export function ResponsiveDrawerExample({
  title = "Responsive Drawer",
  description = "This drawer is optimized for mobile devices with proper safe area handling and touch interactions.",
  children,
  triggerText = "Open Drawer"
}: ResponsiveDrawerExampleProps) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto">
          {triggerText}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[85vh] sm:max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle className="text-base sm:text-lg">{title}</DrawerTitle>
          <DrawerDescription className="text-xs sm:text-sm">
            {description}
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {children || (
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Mobile Features</h4>
                <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
                  <li>• Safe area insets for notched devices</li>
                  <li>• Touch-friendly interactions</li>
                  <li>• Responsive typography</li>
                  <li>• Proper overflow handling</li>
                  <li>• Sticky header and footer</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Content Area</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  This area can contain any content and will scroll properly on mobile devices.
                  The drawer automatically adjusts its height based on the viewport and content.
                </p>
              </div>
              
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Scrollable Content</h4>
                {Array.from({ length: 10 }, (_, i) => (
                  <div
                    key={i}
                    className="p-3 bg-muted rounded-lg text-xs sm:text-sm"
                  >
                    Content item {i + 1} - This demonstrates scrolling behavior
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <DrawerFooter>
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <Button className="flex-1" variant="outline">
              Secondary Action
            </Button>
            <Button className="flex-1">
              Primary Action
            </Button>
          </div>
          <DrawerClose asChild>
            <Button variant="ghost" className="w-full">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
} 