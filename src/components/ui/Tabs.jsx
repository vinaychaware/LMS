import React, { useState } from 'react'
import { cn } from '../../utils/cn'

const Tabs = ({ children, defaultValue, value, onValueChange, className = '' }) => {
  const [internalActiveTab, setInternalActiveTab] = useState(defaultValue)
  
  const activeTab = value !== undefined ? value : internalActiveTab
  const setActiveTab = onValueChange || setInternalActiveTab

  return (
    <div className={cn('w-full', className)}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { activeTab, setActiveTab })
      )}
    </div>
  )
}

const TabsList = ({ children, activeTab, setActiveTab, className = '' }) => {
  return (
    <div className={cn(
      'inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500',
      className
    )}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { activeTab, setActiveTab })
      )}
    </div>
  )
}

const TabsTrigger = ({ children, value, activeTab, setActiveTab, className = '' }) => {
  const isActive = activeTab === value

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        isActive
          ? 'bg-white text-gray-950 shadow-sm'
          : 'text-gray-600 hover:text-gray-900',
        className
      )}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  )
}

const TabsContent = ({ children, value, activeTab, className = '' }) => {
  if (activeTab !== value) return null

  return (
    <div className={cn(
      'mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2',
      className
    )}>
      {children}
    </div>
  )
}

Tabs.List = TabsList
Tabs.Trigger = TabsTrigger
Tabs.Content = TabsContent

export default Tabs