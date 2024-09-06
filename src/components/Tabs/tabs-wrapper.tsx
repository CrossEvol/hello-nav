import React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'

const TabsWrapper = ({
  primaryTitle,
  secondaryTitle,
  primaryNode,
  secondaryNode,
}: {
  primaryTitle: string
  secondaryTitle: string
  primaryNode: React.ReactNode
  secondaryNode: React.ReactNode
}) => {
  const [tabIndex, setTabIndex] = React.useState(0)

  return (
    <div className="mx-auto max-w-md">
      <Tabs selectedIndex={tabIndex} onSelect={index => setTabIndex(index)}>
        <TabList className="flex border-b border-gray-300">
          <Tab className="cursor-pointer border-b-2 border-transparent px-4 py-2 text-gray-600 transition duration-150 ease-in-out hover:text-blue-600 focus:border-blue-600 focus:text-blue-600 focus:outline-none">
            {primaryTitle}
          </Tab>
          <Tab className="cursor-pointer border-b-2 border-transparent px-4 py-2 text-gray-600 transition duration-150 ease-in-out hover:text-blue-600 focus:border-blue-600 focus:text-blue-600 focus:outline-none">
            {secondaryTitle}
          </Tab>
        </TabList>
        <TabPanel className="rounded bg-white shadow">{primaryNode}</TabPanel>
        <TabPanel className="rounded bg-white shadow">{secondaryNode}</TabPanel>
      </Tabs>
    </div>
  )
}

export default TabsWrapper
