'use client'

import { errorMessageAtom } from "@/atoms/widget-atoms"
import { useAtomValue } from "jotai"

import React from 'react'
import WidgetHeader from "../widget-header"
import { AlertTriangleIcon } from "lucide-react"

function WidgetErrorScreen() {
    const errorMessage = useAtomValue(errorMessageAtom)

  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
          <p className="text-3xl">Hi there 🤚</p>
          <p className="text-lg">Let's get you started!</p>
        </div>
      </WidgetHeader>
      <div className="flex flex-1  gap-y-4 p-4 flex-col ">
        
      </div>
    </>
  )
}

export default WidgetErrorScreen
